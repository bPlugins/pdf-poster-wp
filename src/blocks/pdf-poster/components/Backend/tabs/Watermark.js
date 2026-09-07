import { PanelBody, ToggleControl, TextControl, SelectControl, CheckboxControl, Button } from "@wordpress/components";
import { Notice } from "../../../../../../../bpl-tools/Components";
import { __ } from "@wordpress/i18n";
import { useState, useEffect, useRef } from "react";
import { PDFIcon } from "../../../../../icons/PDF";
import { PanelNewBadge } from "../../../../../Components/NewBadge";
import { THEMES, applyWatermark, resolveWatermark } from "../../Common/watermarkSVG";

/**
 * "Watermark & Branding" panel for the block sidebar.
 *
 * Offers exactly the settings the CSF metabox section offers (PDFP_MetaBox::watermark) --
 * the two must stay interchangeable, because both feed the same block attribute. What
 * differs is only the arrangement:
 *
 *  - collapsible groups instead of one flat column, each header carrying its own current
 *    value so a collapsed group still tells you what it is set to
 *  - a live preview, drawn by the same builder the front end uses
 *  - one short line of help where it earns its place, instead of a paragraph per row
 *  - viewer caveats shown only when the selected viewer is actually affected
 *
 * The Pro half -- the logo mark, the three logo themes, the Custom theme and everything
 * it owns, audience rules and anti-leak stamping -- is NOT rendered here as locked rows.
 * The Premium notice at the foot names it, which is how every other partly-free panel in
 * this build reads (see Actions, Controls and Performance).
 *
 * Entitlement is never decided here in any case: PDFP_Functions::pdfp_watermark_resolve()
 * is the single point every render path funnels through, so a poster imported from Pro
 * degrades to a look this build may draw rather than rendering a Pro one.
 */

const THEME_LABELS = {
  confidential: __("Confidential", "pdf-poster"),
  draft: __("Draft Stamp", "pdf-poster"),
  wash: __("Sample Wash", "pdf-poster"),
  "brand-corner": __("Brand Corner", "pdf-poster"),
  "logo-wash": __("Logo Wash", "pdf-poster"),
  "logo-caption": __("Logo + Caption", "pdf-poster"),
  custom: __("Custom", "pdf-poster"),
};

/**
 * The themes this build may render. Mirrors PDFP_Functions::pdfp_watermark_free_themes()
 * and the clamp in pdfp_watermark_resolve() -- the server is the authority, this list
 * only decides what the panel offers.
 */
const FREE_THEMES = ["confidential", "draft", "wash"];

/** Read back off the resolved look for the preview caption, not offered as controls. */
const COVERAGE = [
  { label: __("Single mark", "pdf-poster"), value: "off" },
  { label: __("Sparse", "pdf-poster"), value: "sparse" },
  { label: __("Normal", "pdf-poster"), value: "normal" },
  { label: __("Dense", "pdf-poster"), value: "dense" },
];

const STRENGTHS = [
  { label: __("Faint", "pdf-poster"), value: "faint" },
  { label: __("Subtle", "pdf-poster"), value: "subtle" },
  { label: __("Medium", "pdf-poster"), value: "medium" },
  { label: __("Strong", "pdf-poster"), value: "strong" },
  { label: __("Solid", "pdf-poster"), value: "solid" },
];

const PAGES = [
  { label: __("All pages", "pdf-poster"), value: "all" },
  { label: __("First page only", "pdf-poster"), value: "first" },
  { label: __("All except the cover", "pdf-poster"), value: "except-first" },
];

/** Tokens the resolver understands, offered as an insert menu rather than a wall of text. */
const PLACEHOLDERS = [
  "{site_name}", "{post_title}", "{file_name}", "{page}", "{pages}",
  "{date}", "{year}", "{user_name}", "{user_email}", "{user_ip}",
];

const DEFAULTS = {
  enabled: false,
  markType: "text",
  theme: "confidential",
  text: "CONFIDENTIAL",
  image: "",
  imageStyle: "grayscale",
  color: "#808080",
  coverage: "normal",
  position: "center",
  strength: "subtle",
  size: "medium",
  angle: "diagonal",
  apply: ["screen"],
  pages: "all",
  audience: "everyone",
  antileak: false,
  stamp: false,
  lock: false,
};

const labelOf = (list, value, fallback = "") => {
  const hit = list.find((o) => o.value === value);
  return hit ? hit.label : fallback;
};

/**
 * A collapsible sub-section. The header shows the group's current value, so a collapsed
 * group is still informative.
 */
