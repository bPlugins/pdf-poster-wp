import Header from '../../../../bpl-tools/Admin/Header';
import Analytics from './Analytics';
import PluginNav from './PluginNav';

/**
 * Standalone wrapper for the Analytics screen.
 *
 * The screen has its own submenu under PDF Poster, so it renders outside the dashboard's
 * router. It keeps the same chrome -- .bPlDashboard ground, the bpl-tools Header, the
 * .bPlDashboardMain padding -- so the page is indistinguishable from the dashboard route
 * it also still answers on.
 *
 * The header's nav slot carries the plugin's real admin menu rather than the dashboard's
 * hash routes -- those belong to the Demo and Help page and would be dead ends here.
 */

/** The dashboard screen, which is where the header's hash routes actually resolve. */
const dashboardUrl = (adminUrl = '') =>
    `${adminUrl}/edit.php?post_type=pdfposter&page=pdf-poster`;

/**
 * The header's own action buttons, which this screen has to re-aim.
 *
 * bpl-tools/Admin/Header renders "Our Plugins" and "Upgrade Pro" as plain anchors
 * pointing at `#our-plugins` and `#pricing`. Those are dashboard hash routes, and this
 * screen deliberately renders outside that router -- so left alone they rewrite the
 * address bar and render nothing at all.
 *
 * The Header builds them internally with no prop to redirect or suppress them, and it is
 * a shared library six plugins compile in, so the redirect happens here: catch the click
 * as it bubbles and send it to the dashboard carrying the same hash, which is a real
 * page load to the screen that can answer it.
 */
const HASH_ROUTES = ['#our-plugins', '#pricing'];

const AnalyticsPage = (props) => {
    /**
     * Delegated from the .bPlDashboard root -- clicks bubble there anyway, so the header
     * needs no wrapper element of its own and the layout is left exactly as it was.
     *
     * Scoped to .navButtons so the plugin nav in the same header, whose items are real
     * admin URLs with no leading "#", is never intercepted. If bpl-tools ever renames
     * these two hrefs the match simply stops and the buttons behave as they do today;
     * nothing else regresses.
     */
    const routeHeaderLinks = (e) => {
        // The click can land on the icon inside the anchor, so walk up to the anchor.
        const link = e.target?.closest?.('.bPlDashboardHeader .navButtons a[href^="#"]');
        const hash = link?.getAttribute('href');
        if (!hash || !HASH_ROUTES.includes(hash)) return;

        e.preventDefault();
        window.location.href = `${dashboardUrl(props.adminUrl)}${hash}`;
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div className='bPlDashboard' onClick={routeHeaderLinks}>
            <Header {...props}>
                <PluginNav adminUrl={props.adminUrl} current='analytics' />
            </Header>

            <main className='bPlDashboardMain'>
                <Analytics {...props} />
            </main>
        </div>
    );
};

export default AnalyticsPage;
