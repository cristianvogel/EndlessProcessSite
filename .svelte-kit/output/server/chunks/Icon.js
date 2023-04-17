import { c as create_ssr_component, f as compute_rest_props, i as spread, k as escape_object, j as escape_attribute_value, n as each } from "./index3.js";
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let icon;
  let $$restProps = compute_rest_props($$props, ["src", "size", "theme"]);
  let { src } = $$props;
  let { size = "100%" } = $$props;
  let { theme = "default" } = $$props;
  if (size !== "100%") {
    if (size.slice(-1) != "x" && size.slice(-1) != "m" && size.slice(-1) != "%") {
      try {
        size = parseInt(size) + "px";
      } catch (error) {
        size = "100%";
      }
    }
  }
  if ($$props.src === void 0 && $$bindings.src && src !== void 0)
    $$bindings.src(src);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0)
    $$bindings.theme(theme);
  icon = src?.[theme] ?? src?.["default"];
  return `<svg${spread(
    [
      escape_object(icon?.a),
      { xmlns: "http://www.w3.org/2000/svg" },
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      escape_object($$restProps)
    ],
    {}
  )}>${each(icon?.path ?? [], (a) => {
    return `<path${spread([escape_object(a)], {})}></path>`;
  })}${each(icon?.rect ?? [], (a) => {
    return `<rect${spread([escape_object(a)], {})}></rect>`;
  })}${each(icon?.circle ?? [], (a) => {
    return `<circle${spread([escape_object(a)], {})}></circle>`;
  })}${each(icon?.polygon ?? [], (a) => {
    return `<polygon${spread([escape_object(a)], {})}></polygon>`;
  })}${each(icon?.polyline ?? [], (a) => {
    return `<polyline${spread([escape_object(a)], {})}></polyline>`;
  })}${each(icon?.line ?? [], (a) => {
    return `<line${spread([escape_object(a)], {})}></line>`;
  })}</svg>`;
});
export {
  Icon as I
};
