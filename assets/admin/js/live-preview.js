/**
 * PDF Poster - Live Preview (classic edit screen).
 *
 * Reads the values sitting in the metabox and posts a COPY of them into the preview
 * iframe through a separate body-level form. form#post itself is never submitted or
 * modified, so previewing can never save, autosave or otherwise touch the poster.
 * Server side: includes/admin/class-pdfp-livepreview.php.
 */
(function ($) {
  $(function () {
    var $trigger = $("#pdfp-preview-trigger");
    var $modal = $("#pdfp-preview-modal");
    var $form = $("#pdfp-preview-form");
    var $frame = $("#pdfp-preview-frame");
    var $postForm = $("form#post");

    if (!$trigger.length || !$modal.length || !$form.length || !$frame.length || !$postForm.length) {
      return;
    }

    var strings = (window.pdfpLivePreview && window.pdfpLivePreview.i18n) || {};
    var $stage = $modal.find(".pdfp-preview-stage");
    var $status = $modal.find(".pdfp-preview-status");

    // Sit immediately left of Save / Update. WordPress offers no hook inside
    // #publishing-action, so the button is printed in the footer and moved here.
    var $publishing = $("#publishing-action");
    if ($publishing.length) {
      $publishing.prepend($trigger);
      $("#major-publishing-actions").addClass("pdfp-has-preview");
    } else {
      $("#major-publishing-actions").append($trigger);
    }
    $trigger.prop("hidden", false);

    /* ------------------------------------------------------------------ render */

    // A form-target navigation never updates the iframe's src, so load state is tracked here.
    var pending = false;
    var retried = false;

    var setStatus = function (text, state) {
      $status.text(text || "").attr("data-state", state || "");
      $modal.toggleClass("is-loading", state === "busy");
    };

    // Every top-level _fpdf key the form renders, including fields that currently submit
    // nothing (an unticked checkbox group). PHP needs it to tell "cleared" from "not on
    // screen", otherwise an emptied field would keep previewing its saved value.
    var renderedKeys = function () {
      var keys = {};
      $postForm.find('[name^="_fpdf["]').each(function () {
        var match = this.name.match(/^_fpdf\[([A-Za-z0-9_-]+)\]/);
        if (match) {
          keys[match[1]] = true;
        }
      });
      return Object.keys(keys).join(",");
    };

    var render = function (isRetry) {
      // CodeMirror (Custom CSS) keeps its value in the editor until it syncs; push it back.
      $postForm.find(".CodeMirror").each(function () {
        if (this.CodeMirror && typeof this.CodeMirror.save === "function") {
          this.CodeMirror.save();
        }
      });

      // serializeArray() honours checked state, selects and disabled inputs, so the payload
      // is exactly what a real save would submit.
      var fields = $postForm.serializeArray().filter(function (field) {
        return field.name.indexOf("_fpdf[") === 0 || field.name === "post_title";
      });

      $form.empty();
      fields.forEach(function (field) {
        $("<input>", { type: "hidden", name: field.name }).val(field.value).appendTo($form);
      });
      $("<input>", { type: "hidden", name: "pdfp_rendered_keys" }).val(renderedKeys()).appendTo($form);

      if (!isRetry) {
        retried = false;
      }
      pending = true;
      setStatus(strings.updating, "busy");
      $form[0].submit();
    };

    // Only OUR rendered document counts as loaded. The iframe also fires load for its
    // implicit blank document, and treating that as success would hide a lost POST.
    var isPreviewDocument = function (frame) {
      try {
        var doc = frame.contentDocument;
        return !!(doc && doc.body && doc.body.classList.contains("pdfp-preview-document"));
      } catch (e) {
        return false;
      }
    };

    $frame.on("load", function () {
      if (!pending) {
        return;
      }
      if (isPreviewDocument(this)) {
        pending = false;
        retried = false;
        setStatus(strings.ready, "ready");
        return;
      }
      // Raced by another navigation -- re-send once; past that, the user has Refresh.
      if (!retried) {
        retried = true;
        render(true);
        return;
      }
      pending = false;
      setStatus(strings.failed, "error");
    });

    /* ------------------------------------------------------------------- modal */

    var isOpen = false;
    var $returnFocus = $();

    var setDevice = function (device) {
      $stage.attr("data-device", device);
      $modal
        .find(".pdfp-preview-device")
        .removeClass("is-active")
        .attr("aria-pressed", "false")
        .filter('[data-device="' + device + '"]')
        .addClass("is-active")
        .attr("aria-pressed", "true");
    };

    var open = function () {
      if (isOpen) {
        return;
      }
      isOpen = true;
      $returnFocus = $(document.activeElement);

      // Start on the device the metabox is currently editing sizes for.
      var device = $postForm.find('input[name="_fpdf[device_preview]"]:checked').val();
      if (device) {
        setDevice(device);
      }

      $modal.prop("hidden", false);
      $("body").addClass("pdfp-preview-open");
      // Next frame, so the opening transition runs.
      window.requestAnimationFrame(function () {
        $modal.addClass("is-open");
      });
      $modal.find(".pdfp-preview-close").trigger("focus");

      // Always re-render: the settings may have changed since the last look.
      render(false);
    };

    var close = function () {
      if (!isOpen) {
        return;
      }
      isOpen = false;
      $modal.removeClass("is-open").prop("hidden", true);
      $("body").removeClass("pdfp-preview-open");
      if ($returnFocus.length) {
        $returnFocus.trigger("focus");
      }
    };

    $trigger.on("click", function (event) {
      event.preventDefault();
      open();
    });

    $modal.on("click", "[data-pdfp-preview-close]", close);
    $modal.on("click", ".pdfp-preview-refresh", function () {
      render(false);
    });
    $modal.on("click", ".pdfp-preview-device", function () {
      setDevice($(this).data("device"));
    });

    $(document).on("keydown", function (event) {
      if (!isOpen) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      // Keep Tab inside the dialog; the page behind it is covered.
      if (event.key === "Tab") {
        var $focusable = $modal.find("button:visible, iframe");
        var first = $focusable.get(0);
        var last = $focusable.get($focusable.length - 1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  });
})(jQuery);
