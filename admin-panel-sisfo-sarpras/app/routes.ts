import {type RouteConfig, index, route, layout, prefix} from "@react-router/dev/routes";

export default [
    index("routes/login.tsx"),
    layout("components/layouts/dashboard-layout.tsx", [
        route("dashboard", "components/pages/dashboard.tsx"),
        ...prefix("categories", [
            index("components/pages/categories/index.tsx"),
            route("/create", "components/pages/categories/create-form.tsx"),
            route("/:slug", "components/pages/categories/detail.tsx"),
            route("/:slug/edit", "components/pages/categories/update-form.tsx"),
        ]),
    ])
] satisfies RouteConfig;
