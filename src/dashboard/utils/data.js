const slug = 'pdf-poster';

/**
 * Plugin URL, localised as `pdfpDashboard.dir` in PDFP_Admin::adminEnqueueScripts().
 * Falls back to an empty string so the module stays importable outside the dashboard
 * bundle (tests, storybook, the block editor).
 */
const pluginUrl = (typeof window !== 'undefined' && window.pdfpDashboard?.dir) || '';

/** Overview artwork shipped with the plugin, so the Welcome page never waits on a remote host. */
const overviewImage = `${pluginUrl}assets/images/pdf-poster-overview.png`;

export const gutenbergTabIcon = (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
        <rect x='3' y='3' width='7' height='7' rx='1' />
        <rect x='14' y='3' width='7' height='7' rx='1' />
        <rect x='3' y='14' width='7' height='7' rx='1' />
        <rect x='14' y='14' width='7' height='7' rx='1' />
    </svg>
);

export const shortcodeTabIcon = (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='16 18 22 12 16 6' />
        <polyline points='8 6 2 12 8 18' />
    </svg>
);

export const quickEmbedTabIcon = (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
        <path d='M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71' />
        <path d='M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' />
    </svg>
);

export const dashboardInfo = (info) => {
    const { version, isPremium, hasPro, adminUrl = '', licenseActiveNonce } = info;

    const proSuffix = isPremium ? ' Pro' : '';

    return {
        name: `PDF Poster${proSuffix}`,
        displayName: `PDF Poster${proSuffix} - Display PDF Files with Custom Viewer`,
        description: `PDF Poster${proSuffix} lets you embed PDF files in WordPress using a responsive viewer and block support, including full-screen, download, and print options.`,
        slug,
        version,
        isPremium,
        hasPro,
        adminUrl,
        displayOurPlugins: true,
        media: {
            logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
            banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
            thumbnail: overviewImage,
        },
        pages: {
            org: `https://wordpress.org/plugins/${slug}/`,
            landing: `https://bplugins.com/products/${slug}/`,
            docs: `https://bplugins.com/docs/${slug}/`,
            pricing: `https://bplugins.com/products/${slug}/pricing`,
        },
        freemius: {
            product_id: 14261,
            plan_id: 23852,
            public_key: 'pk_6e833032174d131283193892a44a2'
        },
        licenseActiveNonce,
        startButton: {
            label: 'Start Now',
            url: `${adminUrl}/post-new.php?post_type=pdfposter`
        }
    }
}

