import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [layout("root.tsx", [index("routes/_index.tsx")])] satisfies RouteConfig;
