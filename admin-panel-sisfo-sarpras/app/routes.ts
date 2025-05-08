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
        ...prefix("warehouses", [
            index("components/pages/warehouses/index.tsx"),
            route("/create", "components/pages/warehouses/create-form.tsx"),
            route("/:id", "components/pages/warehouses/detail.tsx"),
            route("/:id/edit", "components/pages/warehouses/update-form.tsx"),
        ]),
        ...prefix("items", [
            index("components/pages/items/index.tsx"),
            route("/create", "components/pages/items/create-form.tsx"),
            route("/:id", "components/pages/items/detail.tsx"),
            route("/:id/edit", "components/pages/items/update-form.tsx"),
        ]),
    ])
] satisfies RouteConfig;
