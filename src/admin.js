import "./admin.scss";

// Google Drive picker removed

(function ($) {
  $(document).ready(function () {
    //import data
    // $(document).on("click", ".fpdf_import_data", function (e) {
    //   e.preventDefault();
    //   $.ajax({
    //     url: fpdfAdmin.ajaxUrl,
    //     data: {
    //       action: "fpdf_import_data",
    //     },
    //     success: (data) => {
    //       const result = JSON.parse(data);
    //       if (result.success === true) {
    //         location.href = location.href + "?pdfp-import=success";
    //       }
    //     },
    //   });
    // });

    // "Turn on watermarking" in the Watermark tab's intro card. CSF renders a switcher
    // as a styled div over a hidden input and binds its own click handler, so flipping it
    // is a click on .csf--switcher -- setting the input's value directly would change the
    // stored value without repainting the control or re-running the dependency pass.
    $(document).on("click", ".pdfp-wm-intro__go", function (e) {
      e.preventDefault();
      var id = $(this).data("pdfp-enable");
      var $input = $('input[data-depend-id="' + id + '"]');
      if ($input.val() !== "1") {
        $input.closest(".csf--switcher").trigger("click");
      }
    });

    /**
     * Offer only the themes this build can actually draw.
     *
     * CSF builds image_select from a static option list and has no per-option
     * dependency, so the filtering happens here. The map is localised from
     * pdfp_watermark_themes(), which is also what the resolver reads, so the two cannot
     * drift apart.
     *
     * pdfp_watermark_thumbs() already filters the list to what this build may draw, so
     * on a stock install every option here is valid. The pass still runs: it is what
     * moves the selection off a theme carried in from Pro, and what keeps the row honest
     * if the pdfp_watermark_free_themes filter ever widens it.
     */
    function pdfpSyncWatermarkThemes() {
      var map = (window.fpdfAdmin && fpdfAdmin.watermarkThemeTypes) || null;
      if (!map) return;

      var free = (window.fpdfAdmin && fpdfAdmin.watermarkFreeThemes) || null;

      // The mark type that will actually RENDER, which on this build is always text --
      // the resolver clamps it there no matter what meta holds. Read from the DOM only
      // if a Mark Type row ever exists again.
      var type = free ? "text" : ($('input[data-depend-id="watermark_type"]:checked').val() || "text");
      var $first = null;
      var stillValid = false;

      $('input[data-depend-id="watermark_theme"]').each(function () {
        var $input = $(this);
        var $item = $input.closest(".csf--image");
        var key = $input.val();
        var types = map[key];
        var ok = !types || $.inArray(type, types) !== -1;
        var locked = free && $.inArray(key, free) === -1;

        $item.toggle(!!(ok && !locked));

        if (ok && !locked) {
          if (!$first) $first = $item;
          if ($input.is(":checked")) stillValid = true;
        }
      });

      // The chosen theme cannot be drawn here; fall back to the first one that can, the
      // way pickMarkType() does in the block sidebar. Clicking CSF's own wrapper keeps
      // the checkmark and the dependency pass in step.
      if (!stillValid && $first) $first.trigger("click");
    }

    $(document).on("change", 'input[data-depend-id="watermark_type"]', pdfpSyncWatermarkThemes);
    pdfpSyncWatermarkThemes();

    // set cookie
    $(".fpdf_import_notice").on("click", function () {
      setCookie("fpdf_import_notice", "1", 17280000);
    });

    // set cookie function
    function setCookie(cookieName, cookieValue, expiryInSeconds) {
      var expiry = new Date();
      expiry.setTime(expiry.getTime() + 1000 * expiryInSeconds);
      document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expiry.toGMTString() + ";path=/";
    }

    // copy shortcode

    $(document).on("click", ".pdfp_front_shortcode input", function (e) {
      e.preventDefault();

      const field = this;
      const text = $(field).data("value");

      // The field now displays the shortcode itself, so unlike the old version this must
      // not overwrite its value -- it selects what is already there. The async clipboard
      // API is preferred; execCommand is the fallback for http origins and older browsers,
      // and it needs a real selection to work at all.
      const done = () => $(field).parent().find(".htooltip").text("Copied");

      field.select();
      field.setSelectionRange(0, String(text).length);

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, () => {
          document.execCommand("copy");
          done();
        });
        return;
      }

      document.execCommand("copy");
      done();
    });

    $(document).on("click", ".pdfp_shortcode_copy_btn", function (e) {
      e.preventDefault();

      const text = $(this).data("clipboard-text");
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      if ($(this).data('type') === 'icon') {
        $(this).css("width", "18px");
        setTimeout(() => {
          $(this).css("width", "22px");
        }, 200);
      } else {
        $(this).text("Copied!");
        setTimeout(() => {
          $(this).text(text);
        }, 2000);
      }
    });

    // Copy Quick Embed Shortcode
    $(document).on("click", ".pdfp-copy-shortcode", function (e) {
      e.preventDefault();
      const $btn = $(this);
      const text = $btn.data("shortcode");
      const $textSpan = $btn.find(".copy-text");
      const originalText = $textSpan.text();

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          $btn.addClass("copied");
          $textSpan.text("Copied!");
          setTimeout(() => {
            $btn.removeClass("copied");
            $textSpan.text(originalText);
          }, 2000);
        });
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        
        $btn.addClass("copied");
        $textSpan.text("Copied!");
        setTimeout(() => {
          $btn.removeClass("copied");
          $textSpan.text(originalText);
        }, 2000);
      }
    });
  });
  // Delegated, so it also covers rows drawn after load (quick edit, AJAX paging).
  $(document).on("mouseleave", ".pdfp_front_shortcode", function () {
    $(this).find(".htooltip").text("Copy to clipboard");
  });
  // $(".pdfp_front_shortcode input").on("click", function (e) {});
})(jQuery);