export const welcomeInfo = (adminUrl) => ({
    keywords: ['PDF Embedder', 'FlipBook', 'Gutenberg Block', 'Shortcode', 'Adobe Viewer'],
    keywordsLabel: 'Features',
    gettingStarted: {
        tabs: [
            {
                key: 'gutenberg',
                label: 'Gutenberg',
                icon: gutenbergTabIcon,
                steps: [
                    {
                        num: 1,
                        title: 'Insert the Block',
                        body: 'Click <strong>+</strong> in the Gutenberg editor and search for <strong>PDF Poster</strong>.',
                        link: { url: `${adminUrl}/post-new.php`, label: 'Open Editor' }
                    },
                    {
                        num: 2,
                        title: 'Select PDF',
                        body: 'Choose an existing PDF from your Media Library or upload a new one inside the block.'
                    },
                    {
                        num: 3,
                        title: 'Publish & Preview',
                        body: 'Customize height, width, and options in the block sidebar, then hit <strong>Publish</strong>.'
                    }
                ]
            },
            {
                key: 'shortcode',
                label: 'Shortcode',
                icon: shortcodeTabIcon,
                steps: [
                    {
                        num: 1,
                        title: 'Create Poster',
                        body: 'Go to <strong>PDF Poster › Add New</strong> to create a new PDF Poster post.',
                        link: { url: `${adminUrl}/post-new.php?post_type=pdfposter`, label: 'Add New' }
                    },
                    {
                        num: 2,
                        title: 'Upload & Save',
                        body: 'Upload your PDF, name it, configure layout/viewer settings, and click <strong>Publish</strong>.'
                    },
                    {
                        num: 3,
                        title: 'Copy Shortcode',
                        body: 'Copy the shortcode like <code>[pdf id="POST_ID"]</code> from the list or the metabox.'
                    },
                    {
                        num: 4,
                        title: 'Paste Anywhere',
                        body: 'Paste the copied shortcode into any page, post, widget, or template.'
                    }
                ]
            },
            {
                key: 'quick',
                label: 'Quick Embedder',
                icon: quickEmbedTabIcon,
                steps: [
                    {
                        num: 1,
                        title: 'Set Default Options',
                        body: 'Go to <strong>PDF Poster › Settings</strong> to set your global default width and height.',
                        link: { url: `${adminUrl}/edit.php?post_type=pdfposter&page=fpdf-settings`, label: 'Go to Settings' }
                    },
                    {
                        num: 2,
                        title: 'Use Embed Shortcode',
                        body: 'Embed any PDF directly using: <code>[pdf_embed url="YOUR_PDF_URL"]</code>.'
                    },
                    {
                        num: 3,
                        title: 'Customize Attributes',
                        body: 'Override defaults by adding attributes like <code>width</code>, <code>height</code>, <code>print</code>, or <code>download_btn</code>.'
                    }
                ]
            }
        ]
    },
    changelogs: [
        {
            version: '2.6.0 - 09 Sep 2026',
            type: 'new',
            list: [
                '<strong>New:</strong> Document Insights — see how many times every PDF was viewed and downloaded today, free, without adding a third-party analytics service. The figures stay in your own site.',
                '<strong>New:</strong> Analytics screen — a new Analytics item under PDF Poster showing today\'s figures, and with Pro a 7, 30 or 90 day view: views and downloads over time, change against the previous period, download rate, busiest day, your best-performing documents ranked, and CSV export.',
                '<strong>New:</strong> Per-document reports — open any single document\'s own trend and totals from the editor, as a link you can bookmark or share with your team.',
                '<strong>New:</strong> Analytics panel on every document — today\'s views and downloads in the block editor sidebar and beside the Save button in the classic editor, with all-time totals and a 14-day trend in Pro.',
                '<strong>New:</strong> Views and Downloads columns on the PDF Posters list — today\'s figures for everyone, all-time and sortable in Pro.',
                '<strong>New:</strong> Settings > Analytics — turn counting on or off site-wide, keep your own visits out of the numbers, and optionally respect the browser\'s Do Not Track setting.',
                '<strong>New:</strong> Counting keeps working behind a page cache, so sites on WP Rocket, LiteSpeed or Cloudflare get real figures instead of one view per cached copy.',
                '<strong>New:</strong> Every embed is counted, not only saved PDF Posters. A block placed directly on a page and `[pdf_embed url="..."]` each get their own figures, and the report links through to the page they sit on.',
                '<strong>New:</strong> A view is recorded once the viewer has genuinely been on screen — not on every page load — and once per visitor per 30 minutes. Downloads and prints are counted however the reader triggers them.',
                '<strong>New:</strong> Private by default. No IP address is stored, no cookie is set, and this release keeps daily totals only — in your own database, never sent anywhere.',
                '<strong>New:</strong> Nothing to import if you upgrade later — every day is recorded from the start, so Pro reads back the history your site has already built.',
                '<strong>New:</strong> Popup (lightbox) viewer, a text watermark with three ready-made themes, per-block Class and CSS, a site-wide Custom CSS box and the Preset defaults screen are all free in this release.',
                '<strong>Update:</strong> The shortcode columns on the PDF Posters list now show the shortcode itself in a click-to-copy chip, instead of a button whose label hid the value it copied.',
                '<strong>Update:</strong> Links out of a report open in a new tab, so your date range and filters stay where you left them.',
                '<strong>Fix:</strong> Content protection no longer shows a developer-tools warning while a page is open in Elementor, Divi, Bricks, Beaver Builder, Oxygen or Breakdance. Editing behaves normally again, including Ctrl+S to save and right-click.',
                '<strong>Fix:</strong> The plugin dashboard requested a stylesheet that is never generated, producing a 404 on every load.'
            ]
        },
        {
            version: '2.5.6 - 31 Aug 2026',
            type: 'new',
            list: [
                'New: Watermark & Branding — stamp a text or logo mark over any viewer, with six ready-made themes that set the angle, repeat, weight and blend for you.',
                'New: Watermark mark types — Text, Image (your logo) or both stacked together.',
                'New: Watermark Coverage — a single positioned mark, or tiled Sparse/Normal/Dense so it cannot be cropped out of a screenshot.',
                'New: Watermark Image Style — Original, Grayscale, White (for dark pages) or Black.',
                'New: Watermark Strength and Size as named steps rather than numbers, so the mark stays readable at every zoom level and on mobile.',
                'New: Watermark page scope (all pages, first page only, or all except the cover) and audience rules (everyone, everyone except admins, or logged-out visitors only).',
                'New: Watermark "Restore If Removed" option, which puts the mark back if a visitor deletes it with browser dev tools.',
                'New: Added a Watermark & Branding section to the Gutenberg block sidebar and the classic editor metabox, so the free build shows what the Pro watermarking tools cover.',
                'Update: Rewrote the Free and Pro feature lists so each one matches what that version actually ships — FlipBook, Slider, the [pdf_embed] shortcode, the classic editor metabox, the second Gutenberg block and Google Doc Viewer were all listed as Pro despite being free.',
                'Update: Documented every setting added since 2.5.2 (Viewer Theme, RTL Layout, Keyboard Navigation, Annotation Mode, Page Flip Sound, Fast Loading, Image Gallery flipbooks, social sharing) in the free feature list.',
                'Fixed: Blocks saved with PDF Poster Pro no longer lose their watermark configuration when the post is edited on a free install.',
                'Note: Watermarking is a deterrent, not DRM — an on-screen mark can be removed with browser dev tools, and no browser can prevent a screenshot. Marks in printouts and downloaded copies arrive in a following release.',
            ]
        },
        {
            version: '2.5.5 - 03 Aug 2026',
            type: 'new',
            list: [
                'New: Added Image Gallery source for the Flipbook viewer — build a page-flip book from an ordered set of images without a PDF.',
                'New: Added Viewer Theme option (Light/Dark/Auto) that themes the viewer toolbar and background without altering the PDF page content.',
                'New: Added RTL Layout option (Off/On/Auto) for right-to-left languages, applied across all viewers and the PDF toolbar.',
                'New: Added Keyboard Navigation option (Left/Right arrow keys to change pages) for all viewers.',
                'New: Added a Page Flip Sound toggle for Flipbook and Slider viewers (on by default; can now be turned off).',
                'New: Added Fast Loading (Progressive Rendering) option for all viewers (Default, Adobe, Flipbook, Scroll, Slider) to stream large PDFs so the first page appears sooner.',
                'Fixed: Full screen option smooth behaviour.'
            ]
        },
        {
            version: '2.5.4 - 15 June 2026',
            type: 'new',
            list: [
                'New: Added interactive PDF Chatbot assistant.',
                'New: Added Slider and Scroll Viewer options.',
                'New: Added Annotation Mode configuration for default viewer.',
                'New: Added Open PDF links in new tab configuration for default viewer.'
            ]
        },
        {
            version: '2.5.3 - 10 Jun 2026',
            type: 'update',
            list: [
                'Update: Admin Dashboard aligned with the latest standard and bpl-tools layout.',
                'Security: Enhanced request validation and sanitized AJAX inputs.',
                'Security: Secured public REST API endpoints with authentication checks.',
                'Compliance: Added full uninstall cleanup routine for custom options and database tables.',
                'Compliance: Standardized translation text domains to match the plugin slug.',
                'Fixed: Corrected general typos, updated GPL license headers, and added distribution ignore rules.'
            ]
        },
        {
            version: '2.5.2 - 19 May 2026',
            type: 'new',
            list: [
                'New: Added FlipBook Viewer support for a more interactive and realistic PDF reading experience.',
                'New: Introduced fully responsive Height & Width controls for Desktop, Tablet, and Mobile devices.',
                'New: Added a Device Preview Switcher in the plugin metabox for easier responsive configuration.',
                'Improved: Enhanced PDF viewer dimension handling across different screen sizes for better responsiveness.',
                'Improved: Refactored the entire plugin codebase for better maintainability and cleaner architecture.',
                'Improved: Removed unused and redundant code to reduce plugin bloat and improve performance.',
                'Improved: Optimized core functionality for faster loading and smoother user experience.',
                'Fixed: Resolved existing bugs and minor compatibility issues.',
                'Security: Strengthened overall plugin security and improved code quality following best practices.',
                'Update: Unlocked all previously gated Premium settings, making them fully functional in the Free version.',
                'Security: Enhanced request validation for API and AJAX endpoints.',
                'Security: Improved database query sanitization and hardening.',
                'Improved: Replaced PHP 8.0 specific functions to restore PHP 7.1+ support.',
                'Improved: Conducted a comprehensive i18n sweep for proper translation support.',
                'Compliance: Added explicit Terms of Service and Privacy Policy links to the readme.'
            ]
        },
        {
            version: '2.5.1 - 26 April 2026', 
            type: 'fixed',
            list: [
                'Fixed: PDFs hosted on external domains or CDNs were not loading at all',
                'Fixed: Google Docs Viewer was sending the same request twice and canceling both',
                'Fixed: When Google Docs Viewer failed there was nothing to fall back on',
                'Fixed: PDF.js errors were invisible — users just saw a white empty box',
                'Fixed: No message was shown when a PDF file was missing or completely empty',
                'Fixed: PDF viewer was not opening on iPhone and iPad running iOS 16 and 17',
                'Fixed: Tapping the fullscreen button on iPhone did absolutely nothing',
                'Fixed: PDFs were not loading on Android Chrome and Samsung Internet browser',
                'Fixed: Chinese, Japanese and Korean characters were showing as random broken symbols',
                'Fixed: PDFs made with LaTeX or older Adobe tools were showing wrong or unreadable text',
                'Fixed: Changes made to an existing PDF entry were lost after hitting update',
                'Fixed: Shortcode was pasting fine but showing nothing at all on the live page',
                'Fixed: PDFs with spaces or special characters in the filename were crashing the viewer',
                'Fixed: An unexpected heading was appearing above the viewer on some themes',
                'Fixed: Embedding a PDF by URL was showing raw code instead of the actual document',
                'Fixed: PDF viewer was not displaying properly inside Elementor\'s preview panel',
                'Update: Removed unexpected or unnecessary conten & code from the whole plugin.'
            ]
        },
        {
            version: '2.5.0 - 4 March 2026',
            type: 'update',
            list: [
                'Update: Help & Demo Page',
                'Update: Added Info text with all the controls.',
                'Update: Remove affiliate and contact Submenu.',
                'Update: Move shortcode area to the right side (Classic Shortcode Generator).'
            ]
        }
    ],
    changelogsLimit: 2,
    changelogsReadMoreLabel: 'View More Changelogs',
    proFeatures: [
        "Analytics history — all-time totals and 7, 30 or 90 day trends",
        "Top documents ranked, download rate and busiest day",
        "CSV export, plus sortable Views and Downloads columns",
        "Adobe PDF viewer — embed modes including lightbox",
        "Continuous Scroll viewer — built for long reports",
        "Watermark your logo — any colour, size, angle and coverage",
        "Watermark rules — who sees it, and restore it if removed",
        "Protect Content — block right-click, copying and text selection",
        "Reader Mode — no toolbar, no distractions",
        "Thumbnail sidebar for quick page jumps",
        "Start at any page and zoom level",
        "Rename the Download and Fullscreen buttons",
        "Open fullscreen in a new tab, buttons above or below the viewer",
        "Import PDFs straight from Dropbox and Google Drive",
        "Save block presets and reuse them everywhere",
        "Always load the latest uploaded file",
        "Priority one-on-one support"
    ],
})

