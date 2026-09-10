import { useRef, useEffect, useState } from "react";
import toSiteRelativeUrl from "../../../../hooks/utils/toSiteRelativeUrl";

const FlipbookViewer = ({ attributes, source, viewerType = "flipbook", isRtl = false, theme = "light" }) => {
    const containerRef = useRef(null);
    const flipbookRef = useRef(null);

    const { initialPage, print, downloadButton, thumbMenu, height: attrHeight, onlyPDF, popupOptions, sidebarOpen, fullscreenButton, socialShare, actionsPosition, flipbookSound = true, progressiveLoading = true, keyboardNav = false } = attributes || {};

    // dFlip fetches the PDF and the gallery images itself, so they have to be
    // root-relative too or a proxied page reaches for the internal host.
    const pdfUrl = toSiteRelativeUrl(source || attributes?.file?.url || attributes?.file);

    // Image-gallery flipbook: when enabled with images, dFlip renders an array of image
    // URLs as pages (providerType "image") instead of loading a PDF.
    const flipbookImages = Array.isArray(attributes?.flipbookImages) ? attributes.flipbookImages.filter(Boolean).map(toSiteRelativeUrl) : [];
    const useImages = attributes?.flipbookSourceType === "images" && flipbookImages.length > 0;
    const dflipSource = useImages ? flipbookImages : pdfUrl;

    const isPopup = popupOptions?.enabled;
    const [isFullscreen, setIsFullscreen] = useState(false);

    // The block editor renders the canvas in an iframe while this component runs in the
    // top window, so the fullscreen state lives on the container's own document -- the
    // top-level `document` only ever reports the <iframe> as its fullscreen element.
    const ownerDoc = () => containerRef.current?.ownerDocument || document;

    // dFlip fullscreens its own container, so the browser paints nothing outside it --
    // including the .close control that sits in .iframe_wrapper. Put a close button
    // inside the fullscreen container instead, for both ways in: the plugin's
    // fullscreen button and dFlip's own toolbar control.
    const syncDflipCloseButton = () => {
        const container = containerRef.current;
        if (!container) return;

        const doc = ownerDoc();
        const fsEl = doc.fullscreenElement;
        const isOurs = fsEl && (fsEl === container || container.contains(fsEl));

        if (!isOurs) {
            container.querySelectorAll('.pdfp_dflip_close').forEach(el => el.remove());
            return;
        }

        if (fsEl.querySelector(':scope > .pdfp_dflip_close')) return;

        const closeBtn = doc.createElement('span');
        closeBtn.className = 'pdfp_dflip_close';
        closeBtn.setAttribute('role', 'button');
        closeBtn.setAttribute('tabindex', '0');
        closeBtn.setAttribute('aria-label', 'Close fullscreen');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            if (doc.fullscreenElement) doc.exitFullscreen();
        });
        fsEl.appendChild(closeBtn);
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const currentFullscreen = !!ownerDoc().fullscreenElement;
            setIsFullscreen(currentFullscreen);
            syncDflipCloseButton();
            if (flipbookRef.current) {
                window.dispatchEvent(new Event('resize'));
            }
        };

        const initFlipbook = async () => {
            try {
                if (containerRef.current && window.jQuery && (pdfUrl || useImages)) {
                    if (containerRef.current.dataset.dflipInitialized === 'true') {
                        return;
                    }

                    // Map the chosen viewer to a dFlip viewerType:
                    //  - "scroll" -> dFlip "reader" (continuous vertical scroll)
                    //  - "slider" -> dFlip "slider" (one page at a time, slide/swipe)
                    //  - "flipbook" (default) -> page-turning book
                    const dflipViewerType = viewerType === "scroll" ? "reader" : (viewerType === "slider" ? "slider" : "flipbook");

                    // Map attributes to dFlip options
                    const options = {
                        viewerType: dflipViewerType,
                        openPage: initialPage > 0 ? initialPage : 1,
                        showDownloadControl: useImages ? false : downloadButton,
                        showPrintControl: print,
                        autoOpenThumbnail: sidebarOpen,
                        // Dark theme only shades the area AROUND the pages, never the page content itself.
                        backgroundColor: theme === "dark" ? "#2a2a2e" : "transparent",
                        controlsPosition: actionsPosition,
                        // Page-turn sound (Flipbook/Slider only; dFlip's "reader"/scroll mode is always silent).
                        // dFlip defaults this to true, so we pass it explicitly to keep it user-controllable.
                        enableSound: flipbookSound !== false,
                        // Progressive/range loading: dFlip forwards this to its internal pdf.js getDocument.
                        // Default (range on) = progressive; turning it off forces the whole file to download first.
                        disableRange: progressiveLoading === false,
                        // Keyboard navigation: dFlip's arrow-key nav is gated by arrowKeysAction.
                        // Uniform control across viewers -> only navigate when the toggle is on.
                        arrowKeysAction: keyboardNav ? "nav" : "none",
                        // RTL reading direction (dFlip maps direction 2 -> RTL, anything else -> LTR).
                        direction: isRtl ? 2 : 1,
                    };

                    // Handle hidden controls
                    const hiddenControls = [];
                    if (!thumbMenu) hiddenControls.push("thumbnail");
                    if (!fullscreenButton) hiddenControls.push("fullScreen");
                    if (socialShare && !socialShare.enabled) hiddenControls.push("share");

                    if (hiddenControls.length > 0) {
                        options.hideControls = hiddenControls.join(",");
                    }

                    // Handle Reader Mode (onlyPDF)
                    if (onlyPDF) {
                        options.hideToolbar = true;
                        options.allControls = "";
                    }

                    // Map height - use 100% if in popup or if we detect we're likely going fullscreen
                    const isNowFullscreen = !!ownerDoc().fullscreenElement;
                    if (isPopup || isNowFullscreen) {
                        options.height = '100%';
                    } else if (attrHeight) {
                        options.height = typeof attrHeight === 'object' ? attrHeight.desktop : attrHeight;
                    }

                    containerRef.current.dataset.dflipInitialized = 'true';
                    flipbookRef.current = window.jQuery(containerRef.current).flipBook(dflipSource, options);

                    // Publish the instance on the container element. The watermark layer
                    // needs dFlip's own book geometry (viewer.leftSheetWidth/Height/Top)
                    // to sit the mark on the pages instead of the whole viewer -- in 3D
                    // mode the pages are drawn into a canvas, so there is no page box in
                    // the DOM to attach to. Slider needs the same handle for a different
                    // reason: viewer.pages is the only sound source of a page's number
                    // there, so Pages ("First page only") depends on it too.
                    try {
                        const inst = flipbookRef.current;
                        containerRef.current.__pdfpFlipbook = (inst && (inst[0] || inst)) || null;
                    } catch (e) {
                        // Geometry is optional: without it the watermark layer covers the
                        // whole viewer instead of just the book.
                        console.warn('PDF Poster: could not publish flipbook geometry', e);
                    }
                }
            } catch (error) {
                console.error('Error loading dFlip:', error);
            }
        };

        const handleFlipbookFullscreen = (e) => {
            // Check if this event is for this specific wrapper/viewer
            const wrapper = containerRef.current?.closest('.pdfp_wrapper');
            if (e.detail?.wrapper === wrapper && flipbookRef.current) {
                if (flipbookRef.current.switchFullscreen) {
                    flipbookRef.current.switchFullscreen();
                } else if (flipbookRef.current.toggleFullscreen) {
                    flipbookRef.current.toggleFullscreen();
                }
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initFlipbook();
                    window.dispatchEvent(new Event('resize'));
                }
            });
        }, { threshold: 0.1 });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        const fsDoc = ownerDoc();
        fsDoc.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('PDFP_TOGGLE_FLIPBOOK_FULLSCREEN', handleFlipbookFullscreen);

        return () => {
            observer.disconnect();
            fsDoc.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('PDFP_TOGGLE_FLIPBOOK_FULLSCREEN', handleFlipbookFullscreen);
            if (flipbookRef.current && typeof flipbookRef.current.dispose === 'function') {
                try {
                    flipbookRef.current.dispose();
                } catch (err) {
                    console.warn('dFlip dispose error:', err);
                }
            }
            if (containerRef.current) {
                containerRef.current.dataset.dflipInitialized = 'false';
                try {
                    containerRef.current.innerHTML = '';
                } catch(e) {}
            }
        };
    }, [containerRef, attributes, pdfUrl, isPopup, viewerType]);

    const displayHeight = typeof attrHeight === 'object' ? attrHeight.desktop : attrHeight;
    const computedHeight = (isPopup || isFullscreen) ? '100%' : (displayHeight || 'auto');

    const exitFullScreen = () => {
        const doc = ownerDoc();
        if (doc.fullscreenElement) {
            doc.exitFullscreen();
        } else {
            const wrapper = containerRef.current?.closest('.pdfp_wrapper');
            if (wrapper) {
                wrapper.classList.remove('pdfp_fullscreen_opened');
            }
        }
    };

    return (
        <div 
          className={`dflipWrapper ${(isPopup || isFullscreen) ? 'pdfp_popup_wrapper' : ''}`} 
          style={{ height: computedHeight }}
        >
            <div className="iframe_wrapper">
                <div ref={containerRef} className="dflip-container" />
                <span className="close" onClick={exitFullScreen}>
                    &times;
                </span>
            </div>
        </div>
    );
};

export default FlipbookViewer;