const Group = ({ title, summary, desc, children, initialOpen = true }) => {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div className={"pdfp-wm-group" + (open ? " is-open" : "")}>
      <div className="pdfp-wm-group__head">
        <button
          type="button"
          className="pdfp-wm-group__toggle"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="pdfp-wm-group__title">{title}</span>
          {summary ? <span className="pdfp-wm-group__summary">{summary}</span> : null}
          <span className="pdfp-wm-group__chev" aria-hidden="true">{open ? "▴" : "▾"}</span>
        </button>
      </div>
      {open && (
        <div className="pdfp-wm-group__body">
          {desc ? <p className="pdfp-wm-group__desc">{desc}</p> : null}
          {children}
        </div>
      )}
    </div>
  );
};

/** Live page preview, painted by the same builder the front end uses. */
const Preview = ({ wm }) => {
  const ref = useRef(null);
  const key = JSON.stringify(wm);
  const look = resolveWatermark(wm);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    applyWatermark(el, { ...wm, enabled: true, apply: ["screen"] }, { theme: "light" });
  }, [key]);

  return (
    <div className="pdfp-wm-preview">
      <div className="pdfp-wm-preview__stage">
        <div className="pdfp-wm-preview__page" ref={ref}>
          <div className="pdfp-wm-preview__doc">
            <span className="h" />
            <span className="l" /><span className="l" /><span className="l short" />
            <span className="img" />
            <span className="l" /><span className="l" /><span className="l short" />
          </div>
        </div>
      </div>
      <p className="pdfp-wm-preview__cap">
        <span>{__("Preview", "pdf-poster")}</span>
        <strong>{[
          THEME_LABELS[wm.theme] || wm.theme,
          labelOf(COVERAGE, look.coverage).toLowerCase(),
          labelOf(STRENGTHS, look.strength).toLowerCase(),
        ].filter(Boolean).join(" · ")}</strong>
      </p>
    </div>
  );
};

/** How the six cards are dealt: rotation, offset and scale, left to right. */
const FAN = [
  [-16, -30, 0.90], [-10, -18, 0.94], [-4, -6, 0.97],
  [3, 6, 1.00], [9, 18, 0.97], [15, 30, 0.94],
];

const INTRO_CHIPS = [
  __("Text, a logo, or both", "pdf-poster"),
  __("Tiled or one corner mark", "pdf-poster"),
  __("Pick the pages", "pdf-poster"),
  __("Pick who sees it", "pdf-poster"),
];

/**
 * The panel's opening card, shown only while the watermark is off.
 *
 * Twin of PDFP_Functions::pdfp_watermark_intro() — same deck, same words, same order,
 * stacked instead of side by side because the rail is 300px. Without it an author sees
 * one toggle set to Off and no reason to touch it. It fans all six looks deliberately:
 * this is the card that sells the feature, and the notice at the foot of the panel says
 * which of them a licence adds.
 */
const Intro = ({ pluginDir, onEnable }) => {
  const keys = Object.keys(THEMES).filter((k) => k !== "custom");
  return (
    <div className="pdfp-wm-intro">
      {pluginDir ? (
        <div className="pdfp-wm-intro__fan">
          {keys.map((k, i) => (
            <img
              key={k}
              className="pdfp-wm-intro__card"
              alt={THEME_LABELS[k] || k}
              title={THEME_LABELS[k] || k}
              src={`${pluginDir}assets/admin/img/watermark/${k}.svg`}
              style={{ "--r": `${FAN[i][0]}deg`, "--x": `${FAN[i][1]}px`, "--s": FAN[i][2], zIndex: i }}
            />
          ))}
        </div>
      ) : null}
      <div className="pdfp-wm-intro__say">
        <p className="pdfp-wm-intro__count">
          <b>{keys.length}</b> {__("looks, ready to go", "pdf-poster")}
        </p>
        <h4>{__("Stamp every page — the file is never touched.", "pdf-poster")}</h4>
        <p className="pdfp-wm-intro__sub">
          {__("The mark is drawn over the document as it is displayed, so your PDF is never altered. Pick one of these and you are done.", "pdf-poster")}
        </p>
        <ul className="pdfp-wm-intro__chips">
          {INTRO_CHIPS.map((c) => <li key={c}>{c}</li>)}
        </ul>
        <Button variant="primary" className="pdfp-wm-intro__go" onClick={onEnable}>
          {__("Turn on watermarking", "pdf-poster")} <span aria-hidden="true">→</span>
        </Button>
      </div>
    </div>
  );
};

