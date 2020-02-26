import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
const Dashboard = () =>
    import ( /* webpackChunkName: "dashboard" */ "@/pages/Dashboard.vue");
const History = () =>
    import ( /* webpackChunkName: "common" */ "@/pages/History.vue");
const Alerts = () =>
    import ( /* webpackChunkName: "common" */ "@/pages/Alerts.vue");
const Settings = () =>
    import ( /* webpackChunkName: "common" */ "@/pages/Settings.vue");

const routes = [{
        path: "/",
        component: DashboardLayout,
        redirect: "/dashboard",
        children: [{
                path: "dashboard",
                name: "dashboard",
                component: Dashboard
            },
            {
                path: "history",
                name: "history",
                component: History
            },
            {
                path: "alerts",
                name: "alerts",
                component: Alerts
            },
            {
                path: "settings",
                name: "settings",
                component: Settings
            }
        ]
    },
    { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;