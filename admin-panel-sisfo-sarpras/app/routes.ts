import {type RouteConfig, index, route, layout, prefix} from "@react-router/dev/routes";

export default [
    index("routes/login.tsx"),
    layout("components/layouts/dashboard-layout.tsx", [
        route("dashboard", "components/pages/dashboard.tsx"),
        ...prefix("dashboard", [
            route("users", "components/pages/users.tsx"),
            route("categories", "components/pages/categories.tsx"),
            route("warehouses", "components/pages/warehouses.tsx"),
            route("items", "components/pages/items.tsx"),
            route("item-units", "components/pages/itemUnits.tsx"),
            route("borrow-requests", "components/pages/borrowRequests.tsx"),
            route("return-requests", "components/pages/returnRequests.tsx"),
            route("log-activities", "components/pages/logActivities.tsx"),
        ])
    ])
] satisfies RouteConfig;