const Watermark = ({ attributes, setAttributes }) => {
  const { watermark, adobeEmbedder } = attributes;
  const wm = { ...DEFAULTS, ...(watermark || {}) };
  const [showLimits, setShowLimits] = useState(false);

  const set = (patch) => setAttributes({ watermark: { ...wm, ...patch } });

  // Theme thumbnails live in the plugin folder; pdfp.dir is localised for the editor too.
  const pluginDir = (typeof pdfp !== "undefined" && pdfp?.dir) || "";

  // Which viewer is selected, so caveats can be shown only when they apply.
  const viewer = adobeEmbedder === true ? "adobe" : (adobeEmbedder === false ? "default" : (adobeEmbedder || "default"));
  // Only a cross-origin viewer marks the whole frame. The 3D FlipBook draws to a single
  // canvas but publishes where it put the sheets, so its mark follows the pages on screen
  // and Pages still applies -- see bookRect() in Common/Watermark.js.
  const isCrossOrigin = viewer === "adobe";
  const marksWholeViewer = isCrossOrigin;

  // The themes this build can draw. The Custom theme and the three logo themes are Pro
  // and are named in the notice at the foot rather than offered and then refused.
  const themeKeys = FREE_THEMES.filter((k) => THEMES[k]);

  // A theme carried in from Pro cannot be drawn here, and pdfp_watermark_resolve() falls
  // back to the first one that can. Resolving it the same way means the picker, the
  // preview and the front end all say the same thing -- and the stored value is left
  // alone, so a site that upgrades gets its own theme back untouched.
  const effectiveTheme = themeKeys.includes(wm.theme) ? wm.theme : themeKeys[0];

  // markType is clamped for the same reason: the text mark is the only one this build
  // renders, so the preview must not draw a logo the front end will not.
  const previewWm = { ...wm, theme: effectiveTheme, markType: "text" };

  const insertPlaceholder = (token) => {
    if (!token) return;
    set({ text: `${wm.text || ""}${wm.text && !/\s$/.test(wm.text) ? " " : ""}${token}` });
  };

  const toggleApply = (key) => {
    const next = wm.apply.includes(key) ? wm.apply.filter((k) => k !== key) : [...wm.apply, key];
    set({ apply: next });
  };

  /* ---------------- group summaries ---------------- */
  const markSummary = THEME_LABELS[effectiveTheme] || effectiveTheme;

  const whereSummary = [
    wm.apply.length ? wm.apply.length + " " + (wm.apply.length === 1 ? __("target", "pdf-poster") : __("targets", "pdf-poster")) : __("nowhere", "pdf-poster"),
    labelOf(PAGES, wm.pages).toLowerCase(),
  ].join(" · ");

  return (
    <PanelBody
      className="bPlPanelBody pdfp-wm-panel"
      /* One badge only -- .pdfp-panel-new-badge and .pdfp-panel-pro-badge are both
         position:absolute; right:0, so two would stack. Green New, not blue Pro: the
         panel is genuinely usable on this build, and it matches the New chip on the
         metabox section of the same name. */
      title={<div className="pdfp-panel-icon">{PDFIcon} {__("Watermark & Branding", "pdf-poster")} <PanelNewBadge /></div>}
      initialOpen={false}
    >
      {/* Spacing is owned here, not inherited: current WordPress ships no margin on
          .components-base-control, so consecutive controls would otherwise sit flush. */}
      <div className="pdfp-wm-stack">
        <ToggleControl
          className="mt5"
          label={__("Enable Watermark", "pdf-poster")}
          id="watermarkEnabled"
          checked={wm.enabled}
          onChange={() => set({ enabled: !wm.enabled })}
          help={__("On-screen marks can be removed with browser dev tools.", "pdf-poster")}
        />

        {!wm.enabled && (
          <Intro pluginDir={pluginDir} onEnable={() => set({ enabled: true })} />
        )}

        {wm.enabled && (
          <>
            <Preview wm={previewWm} />

            {/* ---------------- 1. The mark ---------------- */}
            <Group title={__("The mark", "pdf-poster")} summary={markSummary} desc={__("Your wording, and the look it is stamped in.", "pdf-poster")}>
              {pluginDir ? (
                <div className="pdfp-wm-field">
                  <span className="pdfp-wm-field__label">{__("Theme", "pdf-poster")}</span>
                  <div className="pdfp-wm-thumbs">
                    {themeKeys.map((k) => (
                      <button
                        type="button"
                        key={k}
                        className={"pdfp-wm-thumb" + (effectiveTheme === k ? " is-active" : "")}
                        aria-pressed={effectiveTheme === k}
                        onClick={() => set({ theme: k })}
                      >
                        <img src={`${pluginDir}assets/admin/img/watermark/${k}.svg`} alt="" />
                        <em>{THEME_LABELS[k] || k}</em>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <SelectControl
                  label={__("Theme", "pdf-poster")}
                  value={effectiveTheme}
                  options={themeKeys.map((k) => ({ label: THEME_LABELS[k] || k, value: k }))}
                  onChange={(theme) => set({ theme })}
                />
              )}

              <div className="pdfp-wm-field">
                <TextControl
                  label={__("Text", "pdf-poster")}
                  value={wm.text}
                  onChange={(text) => set({ text })}
                />
                <SelectControl
                  className="pdfp-wm-insert"
                  label={__("Insert a placeholder", "pdf-poster")}
                  value=""
                  options={[
                    { label: __("Choose…", "pdf-poster"), value: "" },
                    ...PLACEHOLDERS.map((t) => ({ label: t, value: t })),
                  ]}
                  onChange={insertPlaceholder}
                />
              </div>
            </Group>

            {/* ---------------- 2. Where it shows ----------------
                Apply To and Pages only route the mark this build already draws, so both
                are free. Who sees it is the row that hands some visitors an unmarked
                document, and it is Pro -- named in the notice below rather than shown
                here, because pdfp_watermark_resolve() clamps it to "everyone" anyway. */}
            <Group title={__("Where it shows", "pdf-poster")} summary={whereSummary} desc={__("Which outputs, and which pages.", "pdf-poster")}>
              <div className="pdfp-wm-field">
                <span className="pdfp-wm-field__label">{__("Apply to", "pdf-poster")}</span>
                <div className="pdfp-wm-checks">
                  <CheckboxControl
                    label={__("Viewer", "pdf-poster")}
                    checked={wm.apply.includes("screen")}
                    onChange={() => toggleApply("screen")}
                  />
                  <CheckboxControl
                    label={__("Printing · next release", "pdf-poster")}
                    checked={wm.apply.includes("print")}
                    onChange={() => toggleApply("print")}
                  />
                  <CheckboxControl
                    label={__("Downloads · next release", "pdf-poster")}
                    checked={wm.apply.includes("download")}
                    onChange={() => toggleApply("download")}
                  />
                </div>
                {isCrossOrigin && (
                  <p className="pdfp-wm-note">
                    {__("The Adobe viewer runs in a cross-origin frame, so printing and downloads cannot be marked there.", "pdf-poster")}
                  </p>
                )}
              </div>

              <SelectControl
                label={__("Pages", "pdf-poster")}
                value={wm.pages}
                options={PAGES}
                onChange={(pages) => set({ pages })}
                help={marksWholeViewer
                  ? __("This viewer shows the document in a cross-origin frame, so the page on screen cannot be read and every page carries the mark.", "pdf-poster")
                  : undefined}
              />
            </Group>

            {/* ---------------- viewer support, on demand ---------------- */}
            <button
              type="button"
              className="pdfp-wm-disclosure"
              aria-expanded={showLimits}
              onClick={() => setShowLimits(!showLimits)}
            >
              {__("Viewer support & limits", "pdf-poster")} <span aria-hidden="true">{showLimits ? "▴" : "▾"}</span>
            </button>

            {showLimits && (
              <div className="pdfp-wm-limits">
                <p><strong>{__("Default viewer", "pdf-poster")}</strong> — {__("marks each page; supports every option.", "pdf-poster")}</p>
                <p><strong>{__("Slider", "pdf-poster")}</strong> — {__("marks each page individually.", "pdf-poster")}</p>
                <p><strong>{__("3D FlipBook", "pdf-poster")}</strong> — {__("marks the sheets on screen, so Pages applies.", "pdf-poster")}</p>
                <p><strong>{__("Google Doc Viewer", "pdf-poster")}</strong> — {__("cross-origin, so one mark over the frame; no printing or downloads.", "pdf-poster")}</p>
                <p className="pdfp-wm-help">{__("An on-screen mark can always be removed with browser dev tools. Marking printouts and downloads arrives in a later release.", "pdf-poster")}</p>
              </div>
            )}

            <Notice status='premium' isIcon={true}>
              {__('Unlock a logo watermark (your logo on its own, or beside your wording), the Brand Corner, Logo Wash and Logo + Caption themes, a Custom theme where you set the colour, coverage, position, strength, size and angle yourself, audience rules for who sees the mark, and per-visitor anti-leak stamping with tamper restore—available exclusively in Premium.', 'pdf-poster')}
            </Notice>
          </>
        )}
      </div>
    </PanelBody>
  );
};

export default Watermark;
