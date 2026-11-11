/**
 * PDF Poster -- Auto Thumbnail (wp-admin only).
 *
 * Makes the cover of a Media Library PDF by drawing one page with the pdf.js the plugin
 * already ships, then hands the image to pdfp/v1/cover/{id}. Runs in the browser of
 * whoever uploads or edits, so no host needs Imagick or Ghostscript, and a page view on
 * the front end never renders anything.
 *
 * Triggers, all feeding one queue (2 PDFs at a time):
 *   - an upload through the media modal / Media Library (wp.Uploader)
 *   - an upload through the block editor (apiFetch POST /wp/v2/media)
 *   - anyone looking at a PDF without a cover (attachment details, the block's Cover
 *     panel, the poster screen) -- this is what heals PDFs uploaded before the feature
 *   - the Settings bulk button and the All PDF Posters bulk action
 *
 * window.pdfpCover is the store the block editor reads (src/hooks/useCoverState.js).
 */
(function () {
    'use strict';

    var C = window.pdfpCoverConfig;
    if (!C || window.pdfpCover) {
        return;
    }

    var MAX_PARALLEL = 2;
    var TIMEOUT_MS = 20000;
    var t = C.i18n || {};

    /* ------------------------------------------------------------------------
     * REST
     * --------------------------------------------------------------------- */

    function api(path, options) {
        options = options || {};
        var headers = { 'X-WP-Nonce': C.nonce };
        var body = options.body;
        if (body && !(body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(body);
        }
        return fetch(C.rest + path, {
            method: options.method || 'GET',
            credentials: 'same-origin',
            headers: headers,
            body: body
        }).then(function (response) {
            return response.json().catch(function () { return null; }).then(function (json) {
                if (!response.ok) {
                    var error = new Error((json && json.message) || response.statusText);
                    error.code = json && json.code;
                    throw error;
                }
                return json;
            });
        });
    }

    /* ------------------------------------------------------------------------
     * pdf.js, loaded only when the first cover is actually made
     * --------------------------------------------------------------------- */

    var libPromise = null;
    function loadPdfJs() {
        if (window.pdfjsLib && window.pdfjsLib.getDocument) {
            var existing = window.pdfjsLib;
            if (!existing.GlobalWorkerOptions.workerSrc) {
                existing.GlobalWorkerOptions.workerSrc = C.worker;
            }
            return Promise.resolve(existing);
        }
        if (!libPromise) {
            libPromise = new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = C.pdfjs;
                script.async = true;
                script.onload = function () {
                    var lib = window.pdfjsLib;
                    if (!lib || !lib.getDocument) {
                        reject(new Error('pdf.js did not load'));
                        return;
                    }
                    lib.GlobalWorkerOptions.workerSrc = C.worker;
                    resolve(lib);
                };
                script.onerror = function () {
                    libPromise = null;
                    reject(new Error('pdf.js did not load'));
                };
                document.head.appendChild(script);
            });
        }
        return libPromise;
    }

    function supportsWebp() {
        try {
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } catch (e) {
            return false;
        }
    }

    function reasonOf(error) {
        var name = (error && error.name) || '';
        if (name === 'PasswordException') return 'password';
        if (name === 'InvalidPDFException') return 'invalid';
        if (name === 'TimeoutError') return 'timeout';
        if (name === 'MissingPDFException' || name === 'UnexpectedResponseException' || /fetch|network|cors/i.test((error && error.message) || '')) return 'unreadable';
        return 'failed';
    }

    /** Draw one page to an image Blob. Reads only the bytes that page needs. */
    function renderPage(url, page, width, format) {
        return loadPdfJs().then(function (lib) {
            // No streaming and no auto-fetch: with range requests only the bytes page 1
            // needs are downloaded, even from a 300-page PDF.
            var task = lib.getDocument({ url: url, disableAutoFetch: true, disableStream: true, isEvalSupported: false });
            var timer;
            var timeout = new Promise(function (_, reject) {
                timer = setTimeout(function () {
                    var error = new Error('timeout');
                    error.name = 'TimeoutError';
                    reject(error);
                }, TIMEOUT_MS);
            });

            var work = task.promise.then(function (pdf) {
                var number = Math.min(Math.max(1, page), pdf.numPages);
                return pdf.getPage(number).then(function (pdfPage) {
                    var base = pdfPage.getViewport({ scale: 1 });
                    var viewport = pdfPage.getViewport({ scale: width / base.width });
                    var canvas = document.createElement('canvas');
                    canvas.width = Math.floor(viewport.width);
                    canvas.height = Math.floor(viewport.height);
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    return pdfPage.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
                        var mime = format === 'webp' && supportsWebp() ? 'image/webp' : 'image/jpeg';
                        return new Promise(function (resolve, reject) {
                            canvas.toBlob(function (blob) {
                                canvas.width = canvas.height = 0; // free the bitmap now
                                blob ? resolve({ blob: blob, page: number }) : reject(new Error('encode failed'));
                            }, mime, 0.85);
                        });
                    });
                });
            });

            return Promise.race([work, timeout]).finally(function () {
                clearTimeout(timer);
                task.destroy();
            });
        });
    }

    /* ------------------------------------------------------------------------
     * Store + queue
     * --------------------------------------------------------------------- */

    var states = new Map();   // id -> last known state
    var jobs = new Map();     // id -> promise of a running/queued job
    var queue = [];
    var active = 0;

    function emit(id, state) {
        states.set(id, state);
        window.dispatchEvent(new CustomEvent('pdfp:cover', { detail: { id: id, state: state } }));
        if (state && !state.making && state.cover) refreshMediaModel(id);
    }

    /** Should this PDF get a cover without anyone asking? */
    function wantsCover(state) {
        if (!C.auto || !state) return false;
        if (state.cover) return !!(state.stale && state.auto);
        return !state.removed && !state.error;
    }

    function fetchState(id) {
        return api('cover/' + id).then(function (state) {
            emit(id, state);
            return state;
        });
    }

    function get(id) {
        id = Number(id);
        if (!id) return Promise.resolve(null);
        if (jobs.has(id)) return Promise.resolve(states.get(id) || null);
        var known = states.get(id);
        var ready = known ? Promise.resolve(known) : fetchState(id);
        return ready.then(function (state) {
            if (wantsCover(state)) {
                generate(id, { state: state });
            }
            return states.get(id) || state;
        });
    }

    function generate(id, options) {
        id = Number(id);
        options = options || {};
        if (!id) return Promise.resolve(null);
        if (jobs.has(id)) return jobs.get(id);

        var job = new Promise(function (resolve) {
            queue.push({ id: id, force: !!options.force, state: options.state || null, done: resolve });
            pump();
        });
        jobs.set(id, job);
        job.finally(function () { jobs.delete(id); });
        return job;
    }

    function pump() {
        while (active < MAX_PARALLEL && queue.length) {
            var next = queue.shift();
            active++;
            run(next).then(next.done, function () { next.done(states.get(next.id) || null); }).finally(function () {
                active--;
                pump();
            });
        }
    }

    function run(job) {
        var id = job.id;
        var start = job.state ? Promise.resolve(job.state) : fetchState(id);

        return start.then(function (state) {
            if (!job.force && !wantsCover(state)) {
                return state;
            }

            emit(id, Object.assign({}, state, { making: true }));

            return renderPage(state.url, C.page, C.width, C.format).then(function (result) {
                var form = new FormData();
                var ext = result.blob.type === 'image/webp' ? 'webp' : 'jpg';
                form.append('file', result.blob, 'cover.' + ext);
                form.append('page', String(result.page));
                if (job.force) form.append('force', '1');
                return api('cover/' + id, { method: 'POST', body: form });
            }, function (error) {
                return api('cover/' + id, { method: 'POST', body: { error: reasonOf(error) } });
            }).then(function (saved) {
                emit(id, saved);
                return saved;
            }, function () {
                var failed = Object.assign({}, state, { making: false, error: state.error || 'failed' });
                emit(id, failed);
                return failed;
            });
        });
    }

    function replace(id, imageId) {
        return api('cover/' + id, { method: 'POST', body: { image_id: imageId } }).then(function (state) {
            emit(Number(id), state);
            return state;
        });
    }

    function remove(id) {
        return api('cover/' + id, { method: 'DELETE' }).then(function (state) {
            emit(Number(id), state);
            return state;
        });
    }

    window.pdfpCover = {
        get: get,
        peek: function (id) { return states.get(Number(id)) || null; },
        generate: generate,
        replace: replace,
        remove: remove
    };

    /** Let the Media Library grid show the new cover without a reload. */
    function refreshMediaModel(id) {
        try {
            var attachment = window.wp && wp.media && wp.media.attachment && wp.media.attachment(id);
            if (attachment && attachment.get('url') && !refreshMediaModel.busy[id]) {
                refreshMediaModel.busy[id] = true;
                attachment.fetch().always(function () { delete refreshMediaModel.busy[id]; });
            }
        } catch (e) { /* the grid is optional */ }
    }
    refreshMediaModel.busy = {};

    /* ------------------------------------------------------------------------
     * Upload hooks
     * --------------------------------------------------------------------- */

    function isPdf(mime) {
        return mime === 'application/pdf' || mime === 'application/x-pdf';
    }

    function hookUploader() {
        var Uploader = window.wp && wp.Uploader;
        if (!Uploader || Uploader.prototype.__pdfpCover) return;
        var original = Uploader.prototype.success;
        Uploader.prototype.success = function (attachment) {
            if (typeof original === 'function') original.apply(this, arguments);
            try {
                var mime = attachment && (attachment.get ? attachment.get('mime') : attachment.mime);
                var id = attachment && (attachment.get ? attachment.get('id') : attachment.id);
                if (C.auto && id && isPdf(mime)) get(id);
            } catch (e) { /* never break an upload */ }
        };
        Uploader.prototype.__pdfpCover = true;
    }

    function hookApiFetch() {
        var apiFetch = window.wp && wp.apiFetch;
        if (!apiFetch || apiFetch.__pdfpCover) return;
        apiFetch.use(function (options, next) {
            var result = next(options);
            var path = (options.path || options.url || '').split('?')[0];
            if (C.auto && (options.method || '').toUpperCase() === 'POST' && /\/wp\/v2\/media\/?$/.test(path)) {
                Promise.resolve(result).then(function (media) {
                    if (media && media.id && isPdf(media.mime_type)) get(media.id);
                }).catch(function () {});
            }
            return result;
        });
        apiFetch.__pdfpCover = true;
    }

    /* ------------------------------------------------------------------------
     * Admin fields: attachment details row, poster Cover box, list column
     * --------------------------------------------------------------------- */

    var ERRORS = {
        unreadable: t.unreadable, password: t.password, invalid: t.invalid,
        timeout: t.timeout, failed: t.failed
    };

    function el(tag, attrs, text) {
        var node = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
        if (text) node.textContent = text;
        return node;
    }

    function statusText(state) {
        if (!state) return t.checking;
        if (state.making) return t.making;
        if (state.cover) return state.auto ? (t.madeFrom || '').replace('%d', state.page || 1) : t.chosen;
        if (state.removed) return t.removed;
        if (state.error) return ERRORS[state.error] || t.failed;
        return C.auto ? t.waiting : t.none;
    }

    function renderField(field, state) {
        var id = Number(field.getAttribute('data-id'));
        var compact = field.hasAttribute('data-compact');
        field.textContent = '';
        field.classList.toggle('is-making', !!(state && state.making));

        var thumb = el('span', { 'class': 'pdfp-cover-field__thumb' });
        if (state && state.thumb) {
            thumb.appendChild(el('img', { src: state.thumb, alt: '' }));
        } else {
            thumb.appendChild(el('span', { 'class': 'pdfp-cover-field__doc' }, 'PDF'));
        }
        field.appendChild(thumb);

        var body = el('span', { 'class': 'pdfp-cover-field__body' });
        body.appendChild(el('span', { 'class': 'pdfp-cover-field__status' + (state && state.error && !state.cover ? ' is-error' : '') }, statusText(state)));

        if (!compact) {
            var actions = el('span', { 'class': 'pdfp-cover-field__actions' });
            var busy = !state || state.making;
            var regen = el('button', { type: 'button', 'class': 'button button-small', 'data-pdfp-cover-action': 'regenerate', 'data-id': String(id) }, state && state.cover ? t.regenerate : t.make);
            var swap = el('button', { type: 'button', 'class': 'button button-small', 'data-pdfp-cover-action': 'replace', 'data-id': String(id) }, t.replace);
            if (busy) { regen.disabled = true; swap.disabled = true; }
            actions.appendChild(regen);
            actions.appendChild(swap);
            if (state && state.cover) {
                actions.appendChild(el('button', { type: 'button', 'class': 'button-link button-link-delete', 'data-pdfp-cover-action': 'remove', 'data-id': String(id) }, t.remove));
            }
            body.appendChild(actions);
        }
        field.appendChild(body);
    }

    function bindField(field) {
        if (field.__pdfpBound) return;
        field.__pdfpBound = true;
        var id = Number(field.getAttribute('data-id'));
        if (!id) return;
        var known = states.get(id);
        renderField(field, known || null);
        if (!field.hasAttribute('data-passive')) get(id);
        else if (!known) fetchState(id).catch(function () {});
    }

    window.addEventListener('pdfp:cover', function (event) {
        var id = event.detail.id;
        document.querySelectorAll('[data-pdfp-cover-field][data-id="' + id + '"]').forEach(function (field) {
            renderField(field, event.detail.state);
        });
    });

    document.addEventListener('click', function (event) {
        var button = event.target.closest && event.target.closest('[data-pdfp-cover-action]');
        if (!button) return;
        event.preventDefault();
        var id = Number(button.getAttribute('data-id'));
        var action = button.getAttribute('data-pdfp-cover-action');

        if (action === 'regenerate') {
            generate(id, { force: true });
        } else if (action === 'remove') {
            remove(id);
        } else if (action === 'replace' && window.wp && wp.media) {
            var frame = wp.media({ title: t.chooseCover, button: { text: t.useImage }, library: { type: 'image' }, multiple: false });
            frame.on('select', function () {
                var picked = frame.state().get('selection').first();
                if (picked) replace(id, picked.get('id'));
            });
            frame.open();
        }
    });

    function scan(root) {
        (root || document).querySelectorAll('[data-pdfp-cover-field]').forEach(bindField);
    }

    /* ------------------------------------------------------------------------
     * Bulk: Settings button and the All PDF Posters bulk action
     * --------------------------------------------------------------------- */

    function bulkSettings() {
        var box = document.getElementById('pdfp-cover-bulk');
        if (!box) return;
        var button = box.querySelector('[data-pdfp-bulk-start]');
        var bar = box.querySelector('progress');
        var label = box.querySelector('[data-pdfp-bulk-label]');
        var total = Number(box.getAttribute('data-total')) || 0;
        var withCover = Number(box.getAttribute('data-with')) || 0;
        var running = false;
        var tried = {};

        function paint(text) {
            bar.max = Math.max(total, 1);
            bar.value = withCover;
            label.textContent = text || (t.counts || '').replace('%1$d', withCover).replace('%2$d', total);
        }
        paint();

        button.addEventListener('click', function () {
            if (running) { running = false; button.textContent = t.bulkStart; return; }
            running = true;
            button.textContent = t.pause;

            (function batch() {
                if (!running) return;
                api('covers/missing?limit=10').then(function (data) {
                    total = data.counts.total;
                    withCover = data.counts.withCover;
                    paint();
                    // A PDF whose save failed without a recorded reason would come back in
                    // every batch; stop rather than loop on it.
                    var fresh = data.items.filter(function (item) { return !tried[item.id]; });
                    fresh.forEach(function (item) { tried[item.id] = true; });
                    if (!fresh.length) {
                        running = false;
                        button.textContent = t.bulkStart;
                        paint(t.allDone);
                        return;
                    }
                    return Promise.all(fresh.map(function (item) {
                        return generate(item.id).then(function (state) {
                            if (state && state.cover) { withCover++; paint(); }
                        });
                    })).then(batch);
                }).catch(function (error) {
                    running = false;
                    button.textContent = t.bulkStart;
                    paint(error.message);
                });
            })();
        });
    }

    function bulkPosters() {
        var ids = (C.bulk || []).map(Number).filter(Boolean);
        if (!ids.length) return;
        var notice = el('div', { 'class': 'notice notice-info pdfp-cover-notice' });
        var text = el('p');
        notice.appendChild(text);
        var anchor = document.querySelector('.wrap hr.wp-header-end') || document.querySelector('.wrap h1');
        if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(notice, anchor.nextSibling);

        var done = 0;
        function paint() { text.textContent = (t.bulkProgress || '').replace('%1$d', done).replace('%2$d', ids.length); }
        paint();
        Promise.all(ids.map(function (id) {
            return generate(id).then(function () { done++; paint(); });
        })).then(function () {
            notice.className = 'notice notice-success is-dismissible pdfp-cover-notice';
            text.textContent = t.bulkDone;
        });
    }

    /* ------------------------------------------------------------------------
     * Boot
     * --------------------------------------------------------------------- */

    function boot() {
        hookUploader();
        hookApiFetch();
        scan(document);
        bulkSettings();
        bulkPosters();

        // Attachment details render later, inside the media modal.
        if (window.MutationObserver) {
            var queued = false;
            new MutationObserver(function () {
                if (queued) return;
                queued = true;
                requestAnimationFrame(function () { queued = false; scan(document); });
            }).observe(document.body, { childList: true, subtree: true });
        }
    }

    hookUploader();
    hookApiFetch();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