export const demoInfo = {
    demos: [
        {
            "title": "Default PDF Viewer",
            "url": "https://pdfposter.com/demo/default/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Custom Width Viewer",
            "url": "https://pdfposter.com/demo/custom-width/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M406.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224l-293.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288l293.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Custom Height Viewer",
            "url": "https://pdfposter.com/demo/custom-height/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'><path d='M182.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L128 109.3V402.7L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7V109.3l41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Allow Print Option",
            "url": "https://pdfposter.com/demo/allow-print/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Title on Top",
            "url": "https://pdfposter.com/demo/show-file-name-on-top/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'><path d='M0 64C0 46.3 14.3 32 32 32H80h48c17.7 0 32 14.3 32 32s-14.3 32-32 32H112V208H336V96H320c-17.7 0-32-14.3-32-32s14.3-32 32-32h48 48c17.7 0 32 14.3 32 32s-14.3 32-32 32H400V240 416h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H368 320c-17.7 0-32-14.3-32-32s14.3-32 32-32h16V272H112V416h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H80 32c-17.7 0-32-14.3-32-32s14.3-32 32-32H48V240 96H32C14.3 96 0 81.7 0 64z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Download Button on Top",
            "url": "https://pdfposter.com/demo/show-download-button-on-top/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Full-Screen Button on Top",
            "url": "https://pdfposter.com/demo/show-view-full-screen-button-on-top/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'><path d='M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Protected Content View",
            "url": "https://pdfposter.com/demo/protect-content/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'><path d='M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Thumbnail Toggle Menu",
            "url": "https://pdfposter.com/demo/thumbnails-toggle-menu/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' id='layout-sidebar-inset'><path d='M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z' /><path d='M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Jump-to-Page Navigation",
            "url": "https://pdfposter.com/demo/jump-to-page/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'><path d='M137.4 502.6c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7V288H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H448V109.3l41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L384 109.3V224H192 128 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96V402.7L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96zM128 192h64V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V192zM448 320H384V448c0 17.7 14.3 32 32 32s32-14.3 32-32V320z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Quick Embed",
            "url": "https://pdfposter.com/demo/quick-embed/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'><path d='M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z' /></svg>,
            "category": "",
            type: 'iframe'
        },
        {
            "title": "Adobe Embedder Integration",
            "url": "https://pdfposter.com/demo/embed-pdf-with-adobe-embedder/",
            "icon": <svg width="20px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' id='file-earmark-pdf-fill'><path d='M5.523 12.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 6.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z' /><path fill-rule='evenodd' d='M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.7 11.7 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103' /></svg>,
            "category": "",
            type: 'iframe'
        }
    ],
}

export const pricingInfo = {
    logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
    pluginId: 14261,
    planId: 23852,
    licenses: [
        1,
        3,
        null
    ],
    button: {
        label: 'Buy Now ➜'
    },
    featured: {
        selected: 3,
    }
}