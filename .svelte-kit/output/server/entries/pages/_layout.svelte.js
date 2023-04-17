import { c as create_ssr_component, e as escape, a as add_attribute, b as compute_slots, s as setContext, g as getContext, d as add_styles, f as compute_rest_props, h as createEventDispatcher, i as spread, j as escape_attribute_value, k as escape_object, l as subscribe, v as validate_component, n as each, o as get_store_value } from "../../chunks/index3.js";
import "../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
import { I as Icon } from "../../chunks/Icon.js";
import { CircleFilled, CircleDash, PauseOutline, PlayOutline, QueryQueue, ChartMarimekko, ProgressBarRound, Events, Cube, Layers, VoiceActivate } from "@steeze-ui/carbon-icons";
import { A as Audio, a as AudioCore, s as stereoOut } from "../../chunks/Audio.js";
import { V as VFS_PATH_PREFIX, P as Playlist, D as Decoding, S as Scrubbing, a as PlaysCount, C as CablesText, b as CablesIsLoaded, c as PlaylistVoice, s as singlePost, d as CablesPatch, e as CablesAudioContext } from "../../chunks/stores.js";
import { el } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";
import { w as writable } from "../../chunks/index2.js";
import { e as error } from "../../chunks/index.js";
import { c as channelExtensionFor, U as Utils } from "../../chunks/Utils.js";
const theme = "";
const all = "";
const app = "";
const cBase$4 = "flex flex-col space-y-4";
const cRowMain = "grid items-center";
const cRowHeadline = "";
const cSlotLead = "flex-none flex justify-between items-center";
const cSlotDefault = "flex-auto";
const cSlotTrail = "flex-none flex items-center space-x-4";
const AppBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let classesRowMain;
  let classesRowHeadline;
  let classesSlotLead;
  let classesSlotDefault;
  let classesSlotTrail;
  let $$slots = compute_slots(slots);
  let { background = "bg-surface-100-800-token" } = $$props;
  let { border = "" } = $$props;
  let { padding = "p-4" } = $$props;
  let { shadow = "" } = $$props;
  let { spacing = "space-y-4" } = $$props;
  let { gridColumns = "grid-cols-[auto_1fr_auto]" } = $$props;
  let { gap = "gap-4" } = $$props;
  let { regionRowMain = "" } = $$props;
  let { regionRowHeadline = "" } = $$props;
  let { slotLead = "" } = $$props;
  let { slotDefault = "" } = $$props;
  let { slotTrail = "" } = $$props;
  let { label = "" } = $$props;
  let { labelledby = "" } = $$props;
  if ($$props.background === void 0 && $$bindings.background && background !== void 0)
    $$bindings.background(background);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.shadow === void 0 && $$bindings.shadow && shadow !== void 0)
    $$bindings.shadow(shadow);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0)
    $$bindings.spacing(spacing);
  if ($$props.gridColumns === void 0 && $$bindings.gridColumns && gridColumns !== void 0)
    $$bindings.gridColumns(gridColumns);
  if ($$props.gap === void 0 && $$bindings.gap && gap !== void 0)
    $$bindings.gap(gap);
  if ($$props.regionRowMain === void 0 && $$bindings.regionRowMain && regionRowMain !== void 0)
    $$bindings.regionRowMain(regionRowMain);
  if ($$props.regionRowHeadline === void 0 && $$bindings.regionRowHeadline && regionRowHeadline !== void 0)
    $$bindings.regionRowHeadline(regionRowHeadline);
  if ($$props.slotLead === void 0 && $$bindings.slotLead && slotLead !== void 0)
    $$bindings.slotLead(slotLead);
  if ($$props.slotDefault === void 0 && $$bindings.slotDefault && slotDefault !== void 0)
    $$bindings.slotDefault(slotDefault);
  if ($$props.slotTrail === void 0 && $$bindings.slotTrail && slotTrail !== void 0)
    $$bindings.slotTrail(slotTrail);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.labelledby === void 0 && $$bindings.labelledby && labelledby !== void 0)
    $$bindings.labelledby(labelledby);
  classesBase = `${cBase$4} ${background} ${border} ${spacing} ${padding} ${shadow} ${$$props.class ?? ""}`;
  classesRowMain = `${cRowMain} ${gridColumns} ${gap} ${regionRowMain}`;
  classesRowHeadline = `${cRowHeadline} ${regionRowHeadline}`;
  classesSlotLead = `${cSlotLead} ${slotLead}`;
  classesSlotDefault = `${cSlotDefault} ${slotDefault}`;
  classesSlotTrail = `${cSlotTrail} ${slotTrail}`;
  return `<div class="${"app-bar " + escape(classesBase, true)}" data-testid="app-bar" role="toolbar"${add_attribute("aria-label", label, 0)}${add_attribute("aria-labelledby", labelledby, 0)}>
	<div class="${"app-bar-row-main " + escape(classesRowMain, true)}">
		${$$slots.lead ? `<div class="${"app-bar-slot-lead " + escape(classesSlotLead, true)}">${slots.lead ? slots.lead({}) : ``}</div>` : ``}
		
		<div class="${"app-bar-slot-default " + escape(classesSlotDefault, true)}">${slots.default ? slots.default({}) : ``}</div>
		
		${$$slots.trail ? `<div class="${"app-bar-slot-trail " + escape(classesSlotTrail, true)}">${slots.trail ? slots.trail({}) : ``}</div>` : ``}</div>
	
	${$$slots.headline ? `<div class="${"app-bar-row-headline " + escape(classesRowHeadline, true)}">${slots.headline ? slots.headline({}) : ``}</div>` : ``}</div>`;
});
const cBaseAppShell = "w-full h-full flex flex-col overflow-hidden";
const cContentArea = "w-full h-full flex overflow-hidden";
const cPage = "flex-1 overflow-x-hidden flex flex-col";
const cSidebarLeft = "flex-none overflow-x-hidden overflow-y-auto";
const cSidebarRight = "flex-none overflow-x-hidden overflow-y-auto";
const AppShell = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let classesheader;
  let classesSidebarLeft;
  let classesSidebarRight;
  let classesPageHeader;
  let classesPageContent;
  let classesPageFooter;
  let classesFooter;
  let $$slots = compute_slots(slots);
  let { regionPage = "" } = $$props;
  let { slotHeader = "z-10" } = $$props;
  let { slotSidebarLeft = "w-auto" } = $$props;
  let { slotSidebarRight = "w-auto" } = $$props;
  let { slotPageHeader = "" } = $$props;
  let { slotPageContent = "" } = $$props;
  let { slotPageFooter = "" } = $$props;
  let { slotFooter = "" } = $$props;
  if ($$props.regionPage === void 0 && $$bindings.regionPage && regionPage !== void 0)
    $$bindings.regionPage(regionPage);
  if ($$props.slotHeader === void 0 && $$bindings.slotHeader && slotHeader !== void 0)
    $$bindings.slotHeader(slotHeader);
  if ($$props.slotSidebarLeft === void 0 && $$bindings.slotSidebarLeft && slotSidebarLeft !== void 0)
    $$bindings.slotSidebarLeft(slotSidebarLeft);
  if ($$props.slotSidebarRight === void 0 && $$bindings.slotSidebarRight && slotSidebarRight !== void 0)
    $$bindings.slotSidebarRight(slotSidebarRight);
  if ($$props.slotPageHeader === void 0 && $$bindings.slotPageHeader && slotPageHeader !== void 0)
    $$bindings.slotPageHeader(slotPageHeader);
  if ($$props.slotPageContent === void 0 && $$bindings.slotPageContent && slotPageContent !== void 0)
    $$bindings.slotPageContent(slotPageContent);
  if ($$props.slotPageFooter === void 0 && $$bindings.slotPageFooter && slotPageFooter !== void 0)
    $$bindings.slotPageFooter(slotPageFooter);
  if ($$props.slotFooter === void 0 && $$bindings.slotFooter && slotFooter !== void 0)
    $$bindings.slotFooter(slotFooter);
  classesBase = `${cBaseAppShell} ${$$props.class ?? ""}`;
  classesheader = `${slotHeader}`;
  classesSidebarLeft = `${cSidebarLeft} ${slotSidebarLeft}`;
  classesSidebarRight = `${cSidebarRight} ${slotSidebarRight}`;
  classesPageHeader = `${slotPageHeader}`;
  classesPageContent = `${slotPageContent}`;
  classesPageFooter = `${slotPageFooter}`;
  classesFooter = `${slotFooter}`;
  return `<div id="appShell"${add_attribute("class", classesBase, 0)} data-testid="app-shell">
	${$$slots.header ? `<header id="shell-header" class="${"flex-none " + escape(classesheader, true)}">${slots.header ? slots.header({}) : ``}</header>` : ``}

	
	<div class="${"flex-auto " + escape(cContentArea, true)}">
		${$$slots.sidebarLeft ? `<aside id="sidebar-left"${add_attribute("class", classesSidebarLeft, 0)}>${slots.sidebarLeft ? slots.sidebarLeft({}) : ``}</aside>` : ``}

		
		<div id="page" class="${escape(regionPage, true) + " " + escape(cPage, true)}">
			${$$slots.pageHeader ? `<header id="page-header" class="${"flex-none " + escape(classesPageHeader, true)}">${slots.pageHeader ? slots.pageHeader({}) : `(slot:header)`}</header>` : ``}

			
			<main id="page-content" class="${"flex-auto " + escape(classesPageContent, true)}">${slots.default ? slots.default({}) : ``}</main>

			
			${$$slots.pageFooter ? `<footer id="page-footer" class="${"flex-none " + escape(classesPageFooter, true)}">${slots.pageFooter ? slots.pageFooter({}) : `(slot:footer)`}</footer>` : ``}</div>

		
		${$$slots.sidebarRight ? `<aside id="sidebar-right"${add_attribute("class", classesSidebarRight, 0)}>${slots.sidebarRight ? slots.sidebarRight({}) : ``}</aside>` : ``}</div>

	
	${$$slots.footer ? `<footer id="shell-footer" class="${"flex-none " + escape(classesFooter, true)}">${slots.footer ? slots.footer({}) : ``}</footer>` : ``}</div>`;
});
const cBase$3 = "cursor-pointer -outline-offset-[3px]";
const ListBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let { multiple = false } = $$props;
  let { spacing = "space-y-1" } = $$props;
  let { rounded = "rounded-token" } = $$props;
  let { active = "variant-filled" } = $$props;
  let { hover = "hover:variant-soft" } = $$props;
  let { padding = "px-4 py-2" } = $$props;
  let { labelledby = "" } = $$props;
  setContext("multiple", multiple);
  setContext("rounded", rounded);
  setContext("active", active);
  setContext("hover", hover);
  setContext("padding", padding);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0)
    $$bindings.multiple(multiple);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0)
    $$bindings.spacing(spacing);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0)
    $$bindings.hover(hover);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.labelledby === void 0 && $$bindings.labelledby && labelledby !== void 0)
    $$bindings.labelledby(labelledby);
  classesBase = `${cBase$3} ${spacing} ${rounded} ${$$props.class ?? ""}`;
  return `<div class="${"listbox " + escape(classesBase, true)}" role="listbox"${add_attribute("aria-labelledby", labelledby, 0)} data-testid="listbox">${slots.default ? slots.default({}) : ``}</div>`;
});
const cBase$2 = "px-4 py-2 cursor-pointer";
const cLabel$1 = "flex space-x-4";
const ListBoxItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selected;
  let classesActive;
  let classesBase;
  let classesLabel;
  let $$slots = compute_slots(slots);
  let { group } = $$props;
  let { name } = $$props;
  let { value } = $$props;
  let { multiple = getContext("multiple") } = $$props;
  let { rounded = getContext("rounded") } = $$props;
  let { active = getContext("active") } = $$props;
  let { hover = getContext("hover") } = $$props;
  let { padding = getContext("padding") } = $$props;
  let checked;
  let elemInput;
  function updateCheckbox(group2) {
    checked = group2.indexOf(value) >= 0;
  }
  function updateGroup(checked2) {
    const index = group.indexOf(value);
    if (checked2) {
      if (index < 0) {
        group.push(value);
        group = group;
      }
    } else {
      if (index >= 0) {
        group.splice(index, 1);
        group = group;
      }
    }
  }
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0)
    $$bindings.multiple(multiple);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.hover === void 0 && $$bindings.hover && hover !== void 0)
    $$bindings.hover(hover);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  {
    if (multiple)
      updateCheckbox(group);
  }
  {
    if (multiple)
      updateGroup(checked);
  }
  selected = multiple ? group.includes(value) : group === value;
  classesActive = selected ? active : hover;
  classesBase = `${cBase$2} ${rounded} ${padding} ${classesActive} ${$$props.class ?? ""}`;
  classesLabel = `${cLabel$1}`;
  return `
<label class="${"listbox-item " + escape(classesBase, true)}" role="option"${add_attribute("aria-selected", selected, 0)} tabindex="0" data-testid="listbox-item">
	<div class="h-0 w-0 overflow-hidden">${multiple ? `<input type="checkbox"${add_attribute("name", name, 0)}${add_attribute("value", value, 0)} tabindex="-1"${add_attribute("this", elemInput, 0)}${add_attribute("checked", checked, 1)}>` : `<input type="radio"${add_attribute("name", name, 0)}${add_attribute("value", value, 0)} tabindex="-1"${add_attribute("this", elemInput, 0)}${value === group ? add_attribute("checked", true, 1) : ""}>`}</div>
	
	<div class="${"listbox-label " + escape(classesLabel, true)}">
		${$$slots.lead ? `<div class="listbox-label-lead">${slots.lead ? slots.lead({}) : ``}</div>` : ``}
		
		<div class="listbox-label-content flex-1">${slots.default ? slots.default({}) : ``}</div>
		
		${$$slots.trail ? `<div class="listbox-label-trail">${slots.trail ? slots.trail({}) : ``}</div>` : ``}</div></label>`;
});
const css$1 = {
  code: ".animIndeterminate.svelte-meqa4r{transform-origin:0% 50%;animation:svelte-meqa4r-animIndeterminate 2s infinite linear}@keyframes svelte-meqa4r-animIndeterminate{0%{transform:translateX(0) scaleX(0)}40%{transform:translateX(0) scaleX(0.4)}100%{transform:translateX(100%) scaleX(0.5)}}",
  map: null
};
const cTrack$1 = "w-full overflow-hidden";
const cMeter = "h-full";
const ProgressBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let fillPercent;
  let indeterminate;
  let classesIndterminate;
  let classesTrack;
  let classesMeter;
  let { value = void 0 } = $$props;
  let { min = 0 } = $$props;
  let { max = 100 } = $$props;
  let { height = "h-2" } = $$props;
  let { rounded = "rounded-token" } = $$props;
  let { meter = "bg-surface-900-50-token" } = $$props;
  let { track = "bg-surface-200-700-token" } = $$props;
  let { labelledby = "" } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.meter === void 0 && $$bindings.meter && meter !== void 0)
    $$bindings.meter(meter);
  if ($$props.track === void 0 && $$bindings.track && track !== void 0)
    $$bindings.track(track);
  if ($$props.labelledby === void 0 && $$bindings.labelledby && labelledby !== void 0)
    $$bindings.labelledby(labelledby);
  $$result.css.add(css$1);
  fillPercent = value ? 100 * (value - min) / (max - min) : 0;
  indeterminate = value === void 0 || value < 0;
  classesIndterminate = indeterminate ? "animIndeterminate" : "";
  classesTrack = `${cTrack$1} ${height} ${rounded} ${track} ${$$props.class ?? ""}`;
  classesMeter = `${cMeter} ${rounded} ${classesIndterminate} ${meter}`;
  return `
<div class="${"progress-bar " + escape(classesTrack, true) + " svelte-meqa4r"}" data-testid="progress-bar" role="progressbar"${add_attribute("aria-labelledby", labelledby, 0)}${add_attribute("aria-valuenow", value, 0)}${add_attribute("aria-valuemin", min, 0)}${add_attribute("aria-valuemax", max - min, 0)}>
	<div class="${"progress-bar-meter " + escape(classesMeter, true) + " " + escape(classesMeter, true) + " svelte-meqa4r"}"${add_styles({
    "width": `${indeterminate ? 100 : fillPercent}%`
  })}></div>
</div>`;
});
const cBase$1 = "progress-radial relative overflow-hidden";
const cBaseTrack = "fill-transparent";
const cBaseMeter = "fill-transparent transition-[stroke-dashoffset] duration-200 -rotate-90 origin-[50%_50%]";
const baseSize = 512;
const ProgressRadial = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classesBase;
  let $$slots = compute_slots(slots);
  let { value = void 0 } = $$props;
  let { stroke = 40 } = $$props;
  let { font = 56 } = $$props;
  let { width = "w-36" } = $$props;
  let { meter = "stroke-surface-900 dark:stroke-surface-50" } = $$props;
  let { track = "stroke-surface-500/30" } = $$props;
  let { fill = "fill-token" } = $$props;
  let { labelledby = "" } = $$props;
  const radius = baseSize / 2;
  let circumference = radius;
  let dashoffset;
  function setProgress(percent) {
    circumference = radius * 2 * Math.PI;
    dashoffset = circumference - percent / 100 * circumference;
  }
  setProgress(0);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.stroke === void 0 && $$bindings.stroke && stroke !== void 0)
    $$bindings.stroke(stroke);
  if ($$props.font === void 0 && $$bindings.font && font !== void 0)
    $$bindings.font(font);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.meter === void 0 && $$bindings.meter && meter !== void 0)
    $$bindings.meter(meter);
  if ($$props.track === void 0 && $$bindings.track && track !== void 0)
    $$bindings.track(track);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  if ($$props.labelledby === void 0 && $$bindings.labelledby && labelledby !== void 0)
    $$bindings.labelledby(labelledby);
  classesBase = `${cBase$1} ${width} ${$$props.class ?? ""}`;
  return `


<figure class="${"progress-radial " + escape(classesBase, true)}" data-testid="progress-radial" role="meter"${add_attribute("aria-labelledby", labelledby, 0)}${add_attribute("aria-valuenow", value || 0, 0)}${add_attribute("aria-valuetext", value ? `${value}%` : "Indeterminate Spinner", 0)}${add_attribute("aria-valuemin", 0, 0)}${add_attribute("aria-valuemax", 100, 0)}>
	<svg viewBox="${"0 0 " + escape(baseSize, true) + " " + escape(baseSize, true)}" class="${["rounded-full", value === void 0 ? "animate-spin" : ""].join(" ").trim()}"><circle class="${"progress-radial-track " + escape(cBaseTrack, true) + " " + escape(track, true)}"${add_attribute("stroke-width", stroke, 0)}${add_attribute("r", baseSize / 2, 0)} cx="50%" cy="50%"></circle><circle class="${"progress-radial-meter " + escape(cBaseMeter, true) + " " + escape(meter, true)}"${add_attribute("stroke-width", stroke, 0)}${add_attribute("r", baseSize / 2, 0)} cx="50%" cy="50%"${add_styles({
    "stroke-dasharray": `${circumference}
			${circumference}`,
    "stroke-dashoffset": dashoffset
  })}></circle>${value != void 0 && value >= 0 && $$slots.default ? `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-weight="bold"${add_attribute("font-size", font, 0)} class="${"progress-radial-text " + escape(fill, true)}">${slots.default ? slots.default({}) : ``}</text>` : ``}</svg></figure>`;
});
const cBase = "inline-block";
const cLabel = "unstyled flex items-center";
const cTrack = "flex transition-all duration-[200ms] cursor-pointer";
const cThumb = "w-[50%] h-full scale-[0.8] transition-all duration-[200ms] shadow";
const SlideToggle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cTrackActive;
  let cThumbBackground;
  let cThumbPos;
  let classesDisabled;
  let classesBase;
  let classesLabel;
  let classesTrack;
  let classesThumb;
  let $$restProps = compute_rest_props($$props, ["name", "checked", "size", "active", "border", "rounded", "label"]);
  let $$slots = compute_slots(slots);
  createEventDispatcher();
  let { name } = $$props;
  let { checked = false } = $$props;
  let { size = "md" } = $$props;
  let { active = "bg-surface-900 dark:bg-surface-300" } = $$props;
  let { border = "" } = $$props;
  let { rounded = "rounded-full" } = $$props;
  let { label = "" } = $$props;
  let trackSize;
  switch (size) {
    case "sm":
      trackSize = "w-12 h-6";
      break;
    case "lg":
      trackSize = "w-20 h-10";
      break;
    default:
      trackSize = "w-16 h-8";
  }
  function prunedRestProps() {
    delete $$restProps.class;
    return $$restProps;
  }
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.border === void 0 && $$bindings.border && border !== void 0)
    $$bindings.border(border);
  if ($$props.rounded === void 0 && $$bindings.rounded && rounded !== void 0)
    $$bindings.rounded(rounded);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  cTrackActive = checked ? active : "bg-surface-400 dark:bg-surface-700 cursor-pointer";
  cThumbBackground = checked ? "bg-white/75" : "bg-white";
  cThumbPos = checked ? "translate-x-full" : "";
  classesDisabled = $$props.disabled === true ? "opacity-50" : "hover:brightness-[105%] dark:hover:brightness-110 cursor-pointer";
  classesBase = `${cBase} ${rounded} ${classesDisabled} ${$$props.class ?? ""}`;
  classesLabel = `${cLabel}`;
  classesTrack = `${cTrack} ${border} ${rounded} ${trackSize} ${cTrackActive}`;
  classesThumb = `${cThumb} ${rounded} ${cThumbBackground} ${cThumbPos}`;
  return `<div${add_attribute("id", label, 0)} class="${"slide-toggle " + escape(classesBase, true)}" data-testid="slide-toggle" role="switch"${add_attribute("aria-label", label, 0)}${add_attribute("aria-checked", checked, 0)} tabindex="0"><label class="${"slide-toggle-label " + escape(classesLabel, true)}">
		<input${spread(
    [
      { type: "checkbox" },
      { class: "slide-toggle-input hidden" },
      { name: escape_attribute_value(name) },
      escape_object(prunedRestProps()),
      { disabled: $$props.disabled || null }
    ],
    {}
  )}${add_attribute("checked", checked, 1)}>
		
		<div class="${[
    "slide-toggle-track " + escape(classesTrack, true),
    $$props.disabled ? "cursor-not-allowed" : ""
  ].join(" ").trim()}"><div class="${[
    "slide-toggle-thumb " + escape(classesThumb, true),
    $$props.disabled ? "cursor-not-allowed" : ""
  ].join(" ").trim()}"></div></div>
		
		${$$slots.default ? `<div class="slide-toggle-text ml-3">${slots.default ? slots.default({}) : ``}</div>` : ``}</label></div>`;
});
const dividerClass = "my-12 h-0.5 border-t-0 bg-primary-300 opacity-100 dark:opacity-50";
const PlaylistView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let current;
  let $$unsubscribe_VFS_PATH_PREFIX;
  let $$unsubscribe_Playlist;
  $$unsubscribe_VFS_PATH_PREFIX = subscribe(VFS_PATH_PREFIX, (value) => value);
  $$unsubscribe_Playlist = subscribe(Playlist, (value) => value);
  let { tracklisting } = $$props;
  let valueSingle;
  if ($$props.tracklisting === void 0 && $$bindings.tracklisting && tracklisting !== void 0)
    $$bindings.tracklisting(tracklisting);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    current = Audio.currentTrackName;
    $$rendered = `${validate_component(ListBox, "ListBox").$$render($$result, {}, {}, {
      default: () => {
        return `<h2 class="text-2xl text-tertiary-600 font-bold">Featured Music</h2>
    <hr${add_attribute("class", dividerClass, 0)}>	
 ${each(tracklisting, (title, i) => {
          return `${validate_component(ListBoxItem, "ListBoxItem").$$render(
            $$result,
            {
              name: title,
              value: i,
              group: valueSingle
            },
            {
              group: ($$value) => {
                valueSingle = $$value;
                $$settled = false;
              }
            },
            {
              lead: () => {
                return `<span class="text-tertiary-400">${validate_component(Icon, "Icon").$$render(
                  $$result,
                  {
                    src: current === title ? CircleFilled : CircleDash,
                    class: "h-4 mt-1"
                  },
                  {},
                  {}
                )}</span>
    `;
              },
              default: () => {
                return `${escape(title.replace(".mp3", ""))} 
`;
              }
            }
          )}
<hr${add_attribute("class", dividerClass, 0)}>`;
        })}`;
      }
    })}`;
  } while (!$$settled);
  $$unsubscribe_VFS_PATH_PREFIX();
  $$unsubscribe_Playlist();
  return $$rendered;
});
const ElementaryPlayer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isPlaying;
  let $audioStatus, $$unsubscribe_audioStatus;
  let $Playlist, $$unsubscribe_Playlist;
  let $Decoding, $$unsubscribe_Decoding;
  $$unsubscribe_Playlist = subscribe(Playlist, (value) => $Playlist = value);
  $$unsubscribe_Decoding = subscribe(Decoding, (value) => $Decoding = value);
  const { audioStatus } = Audio.stores;
  $$unsubscribe_audioStatus = subscribe(audioStatus, (value) => $audioStatus = value);
  let tracklisting;
  tracklisting = $Playlist.playlist;
  isPlaying = $audioStatus === "playing";
  $$unsubscribe_audioStatus();
  $$unsubscribe_Playlist();
  $$unsubscribe_Decoding();
  return `${($audioStatus !== "loading" || "closed ") && $Decoding.done ? `<div class="grid grid-cols-2 gap-2 z-10 flex-none"><button${add_attribute(
    "class",
    isPlaying ? " rounded-full bg-surface-700 p-1 items-center" : " rounded-full bg-surface-700 p-1 items-center",
    0
  )} id="transport">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      src: isPlaying ? PauseOutline : PlayOutline,
      class: isPlaying ? "h-8 fill-secondary-200" : "h-8 fill-secondary-300 animate-pulse",
      "data-sveltekit-noscroll": true
    },
    {},
    {}
  )}</button>
	<button class="rounded-full p-2 bg-surface-700 items-center" id="playlist">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      src: QueryQueue,
      class: "h-6 rotate-180 fill-secondary-300",
      "data-sveltekit-noscroll": true
    },
    {},
    {}
  )}</button>
	${$Playlist.show ? `
		<div class="absolute top-10 indent-x-10 bg-surface-700 p-3 text-s text-tertiary-800">${validate_component(PlaylistView, "PlaylistView").$$render($$result, { tracklisting }, {}, {})}</div>` : ``}</div>` : ``}`;
});
const Progress_svelte_svelte_type_style_lang = "";
const css = {
  code: "#parent.svelte-122q9kz{position:relative}#invisible-div.svelte-122q9kz{position:absolute;top:0;left:0;width:100%;height:30px;opacity:0}",
  map: null
};
const Progress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let progress;
  let duration;
  let $$unsubscribe_Scrubbing;
  let $Playlist, $$unsubscribe_Playlist;
  $$unsubscribe_Scrubbing = subscribe(Scrubbing, (value) => value);
  $$unsubscribe_Playlist = subscribe(Playlist, (value) => $Playlist = value);
  $$result.css.add(css);
  progress = $Playlist.currentTrack.progress;
  duration = $Playlist.currentTrack.duration || 0;
  $$unsubscribe_Scrubbing();
  $$unsubscribe_Playlist();
  return `<div id="parent" class="svelte-122q9kz">${validate_component(ProgressBar, "ProgressBar").$$render(
    $$result,
    {
      label: "Progress Bar",
      value: progress * duration,
      height: "h-[0.5em]",
      meter: "bg-gradient-to-r from-yellow-600 to-red-600",
      rounded: "rounded-1",
      min: 0,
      max: duration
    },
    {},
    {}
  )}

<div id="invisible-div" class="svelte-122q9kz"></div>
</div>`;
});
const EndProcAppBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let audioBuffersReady;
  let $$unsubscribe_audioStatus;
  let $$unsubscribe_PlaysCount;
  let $$unsubscribe_Playlist;
  let $CablesText, $$unsubscribe_CablesText;
  let $CablesIsLoaded, $$unsubscribe_CablesIsLoaded;
  $$unsubscribe_PlaysCount = subscribe(PlaysCount, (value) => value);
  $$unsubscribe_Playlist = subscribe(Playlist, (value) => value);
  $$unsubscribe_CablesText = subscribe(CablesText, (value) => $CablesText = value);
  $$unsubscribe_CablesIsLoaded = subscribe(CablesIsLoaded, (value) => $CablesIsLoaded = value);
  createEventDispatcher();
  const { audioStatus } = Audio.stores;
  $$unsubscribe_audioStatus = subscribe(audioStatus, (value) => value);
  audioBuffersReady = Audio.audioBuffersReady;
  $$unsubscribe_audioStatus();
  $$unsubscribe_PlaysCount();
  $$unsubscribe_Playlist();
  $$unsubscribe_CablesText();
  $$unsubscribe_CablesIsLoaded();
  return `${validate_component(AppBar, "AppBar").$$render(
    $$result,
    {
      background: "bg-surface-800",
      gridColumns: "grid-cols-3",
      slotTrail: "place-content-end",
      slotLead: "mb-0 h-10",
      regionRowHeadline: "grid grid-cols-3"
    },
    {},
    {
      trail: () => {
        return `
		<div class="flex justify-start"><a class="logo-item p-2 flex-none" href="/blog" data-sveltekit-noscroll>${validate_component(Icon, "Icon").$$render($$result, { src: ChartMarimekko, class: "h-7" }, {}, {})}
				<span class="text-m">Latest</span></a>
			<a class="logo-item p-2 flex-none" href="/">${validate_component(Icon, "Icon").$$render(
          $$result,
          {
            src: ProgressBarRound,
            class: "h-7",
            "data-sveltekit-noscroll": true
          },
          {},
          {}
        )}
				<span class="text-m">Catalogue</span></a>
			<a class="logo-item p-2 flex-none" href="/">${validate_component(Icon, "Icon").$$render(
          $$result,
          {
            src: Events,
            class: "h-7",
            "data-sveltekit-noscroll": true
          },
          {},
          {}
        )}
				<span class="text-m">Artists</span></a></div>
	`;
      },
      lead: () => {
        return `<div class="flex flex-row gradient-text text-[1.618em] leading-none"><div class="basis-1/5"><a href="/">${escape($CablesText[0])}</a>
			<a href="/">${escape($CablesText[1])}</a></div></div>
	
		
		${audioBuffersReady && $CablesIsLoaded ? `${validate_component(ElementaryPlayer, "ElementaryPlayer").$$render($$result, {}, {}, {})}` : `<div class="absolute top-6">${validate_component(Icon, "Icon").$$render(
          $$result,
          {
            src: Cube,
            class: "h-8 animate-spin",
            "data-sveltekit-noscroll": true
          },
          {},
          {}
        )}</div>`}	
	`;
      },
      default: () => {
        return `
	
		${audioBuffersReady && $CablesIsLoaded ? `<span>${validate_component(Progress, "Progress").$$render($$result, {}, {}, {})}</span>` : ``}
		
	`;
      }
    }
  )}`;
});
const SplashSVG = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isPlaying;
  let $audioStatus, $$unsubscribe_audioStatus;
  const { audioStatus } = Audio.stores;
  $$unsubscribe_audioStatus = subscribe(audioStatus, (value) => $audioStatus = value);
  const svgClass = [
    "w-2/3 mx-auto hover:stroke-secondary-700",
    "w-2/3 mx-auto hover:stroke-secondary-500 stroke-secondary-800"
  ];
  isPlaying = $audioStatus === "playing";
  $$unsubscribe_audioStatus();
  return `
<svg${add_attribute("class", svgClass[isPlaying ? 1 : 0], 0)} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 180 136" xml:space="preserve"><filter id="hues"><feColorMatrix in="SourceGraphic" type="luminanceToAlpha"></feColorMatrix></filter><style type="text/css">.st0{clip-path:url(#SVGID_2_);}
	.st1{fill:#202020;}
	.st2{clip-path:url(#SVGID_4_);}
	.st3{fill:#262626;}
	.st4{fill:#1A1A1A;}
	.st5{fill:#242424;}
	.st6{clip-path:url(#SVGID_6_);}
	.st7{clip-path:url(#SVGID_8_);}
	.st8{clip-path:url(#SVGID_10_);}
	.st9{fill:#B4B4B4;}
	.st10{fill:#828282;}
	.st11{clip-path:url(#SVGID_12_);}
	.st12{fill:#9F9F9F;}
	.st13{clip-path:url(#SVGID_14_);}
	.st14{clip-path:url(#SVGID_16_);}
	.st15{clip-path:url(#SVGID_18_);}
	.st16{clip-path:url(#SVGID_20_);}
	.st17{clip-path:url(#SVGID_22_);}
	.st18{clip-path:url(#SVGID_24_);}
	.st19{fill:#BFBFBF;}
	.st20{clip-path:url(#SVGID_26_);}
	.st21{clip-path:url(#SVGID_28_);}
	.st22{clip-path:url(#SVGID_30_);}
	.st23{clip-path:url(#SVGID_32_);}
	.st24{clip-path:url(#SVGID_34_);}
	.st25{fill:#808080;}
	.st26{clip-path:url(#SVGID_36_);}
	.st27{fill:#1E1E1E;}
	.st28{clip-path:url(#SVGID_38_);}
	.st29{fill:#2D2D2D;}
	.st30{fill:#969696;}
	.st31{clip-path:url(#SVGID_40_);}
	.st32{clip-path:url(#SVGID_42_);}
	.st33{clip-path:url(#SVGID_44_);}
	.st34{clip-path:url(#SVGID_46_);}
	.st35{clip-path:url(#SVGID_48_);}
	.st36{clip-path:url(#SVGID_50_);}
	.st37{clip-path:url(#SVGID_52_);}
	.st38{clip-path:url(#SVGID_54_);}
	.st39{fill:#959595;}
	.st40{clip-path:url(#SVGID_56_);}
	.st41{clip-path:url(#SVGID_58_);}
	.st42{clip-path:url(#SVGID_60_);}
	.st43{clip-path:url(#SVGID_62_);}
	.st44{clip-path:url(#SVGID_64_);}
	.st45{clip-path:url(#SVGID_66_);}
	.st46{clip-path:url(#SVGID_68_);}
	.st47{clip-path:url(#SVGID_70_);}
	.st48{clip-path:url(#SVGID_72_);}
	.st49{clip-path:url(#SVGID_74_);}
	.st50{clip-path:url(#SVGID_76_);}
	.st51{clip-path:url(#SVGID_78_);}
	.st52{clip-path:url(#SVGID_80_);}
	.st53{clip-path:url(#SVGID_82_);}
	.st54{clip-path:url(#SVGID_84_);}
	.st55{clip-path:url(#SVGID_86_);}
	.st56{clip-path:url(#SVGID_88_);}
	.st57{clip-path:url(#SVGID_90_);}
	.st58{clip-path:url(#SVGID_92_);}
	.st59{clip-path:url(#SVGID_94_);}
	.st60{clip-path:url(#SVGID_96_);}
	.st61{clip-path:url(#SVGID_98_);}
	.st62{clip-path:url(#SVGID_100_);}
	.st63{clip-path:url(#SVGID_102_);}
	.st64{clip-path:url(#SVGID_104_);}
	.st65{fill:#DFDFDF;}
	.st66{clip-path:url(#SVGID_106_);}
	.st67{fill:#310000;}
	.st68{fill:#FF5200;}
	.st69{fill:#140000;}
	.st70{fill:#FF5E00;}
</style><g filter="url(#hues)"><g><g><defs><path id="SVGID_1_" d="M177,113.6l-22.8-12.4c0.3-0.3,0.6-0.6,0.9-0.9c0.3-0.3,0.5-0.7,0.7-1.1c0.2-0.4,0.3-0.8,0.4-1.2
					c0.1-0.4,0.2-0.8,0.2-1.2l22.8,12.4c0,0.4-0.1,0.8-0.2,1.2c-0.1,0.4-0.3,0.8-0.4,1.2c-0.2,0.4-0.4,0.7-0.7,1.1
					C177.6,113,177.3,113.3,177,113.6z"></path></defs><clipPath id="SVGID_2_"><use xlink:href="#SVGID_1_" style="overflow:visible; "></use></clipPath><g class="st0"><g><path class="st1" d="M177,113.6l-22.8-12.4c0.3-0.3,0.6-0.6,0.9-0.9c0.3-0.3,0.5-0.7,0.7-1.1c0.2-0.4,0.3-0.8,0.4-1.2
						c0.1-0.4,0.2-0.8,0.2-1.2l22.8,12.4c0,0.4-0.1,0.8-0.2,1.2c-0.1,0.4-0.3,0.8-0.4,1.2c-0.2,0.4-0.4,0.7-0.7,1.1
						C177.6,113,177.3,113.3,177,113.6"></path></g></g></g></g><g><g><defs><path id="SVGID_3_" d="M174.9,114.6l-22.8-12.4c0.4-0.1,0.8-0.2,1.1-0.4c0.4-0.2,0.7-0.4,1-0.7l22.8,12.4
					c-0.3,0.3-0.6,0.5-1,0.7C175.6,114.4,175.2,114.5,174.9,114.6z"></path></defs><clipPath id="SVGID_4_"><use xlink:href="#SVGID_3_" style="overflow:visible;"></use></clipPath><g class="st2"><g><path class="st3" d="M174.9,114.6l-22.8-12.4c0.4-0.1,0.8-0.2,1.1-0.4l0.6-0.3l22.8,12.4c-0.2,0.1-0.4,0.2-0.6,0.3
						C175.6,114.4,175.2,114.5,174.9,114.6"></path><path class="st1" d="M176.6,113.9l-22.8-12.4c0.2-0.1,0.3-0.2,0.4-0.3l22.8,12.4L176.6,113.9"></path></g></g></g></g><polygon class="st4" points="179.2,109.2 156.4,96.8 156.8,50.9 179.5,63.3 	"></polygon><polygon class="st5" points="125.8,121.5 103,109.1 152.1,102.2 174.9,114.6 	"></polygon><g><g><defs><path id="SVGID_5_" d="M125.2,121.5l-22.8-12.4c0.2,0,0.5,0,0.7,0l22.8,12.4C125.6,121.5,125.4,121.5,125.2,121.5z"></path></defs><clipPath id="SVGID_6_"><use xlink:href="#SVGID_5_" style="overflow:visible;"></use></clipPath><g class="st6"><g><path class="st3" d="M125.2,121.5l-22.8-12.4c0.2,0,0.5,0,0.7,0l22.8,12.4C125.6,121.6,125.4,121.6,125.2,121.5"></path></g></g></g></g><g><g><defs><path id="SVGID_7_" d="M123.7,121.2l-22.8-12.4c0.2,0.1,0.5,0.2,0.8,0.2c0.3,0.1,0.5,0.1,0.8,0.1l22.8,12.4
					c-0.3,0-0.5,0-0.8-0.1C124.1,121.4,123.9,121.3,123.7,121.2z"></path></defs><clipPath id="SVGID_8_"><use xlink:href="#SVGID_7_" style="overflow:visible;"></use></clipPath><g class="st7"><g><path class="st1" d="M123.7,121.2l-22.8-12.4h0.1L123.7,121.2L123.7,121.2"></path><path class="st3" d="M123.7,121.2l-22.8-12.4c0.2,0.1,0.4,0.2,0.7,0.2c0.3,0.1,0.5,0.1,0.8,0.1l22.8,12.4c-0.3,0-0.5,0-0.8-0.1
						C124.1,121.4,123.9,121.3,123.7,121.2"></path></g></g></g></g><g><g><defs><polygon id="SVGID_9_" points="123.3,121.1 100.6,108.7 100.8,108.8 123.7,121.2 				"></polygon></defs><clipPath id="SVGID_10_"><use xlink:href="#SVGID_9_" style="overflow:visible;"></use></clipPath><g class="st8"><g><path class="st1" d="M123.3,121.1l-22.8-12.4l0.2,0.1l22.8,12.4L123.3,121.1"></path><polyline class="st3" points="123.6,121.2 100.8,108.8 100.8,108.8 123.6,121.2 123.6,121.2"></polyline></g></g></g></g><polygon class="st9" points="128.6,111.3 105.8,98.9 147.6,93 170.4,105.4 	"></polygon><polygon class="st4" points="179.5,63.3 156.8,50.9 156.6,5.3 179.4,17.7 	"></polygon><polygon class="st10" points="170.4,105.4 147.6,93 147.8,11.4 170.5,23.8 	"></polygon><polygon class="st5" points="129.1,110.3 106.3,97.9 146.7,92.2 169.5,104.6 	"></polygon><g><g><defs><path id="SVGID_11_" d="M123.3,121.1l-22.8-12.4c-0.2-0.1-0.3-0.2-0.4-0.3c-0.2-0.2-0.4-0.3-0.6-0.5l22.8,12.4
					c0.2,0.2,0.4,0.4,0.6,0.5C123.1,120.9,123.2,121,123.3,121.1z"></path></defs><clipPath id="SVGID_12_"><use xlink:href="#SVGID_11_" style="overflow:visible;"></use></clipPath><g class="st11"><g><path class="st12" d="M123.3,121.1l-22.8-12.4c-0.2-0.1-0.3-0.2-0.4-0.3c-0.2-0.2-0.4-0.3-0.6-0.5l22.8,12.4
						c0.2,0.2,0.4,0.4,0.6,0.5C123.1,120.9,123.2,121,123.3,121.1"></path></g></g></g></g><g><g><defs><path id="SVGID_13_" d="M179.4,17.7L156.6,5.3c0-0.4,0-0.8-0.1-1.2c-0.1-0.4-0.3-0.8-0.5-1.1l22.8,12.4c0.2,0.4,0.3,0.7,0.5,1.1
					C179.3,16.8,179.4,17.2,179.4,17.7z"></path></defs><clipPath id="SVGID_14_"><use xlink:href="#SVGID_13_" style="overflow:visible;"></use></clipPath><g class="st13"><g><path class="st1" d="M179.4,17.7L156.6,5.3c0-0.4,0-0.8-0.1-1.2c-0.1-0.4-0.3-0.8-0.5-1.1l22.8,12.4c0.2,0.4,0.3,0.7,0.5,1.1
						C179.3,16.8,179.4,17.2,179.4,17.7"></path></g></g></g></g><g><g><defs><path id="SVGID_15_" d="M122.3,120.2l-22.8-12.4c-0.2-0.2-0.3-0.4-0.5-0.7l22.8,12.4C122,119.8,122.2,120,122.3,120.2z"></path></defs><clipPath id="SVGID_16_"><use xlink:href="#SVGID_15_" style="overflow:visible;"></use></clipPath><g class="st14"><g><path class="st12" d="M122.3,120.2l-22.8-12.4c-0.2-0.2-0.3-0.4-0.5-0.7l22.8,12.4C122,119.8,122.2,120.1,122.3,120.2"></path></g></g></g></g><g><g><defs><path id="SVGID_17_" d="M122.9,121.9l-22.8-12.4c-0.2-0.1-0.4-0.2-0.5-0.3c-0.3-0.2-0.5-0.4-0.7-0.7c-0.2-0.2-0.4-0.5-0.6-0.8
					l22.8,12.4c0.2,0.3,0.3,0.5,0.6,0.8c0.2,0.2,0.4,0.5,0.7,0.7C122.5,121.7,122.7,121.8,122.9,121.9z"></path></defs><clipPath id="SVGID_18_"><use xlink:href="#SVGID_17_" style="overflow:visible;"></use></clipPath><g class="st15"><g><path class="st1" d="M122.9,121.9l-22.8-12.4c-0.2-0.1-0.4-0.2-0.5-0.3c-0.3-0.2-0.5-0.4-0.7-0.7c-0.2-0.2-0.4-0.5-0.6-0.8
						l22.8,12.4c0.2,0.3,0.3,0.5,0.6,0.8c0.2,0.2,0.4,0.5,0.7,0.7C122.5,121.7,122.7,121.8,122.9,121.9"></path></g></g></g></g><g><g><defs><path id="SVGID_19_" d="M154.5,1.4l22.8,12.4c0.3,0.1,0.5,0.3,0.8,0.6c0.3,0.3,0.5,0.6,0.7,0.9L156,2.9
					c-0.2-0.3-0.4-0.6-0.7-0.9C155,1.7,154.8,1.6,154.5,1.4z"></path></defs><clipPath id="SVGID_20_"><use xlink:href="#SVGID_19_" style="overflow:visible;"></use></clipPath><g class="st16"><g><path class="st1" d="M178.8,15.3L156,2.9c-0.2-0.3-0.4-0.6-0.7-0.9c-0.2-0.2-0.5-0.4-0.8-0.6l22.8,12.5
						c0.3,0.1,0.5,0.3,0.8,0.6C178.3,14.7,178.6,15,178.8,15.3"></path></g></g></g></g><g><g><defs><polygon id="SVGID_21_" points="154.3,1.3 154.5,1.4 177.3,13.9 177.1,13.8 177.1,13.8 				"></polygon></defs><clipPath id="SVGID_22_"><use xlink:href="#SVGID_21_" style="overflow:visible;"></use></clipPath><g class="st17"><g><path class="st12" d="M177,13.7L154.2,1.3l0.1,0.1l0.2,0.1l22.8,12.4l-0.2-0.1L177,13.7"></path></g></g></g></g><g><g><defs><path id="SVGID_23_" d="M153.6,1.1c0.2,0.1,0.5,0.1,0.7,0.2l22.8,12.4c-0.2-0.1-0.4-0.2-0.7-0.2L153.6,1.1z"></path></defs><clipPath id="SVGID_24_"><use xlink:href="#SVGID_23_" style="overflow:visible;"></use></clipPath><g class="st18"><g><path class="st19" d="M174.9,13.4L152.1,1c0.4-0.1,0.8-0.1,1.2,0c0.3,0,0.6,0.1,1,0.3L177,13.7c-0.3-0.1-0.7-0.2-1-0.3
						C175.6,13.3,175.2,13.3,174.9,13.4"></path><path class="st12" d="M177,13.7L154.2,1.3l0.1,0.1l0.2,0.1l22.8,12.4l-0.2-0.1L177,13.7"></path></g></g></g></g><polygon class="st4" points="169.5,104.6 146.7,92.2 146.9,12.5 169.7,24.9 	"></polygon><g><g><defs><path id="SVGID_25_" d="M153.6,1.1c0.1,0.1,0.3,0.2,0.5,0.3l3.8,2.1l4.3,2.3l14.2,7.7c-0.1,0-0.3-0.1-0.4-0.1
					c-0.4-0.1-0.8-0.1-1.2,0L152.1,1c0.4-0.1,0.8-0.1,1.2,0C153.4,1,153.5,1.1,153.6,1.1z"></path></defs><clipPath id="SVGID_26_"><use xlink:href="#SVGID_25_" style="overflow:visible;"></use></clipPath><g class="st20"><g><path class="st19" d="M174.9,13.4L152.1,1c0.4-0.1,0.8-0.1,1.2,0c0.3,0,0.6,0.1,1,0.3L177,13.7c-0.3-0.1-0.7-0.2-1-0.3
						C175.6,13.3,175.2,13.3,174.9,13.4"></path></g></g></g></g><g><g><defs><path id="SVGID_27_" d="M154.9,0.5l22.8,12.4l-0.2-0.1c-0.4-0.2-0.9-0.3-1.3-0.4c-0.5-0.1-0.9-0.1-1.4,0L152.1,0
					c0.5-0.1,0.9-0.1,1.4,0c0.5,0.1,0.9,0.2,1.3,0.4L154.9,0.5z"></path></defs><clipPath id="SVGID_28_"><use xlink:href="#SVGID_27_" style="overflow:visible;"></use></clipPath><g class="st21"><g><path class="st3" d="M174.9,12.4L152.1,0c0.5-0.1,0.9-0.1,1.4,0c0.4,0.1,0.8,0.2,1.2,0.3l22.8,12.4c-0.4-0.2-0.7-0.3-1.1-0.3
						C175.8,12.4,175.4,12.4,174.9,12.4"></path><path class="st1" d="M177.4,12.8L154.6,0.4l0.2,0.1l0.2,0.1l22.8,12.4l-0.2-0.1L177.4,12.8"></path></g></g></g></g><g><g><defs><path id="SVGID_29_" d="M80.8,126L58,113.6c0.2-0.2,0.3-0.5,0.4-0.8l22.8,12.4C81.1,125.5,81,125.8,80.8,126z"></path></defs><clipPath id="SVGID_30_"><use xlink:href="#SVGID_29_" style="overflow:visible;"></use></clipPath><g class="st22"><g><path class="st1" d="M80.8,126L58,113.6c0.2-0.2,0.3-0.5,0.4-0.8l22.8,12.4C81.1,125.5,81,125.8,80.8,126"></path></g></g></g></g><g><g><defs><path id="SVGID_31_" d="M80.2,126.7l-22.8-12.4c0.2-0.2,0.4-0.4,0.6-0.7L80.8,126C80.6,126.3,80.4,126.5,80.2,126.7z"></path></defs><clipPath id="SVGID_32_"><use xlink:href="#SVGID_31_" style="overflow:visible;"></use></clipPath><g class="st23"><g><path class="st1" d="M80.2,126.7l-22.8-12.4c0.2-0.2,0.4-0.4,0.6-0.7L80.8,126C80.6,126.3,80.4,126.5,80.2,126.7"></path></g></g></g></g><g><g><defs><path id="SVGID_33_" d="M79.6,127.3l-22.8-12.4c0.2-0.2,0.5-0.4,0.7-0.6l22.8,12.4C80,126.9,79.8,127.1,79.6,127.3z"></path></defs><clipPath id="SVGID_34_"><use xlink:href="#SVGID_33_" style="overflow:visible;"></use></clipPath><g class="st24"><g><path class="st1" d="M79.6,127.3l-22.8-12.4c0.2-0.2,0.5-0.4,0.7-0.6l22.8,12.4C80,126.9,79.8,127.1,79.6,127.3"></path></g></g></g></g><polygon class="st4" points="128.6,111.3 105.8,98.9 84.1,61.1 106.8,73.5 	"></polygon><polygon class="st25" points="121.9,119.6 99.1,107.2 78.8,71.7 101.6,84.1 	"></polygon><polygon class="st4" points="121.1,120.2 98.3,107.8 78.8,73.6 101.6,86 	"></polygon><g><g><defs><path id="SVGID_35_" d="M78.1,128.1l-22.8-12.4c0.3-0.1,0.5-0.2,0.8-0.3c0.3-0.1,0.5-0.3,0.7-0.5l22.8,12.4
					c-0.2,0.2-0.5,0.3-0.7,0.5C78.6,127.9,78.3,128,78.1,128.1z"></path></defs><clipPath id="SVGID_36_"><use xlink:href="#SVGID_35_" style="overflow:visible;"></use></clipPath><g class="st26"><g><path class="st3" d="M78.1,128.1l-22.8-12.4c0.3-0.1,0.5-0.2,0.8-0.3l0.3-0.2l22.8,12.4l-0.3,0.2
						C78.6,127.9,78.3,128,78.1,128.1"></path><path class="st1" d="M79.2,127.6l-22.8-12.4l0.4-0.3l22.8,12.4C79.4,127.4,79.3,127.5,79.2,127.6"></path></g></g></g></g><polygon class="st27" points="81.2,125.3 58.4,112.9 78.8,71.7 101.6,84.1 	"></polygon><g><g><defs><path id="SVGID_37_" d="M77.3,128.3l-22.8-12.4c0.3,0,0.5-0.1,0.8-0.2l22.8,12.4C77.8,128.2,77.6,128.2,77.3,128.3z"></path></defs><clipPath id="SVGID_38_"><use xlink:href="#SVGID_37_" style="overflow:visible;"></use></clipPath><g class="st28"><g><path class="st3" d="M77.3,128.3l-22.8-12.4c0.3,0,0.5-0.1,0.8-0.2l22.8,12.4C77.8,128.2,77.6,128.2,77.3,128.3"></path></g></g></g></g><path class="st29" d="M106.8,73.5l21.9-43.9l41.8-5.9l-0.1,81.6l-41.8,5.9L106.8,73.5z M169.6,24.9l-40.4,5.7l-21.4,42.8l21.2,36.9
		l40.4-5.7L169.6,24.9"></path><polygon class="st27" points="106.8,73.5 84.1,61.1 106,17.3 128.8,29.7 	"></polygon><polygon class="st5" points="128.8,29.7 106,17.3 147.8,11.4 170.5,23.8 	"></polygon><polygon class="st30" points="74.5,118.9 51.7,106.5 73.6,62.6 96.4,75 	"></polygon><polygon class="st9" points="126,20.3 103.2,7.9 152.1,1 174.9,13.4 	"></polygon><g><g><defs><polygon id="SVGID_39_" points="102.8,8 103.2,7.9 126,20.3 125.5,20.4 				"></polygon></defs><clipPath id="SVGID_40_"><use xlink:href="#SVGID_39_" style="overflow:visible;"></use></clipPath><g class="st31"><g><path class="st19" d="M125.2,20.5L102.4,8.1c0.3-0.1,0.5-0.1,0.8-0.2L126,20.3C125.7,20.3,125.5,20.4,125.2,20.5"></path></g></g></g></g><polygon class="st5" points="125.9,19.3 103.1,6.9 152.1,0 174.9,12.4 	"></polygon><g><g><defs><path id="SVGID_41_" d="M102.8,8c0.2,0.1,0.4,0.2,0.6,0.3l1.2,0.6l1.2,0.7l0.6,0.4l1.3,0.7l5,2.7l12.9,7l-0.3,0.1L102.4,8.1
					L102.8,8z"></path></defs><clipPath id="SVGID_42_"><use xlink:href="#SVGID_41_" style="overflow:visible;"></use></clipPath><g class="st32"><g><path class="st19" d="M125.2,20.5L102.4,8.1c0.3-0.1,0.5-0.1,0.8-0.2L126,20.3C125.7,20.3,125.5,20.4,125.2,20.5"></path></g></g></g></g><polygon class="st27" points="74,118 51.2,105.6 72.6,62.8 95.4,75.2 	"></polygon><g><g><defs><path id="SVGID_43_" d="M101.9,8.2c0.1-0.1,0.3-0.1,0.5-0.2l22.8,12.4c-0.2,0.1-0.3,0.1-0.5,0.2L101.9,8.2z"></path></defs><clipPath id="SVGID_44_"><use xlink:href="#SVGID_43_" style="overflow:visible;"></use></clipPath><g class="st33"><g><path class="st19" d="M124.1,21L101.3,8.6c0.1-0.1,0.2-0.1,0.4-0.2c0.2-0.1,0.5-0.2,0.8-0.3l22.8,12.4
						c-0.3,0.1-0.5,0.2-0.8,0.3C124.3,20.9,124.2,20.9,124.1,21"></path></g></g></g></g><g><g><defs><path id="SVGID_45_" d="M101.9,8.2l22.8,12.4l-0.3,0.1c-0.1,0.1-0.3,0.1-0.4,0.2L101.2,8.6l0.4-0.2L101.9,8.2z"></path></defs><clipPath id="SVGID_46_"><use xlink:href="#SVGID_45_" style="overflow:visible;"></use></clipPath><g class="st34"><g><path class="st12" d="M123.7,21.2L100.9,8.9l0.4-0.2L124.1,21C123.9,21.1,123.8,21.2,123.7,21.2"></path><path class="st19" d="M124.1,21L101.3,8.6c0.1-0.1,0.2-0.1,0.4-0.2c0.2-0.1,0.5-0.2,0.8-0.3l22.8,12.4
						c-0.3,0.1-0.5,0.2-0.8,0.3C124.3,20.9,124.2,20.9,124.1,21"></path></g></g></g></g><g><g><defs><polygon id="SVGID_47_" points="101.2,8.6 124,21 123.7,21.2 100.9,8.9 				"></polygon></defs><clipPath id="SVGID_48_"><use xlink:href="#SVGID_47_" style="overflow:visible;"></use></clipPath><g class="st35"><g><path class="st12" d="M123.7,21.2L100.9,8.9l0.4-0.2L124.1,21C123.9,21.1,123.8,21.2,123.7,21.2"></path></g></g></g></g><g><g><defs><path id="SVGID_49_" d="M124.1,19.9L101.3,7.5c0.3-0.1,0.6-0.3,0.9-0.4c0.3-0.1,0.6-0.2,0.9-0.2l22.8,12.4
					c-0.3,0-0.6,0.1-0.8,0.2C124.7,19.6,124.4,19.8,124.1,19.9z"></path></defs><clipPath id="SVGID_50_"><use xlink:href="#SVGID_49_" style="overflow:visible;"></use></clipPath><g class="st36"><g><path class="st3" d="M124.1,19.9L101.3,7.5c0.3-0.1,0.6-0.3,0.9-0.4c0.3-0.1,0.6-0.2,0.9-0.2l22.8,12.4c-0.3,0-0.6,0.1-0.8,0.2
						C124.7,19.6,124.4,19.8,124.1,19.9"></path></g></g></g></g><g><g><defs><path id="SVGID_51_" d="M123.1,21.9L100.3,9.5c0.2-0.2,0.4-0.4,0.6-0.6l22.8,12.4C123.5,21.5,123.3,21.7,123.1,21.9z"></path></defs><clipPath id="SVGID_52_"><use xlink:href="#SVGID_51_" style="overflow:visible;"></use></clipPath><g class="st37"><g><path class="st12" d="M123.1,21.9L100.3,9.5c0.2-0.2,0.4-0.4,0.6-0.6l22.8,12.4C123.5,21.5,123.3,21.7,123.1,21.9"></path></g></g></g></g><g><g><defs><path id="SVGID_53_" d="M122.5,22.5L99.7,10.1c0.2-0.2,0.4-0.5,0.6-0.7l22.8,12.4C122.9,22.1,122.7,22.3,122.5,22.5z"></path></defs><clipPath id="SVGID_54_"><use xlink:href="#SVGID_53_" style="overflow:visible;"></use></clipPath><g class="st38"><g><path class="st12" d="M122.5,22.5L99.7,10.1c0.2-0.2,0.4-0.5,0.6-0.7l22.8,12.4C122.9,22.1,122.7,22.3,122.5,22.5"></path></g></g></g></g><polygon class="st39" points="101.7,64.5 78.9,52.1 99.2,10.9 122,23.3 	"></polygon><g><g><defs><path id="SVGID_55_" d="M122,23.3L99.2,10.9c0.1-0.3,0.3-0.5,0.5-0.8l22.8,12.4C122.3,22.7,122.2,23,122,23.3z"></path></defs><clipPath id="SVGID_56_"><use xlink:href="#SVGID_55_" style="overflow:visible;"></use></clipPath><g class="st40"><g><path class="st12" d="M122,23.3L99.2,10.9c0.1-0.3,0.3-0.5,0.5-0.8l22.8,12.4C122.3,22.7,122.2,23,122,23.3"></path></g></g></g></g><g><g><defs><path id="SVGID_57_" d="M121.8,22L99,9.6c0.2-0.3,0.4-0.6,0.7-0.8c0.2-0.3,0.5-0.5,0.8-0.7c0.3-0.2,0.6-0.4,0.9-0.6l22.8,12.4
					c-0.3,0.2-0.6,0.4-0.9,0.6c-0.3,0.2-0.5,0.4-0.8,0.7C122.2,21.4,122,21.7,121.8,22z"></path></defs><clipPath id="SVGID_58_"><use xlink:href="#SVGID_57_" style="overflow:visible;"></use></clipPath><g class="st41"><g><path class="st1" d="M121.8,22L99,9.6c0.2-0.3,0.4-0.6,0.7-0.8c0.2-0.3,0.5-0.5,0.8-0.7l0.4-0.3l22.8,12.4
						c-0.1,0.1-0.3,0.2-0.4,0.3c-0.3,0.2-0.5,0.4-0.8,0.7C122.2,21.4,122,21.7,121.8,22"></path><path class="st3" d="M123.7,20.2L100.9,7.8c0.1-0.1,0.3-0.2,0.4-0.2l22.8,12.4L123.7,20.2"></path></g></g></g></g><polygon class="st27" points="101.7,62.6 78.9,50.2 98.5,10.5 121.3,22.9 	"></polygon><g><g><defs><path id="SVGID_59_" d="M121.3,22.9L98.5,10.5c0.2-0.3,0.3-0.6,0.6-0.9l22.8,12.4C121.6,22.2,121.4,22.6,121.3,22.9z"></path></defs><clipPath id="SVGID_60_"><use xlink:href="#SVGID_59_" style="overflow:visible;"></use></clipPath><g class="st42"><g><path class="st1" d="M121.3,22.9L98.5,10.5c0.2-0.3,0.3-0.6,0.6-0.9l22.8,12.4C121.6,22.2,121.4,22.6,121.3,22.9"></path></g></g></g></g><polygon class="st5" points="28.2,135.2 5.4,122.8 54.5,115.9 77.3,128.3 	"></polygon><polygon class="st9" points="32.7,124.8 9.9,112.4 51.7,106.5 74.5,118.9 	"></polygon><polygon class="st5" points="33.6,123.7 10.8,111.3 51.2,105.6 74,118 	"></polygon><g><g><defs><path id="SVGID_61_" d="M26,134.9L3.2,122.5c0.3,0.2,0.7,0.3,1.1,0.3c0.4,0.1,0.8,0.1,1.2,0l22.8,12.4c-0.4,0.1-0.8,0.1-1.2,0
					C26.7,135.1,26.3,135,26,134.9z"></path></defs><clipPath id="SVGID_62_"><use xlink:href="#SVGID_61_" style="overflow:visible;"></use></clipPath><g class="st43"><g><path class="st1" d="M26,134.9L3.2,122.5h0.1L26,134.9L26,134.9"></path><path class="st3" d="M26,134.9L3.2,122.5c0.3,0.1,0.7,0.2,1,0.3c0.4,0.1,0.8,0.1,1.2,0l22.8,12.4c-0.4,0.1-0.8,0.1-1.2,0
						C26.7,135.1,26.3,135,26,134.9"></path></g></g></g></g><g><g><defs><path id="SVGID_63_" d="M25.8,134.8L3,122.4l0.2,0.1L26,134.9C25.9,134.8,25.8,134.8,25.8,134.8z"></path></defs><clipPath id="SVGID_64_"><use xlink:href="#SVGID_63_" style="overflow:visible;"></use></clipPath><g class="st44"><g><path class="st1" d="M25.8,134.8L3,122.4l0.2,0.1L26,134.9C25.9,134.8,25.8,134.8,25.8,134.8"></path></g></g></g></g><g><g><defs><path id="SVGID_65_" d="M2.6,122.1l22.8,12.4c0.1,0.1,0.3,0.2,0.4,0.3L3,122.4C2.9,122.3,2.7,122.2,2.6,122.1z"></path></defs><clipPath id="SVGID_66_"><use xlink:href="#SVGID_65_" style="overflow:visible;"></use></clipPath><g class="st45"><g><path class="st12" d="M25.8,134.8L3,122.4c-0.3-0.2-0.5-0.3-0.8-0.6c-0.3-0.3-0.5-0.6-0.7-0.9c-0.2-0.3-0.4-0.7-0.5-1.1
						l22.8,12.4c0.2,0.8,0.6,1.5,1.2,2C25.2,134.4,25.5,134.6,25.8,134.8"></path></g></g></g></g><polygon class="st4" points="101.7,64.5 78.9,52.1 58.6,16.6 81.4,29 	"></polygon><g><g><defs><path id="SVGID_67_" d="M1.6,121l22.8,12.4c0.2,0.3,0.4,0.5,0.6,0.8c0.1,0.1,0.2,0.2,0.4,0.3L2.6,122.1
					c-0.1-0.1-0.3-0.2-0.4-0.3C2,121.6,1.8,121.3,1.6,121z"></path></defs><clipPath id="SVGID_68_"><use xlink:href="#SVGID_67_" style="overflow:visible;"></use></clipPath><g class="st46"><g><path class="st12" d="M25.8,134.8L3,122.4c-0.3-0.2-0.5-0.3-0.8-0.6c-0.3-0.3-0.5-0.6-0.7-0.9c-0.2-0.3-0.4-0.7-0.5-1.1
						l22.8,12.4c0.2,0.8,0.6,1.5,1.2,2C25.2,134.4,25.5,134.6,25.8,134.8"></path></g></g></g></g><g><g><defs><path id="SVGID_69_" d="M1.5,120.8l22.8,12.4v0.1L1.5,120.8C1.5,120.8,1.5,120.8,1.5,120.8z"></path></defs><clipPath id="SVGID_70_"><use xlink:href="#SVGID_69_" style="overflow:visible;"></use></clipPath><g class="st47"><g><path class="st12" d="M25.8,134.8L3,122.4c-0.3-0.2-0.5-0.3-0.8-0.6c-0.3-0.3-0.5-0.6-0.7-0.9c-0.2-0.3-0.4-0.7-0.5-1.1
						l22.8,12.4c0.2,0.8,0.6,1.5,1.2,2C25.2,134.4,25.5,134.6,25.8,134.8"></path></g></g></g></g><g><g><defs><path id="SVGID_71_" d="M1.5,120.8c-0.2-0.3-0.3-0.7-0.4-1l22.8,12.4c0.1,0.3,0.2,0.7,0.4,1L3.4,121.9l-1-0.5L1.8,121l-0.1-0.1
					C1.6,120.9,1.5,120.9,1.5,120.8z"></path></defs><clipPath id="SVGID_72_"><use xlink:href="#SVGID_71_" style="overflow:visible;"></use></clipPath><g class="st48"><g><path class="st12" d="M25.8,134.8L3,122.4c-0.3-0.2-0.5-0.3-0.8-0.6c-0.3-0.3-0.5-0.6-0.7-0.9c-0.2-0.3-0.4-0.7-0.5-1.1
						l22.8,12.4c0.2,0.8,0.6,1.5,1.2,2C25.2,134.4,25.5,134.6,25.8,134.8"></path></g></g></g></g><g><g><defs><path id="SVGID_73_" d="M81.4,29L58.7,16.6c-0.1-0.3-0.3-0.5-0.5-0.7c-0.2-0.2-0.4-0.4-0.6-0.6l22.8,12.4
					c0.2,0.2,0.4,0.3,0.6,0.6C81.1,28.5,81.3,28.7,81.4,29z"></path></defs><clipPath id="SVGID_74_"><use xlink:href="#SVGID_73_" style="overflow:visible;"></use></clipPath><g class="st49"><g><path class="st1" d="M81.4,29L58.7,16.6c-0.1-0.3-0.3-0.5-0.5-0.7c-0.2-0.2-0.4-0.4-0.6-0.6l22.8,12.4c0.2,0.2,0.4,0.3,0.6,0.6
						C81.1,28.5,81.3,28.7,81.4,29"></path></g></g></g></g><g><g><defs><path id="SVGID_75_" d="M0.9,118.8l22.8,12.4c0,0.3,0.1,0.7,0.2,1L1,119.8C0.9,119.4,0.9,119.1,0.9,118.8z"></path></defs><clipPath id="SVGID_76_"><use xlink:href="#SVGID_75_" style="overflow:visible;"></use></clipPath><g class="st50"><g><path class="st12" d="M23.8,132.2L1,119.8c-0.1-0.4-0.1-0.8-0.2-1.2l22.8,12.4C23.6,131.4,23.7,131.8,23.8,132.2"></path></g></g></g></g><polygon class="st25" points="96.4,75 73.6,62.6 51.9,24.9 74.7,37.3 	"></polygon><polygon class="st4" points="95.4,75.2 72.6,62.8 51.4,25.9 74.2,38.3 	"></polygon><g><g><defs><path id="SVGID_77_" d="M0.9,118.8c0-0.1,0-0.2,0-0.2l22.8,12.4v0.2L0.9,118.8z"></path></defs><clipPath id="SVGID_78_"><use xlink:href="#SVGID_77_" style="overflow:visible;"></use></clipPath><g class="st51"><g><path class="st12" d="M23.8,132.2L1,119.8c-0.1-0.4-0.1-0.8-0.2-1.2l22.8,12.4C23.6,131.4,23.7,131.8,23.8,132.2"></path></g></g></g></g><g><g><defs><path id="SVGID_79_" d="M57.1,15l22.8,12.4c0.2,0.1,0.3,0.2,0.5,0.3L57.6,15.3C57.4,15.2,57.3,15.1,57.1,15z"></path></defs><clipPath id="SVGID_80_"><use xlink:href="#SVGID_79_" style="overflow:visible;"></use></clipPath><g class="st52"><g><path class="st1" d="M80.4,27.7L57.6,15.3c-0.2-0.1-0.3-0.2-0.5-0.3l22.8,12.4C80,27.5,80.2,27.6,80.4,27.7"></path></g></g></g></g><g><g><defs><path id="SVGID_81_" d="M57.6,14.1l22.8,12.4l-0.2-0.1L57.3,14C57.4,14.1,57.5,14.1,57.6,14.1z"></path></defs><clipPath id="SVGID_82_"><use xlink:href="#SVGID_81_" style="overflow:visible;"></use></clipPath><g class="st53"><g><path class="st1" d="M80.1,26.4L57.3,14c0.1,0,0.2,0.1,0.2,0.1l22.8,12.4L80.1,26.4"></path></g></g></g></g><g><g><defs><polygon id="SVGID_83_" points="56.9,14.9 57.1,15 79.9,27.4 79.7,27.3 79.4,27.2 56.7,14.8 				"></polygon></defs><clipPath id="SVGID_84_"><use xlink:href="#SVGID_83_" style="overflow:visible;"></use></clipPath><g class="st54"><g><path class="st19" d="M77.3,27L54.5,14.6c0.3,0,0.6-0.1,0.8-0.1c0.3,0,0.5,0,0.8,0.1c0.2,0,0.4,0.1,0.7,0.2l22.8,12.4
						c-0.2-0.1-0.4-0.2-0.7-0.2c-0.3-0.1-0.5-0.1-0.8-0.1C77.8,26.9,77.6,27,77.3,27"></path><path class="st12" d="M79.6,27.3L56.8,14.9l0.1,0l0.2,0.1l22.8,12.4l-0.2-0.1L79.6,27.3"></path></g></g></g></g><g><g><defs><path id="SVGID_85_" d="M25.3,135.6L2.5,123.2c-0.3-0.2-0.7-0.4-0.9-0.7c-0.3-0.3-0.6-0.7-0.8-1.1c-0.2-0.4-0.4-0.9-0.5-1.3
					c-0.1-0.5-0.2-1-0.2-1.5L22.8,131c0,0.5,0.1,1,0.2,1.5c0.1,0.5,0.3,0.9,0.5,1.3c0.2,0.4,0.5,0.8,0.9,1.1
					C24.7,135.2,25,135.5,25.3,135.6z"></path></defs><clipPath id="SVGID_86_"><use xlink:href="#SVGID_85_" style="overflow:visible;"></use></clipPath><g class="st55"><g><path class="st1" d="M25.3,135.6L2.5,123.2c-0.3-0.2-0.7-0.4-0.9-0.7c-0.3-0.3-0.6-0.7-0.8-1.1c-0.2-0.4-0.4-0.9-0.5-1.3
						c-0.1-0.5-0.2-1-0.2-1.5L22.8,131c0,0.5,0.1,1,0.2,1.5c0.1,0.5,0.3,0.9,0.5,1.3c0.2,0.4,0.5,0.8,0.9,1.1
						C24.7,135.2,25,135.5,25.3,135.6"></path></g></g></g></g><g><g><defs><path id="SVGID_87_" d="M56.7,14.8c0.3,0.1,0.7,0.4,1,0.5l3.1,1.7l4.1,2.2l14.6,7.9c-0.2-0.1-0.3-0.1-0.5-0.2
					c-0.3-0.1-0.5-0.1-0.8-0.1c-0.3,0-0.5,0-0.8,0.1L54.6,14.6c0.3,0,0.6-0.1,0.8-0.1c0.3,0,0.5,0,0.8,0.1
					C56.4,14.7,56.5,14.7,56.7,14.8z"></path></defs><clipPath id="SVGID_88_"><use xlink:href="#SVGID_87_" style="overflow:visible;"></use></clipPath><g class="st56"><g><path class="st19" d="M77.3,27L54.5,14.6c0.3,0,0.6-0.1,0.8-0.1c0.3,0,0.5,0,0.8,0.1c0.2,0,0.4,0.1,0.7,0.2l22.8,12.4
						c-0.2-0.1-0.4-0.2-0.7-0.2c-0.3-0.1-0.5-0.1-0.8-0.1C77.8,26.9,77.6,27,77.3,27"></path></g></g></g></g><g><g><defs><path id="SVGID_89_" d="M77.3,26.1L54.5,13.7c0.3-0.1,0.7-0.1,1-0.1c0.3,0,0.7,0.1,1,0.1c0.3,0.1,0.6,0.2,0.9,0.3l22.8,12.4
					c-0.3-0.1-0.6-0.2-0.9-0.3c-0.3-0.1-0.7-0.1-1-0.1C77.9,26,77.6,26,77.3,26.1z"></path></defs><clipPath id="SVGID_90_"><use xlink:href="#SVGID_89_" style="overflow:visible;"></use></clipPath><g class="st57"><g><path class="st3" d="M77.3,26.1L54.5,13.7c0.3-0.1,0.7-0.1,1-0.1c0.3,0,0.7,0.1,1,0.1c0.3,0.1,0.5,0.1,0.7,0.2L80,26.4
						c-0.2-0.1-0.5-0.2-0.8-0.2c-0.3-0.1-0.7-0.1-1-0.1C77.9,26,77.6,26,77.3,26.1"></path><path class="st1" d="M80,26.4L57.2,14l0.2,0.1l22.8,12.4L80,26.4"></path></g></g></g></g><polygon class="st5" points="32.9,43.1 10.1,30.8 51.9,24.9 74.7,37.3 	"></polygon><polygon class="st4" points="32.7,124.8 9.9,112.4 10.1,30.8 32.9,43.1 	"></polygon><polygon class="st9" points="28.4,33.9 5.6,21.5 54.5,14.6 77.3,27 	"></polygon><g><g><defs><path id="SVGID_91_" d="M4.4,21.9c0.4-0.2,0.8-0.3,1.2-0.4l22.8,12.4c-0.4,0.1-0.8,0.2-1.2,0.3L4.4,21.9z"></path></defs><clipPath id="SVGID_92_"><use xlink:href="#SVGID_91_" style="overflow:visible;"></use></clipPath><g class="st58"><g><path class="st19" d="M26.5,34.6L3.7,22.2c0.2-0.2,0.5-0.3,0.7-0.4c0.4-0.2,0.8-0.3,1.2-0.3l22.8,12.4
						C27.7,34,27.1,34.2,26.5,34.6"></path></g></g></g></g><polygon class="st10" points="23.7,130.9 0.9,118.5 1.1,27 23.9,39.4 	"></polygon><g><g><defs><polygon id="SVGID_93_" points="1.1,26.9 23.9,39.3 23.9,39.4 1.1,27 				"></polygon></defs><clipPath id="SVGID_94_"><use xlink:href="#SVGID_93_" style="overflow:visible;"></use></clipPath><g class="st59"><g><path class="st12" d="M23.9,39.4L1.1,27c0-0.4,0.1-0.9,0.2-1.3c0.1-0.4,0.2-0.8,0.4-1.2c0.2-0.4,0.4-0.8,0.7-1.1
						C2.6,23,3,22.7,3.3,22.5l0.4-0.2l22.8,12.4c-0.1,0.1-0.2,0.2-0.4,0.3c-0.3,0.3-0.7,0.6-0.9,0.9c-0.3,0.3-0.5,0.7-0.7,1.1
						c-0.2,0.4-0.4,0.8-0.5,1.2C23.9,38.5,23.9,39,23.9,39.4"></path></g></g></g></g><g><g><defs><path id="SVGID_95_" d="M3.3,22.5C3.7,22.2,4,22,4.4,21.8l22.8,12.4c-0.4,0.2-0.8,0.4-1.1,0.6c-0.3,0.2-0.6,0.5-0.8,0.8
					c-7.6-4.1-15.2-8.3-22.8-12.4C2.8,22.9,3,22.7,3.3,22.5z"></path></defs><clipPath id="SVGID_96_"><use xlink:href="#SVGID_95_" style="overflow:visible;"></use></clipPath><g class="st60"><g><path class="st12" d="M23.9,39.4L1.1,27c0-0.4,0.1-0.9,0.2-1.3c0.1-0.4,0.2-0.8,0.4-1.2c0.2-0.4,0.4-0.8,0.7-1.1
						C2.6,23,3,22.7,3.3,22.5l0.4-0.2l22.8,12.4c-0.1,0.1-0.2,0.2-0.4,0.3c-0.3,0.3-0.7,0.6-0.9,0.9c-0.3,0.3-0.5,0.7-0.7,1.1
						c-0.2,0.4-0.4,0.8-0.5,1.2C23.9,38.5,23.9,39,23.9,39.4"></path><path class="st19" d="M26.5,34.6L3.7,22.2c0.2-0.2,0.5-0.3,0.7-0.4c0.4-0.2,0.8-0.3,1.2-0.3l22.8,12.4
						C27.7,34,27.1,34.2,26.5,34.6"></path></g></g></g></g><g><g><defs><path id="SVGID_97_" d="M1.7,24.6L24.4,37c-0.2,0.4-0.3,0.8-0.4,1.2c-0.1,0.4-0.1,0.8-0.2,1.2L1.1,26.9
					C1.1,26.1,1.3,25.3,1.7,24.6z"></path></defs><clipPath id="SVGID_98_"><use xlink:href="#SVGID_97_" style="overflow:visible;"></use></clipPath><g class="st61"><g><path class="st12" d="M23.9,39.4L1.1,27c0-0.4,0.1-0.9,0.2-1.3c0.1-0.4,0.2-0.8,0.4-1.2c0.2-0.4,0.4-0.8,0.7-1.1
						C2.6,23,3,22.7,3.3,22.5l0.4-0.2l22.8,12.4c-0.1,0.1-0.2,0.2-0.4,0.3c-0.3,0.3-0.7,0.6-0.9,0.9c-0.3,0.3-0.5,0.7-0.7,1.1
						c-0.2,0.4-0.4,0.8-0.5,1.2C23.9,38.5,23.9,39,23.9,39.4"></path></g></g></g></g><g><g><defs><path id="SVGID_99_" d="M2.5,23.2c7.6,4.1,15.2,8.3,22.8,12.4l-0.1,0.2c-0.2,0.2-0.3,0.5-0.5,0.7L9.4,28.2l-2-1.1L5.4,26
					l-0.5-0.3l-1.5-0.8l-0.5-0.3l-0.5-0.2c-0.1-0.1-0.3-0.2-0.5-0.2c0.2-0.2,0.3-0.5,0.5-0.7L2.5,23.2z"></path></defs><clipPath id="SVGID_100_"><use xlink:href="#SVGID_99_" style="overflow:visible;"></use></clipPath><g class="st62"><g><path class="st12" d="M23.9,39.4L1.1,27c0-0.4,0.1-0.9,0.2-1.3c0.1-0.4,0.2-0.8,0.4-1.2c0.2-0.4,0.4-0.8,0.7-1.1
						C2.6,23,3,22.7,3.3,22.5l0.4-0.2l22.8,12.4c-0.1,0.1-0.2,0.2-0.4,0.3c-0.3,0.3-0.7,0.6-0.9,0.9c-0.3,0.3-0.5,0.7-0.7,1.1
						c-0.2,0.4-0.4,0.8-0.5,1.2C23.9,38.5,23.9,39,23.9,39.4"></path></g></g></g></g><g><g><defs><polygon id="SVGID_101_" points="1.7,24.6 1.7,24.5 24.5,36.9 24.5,36.9 				"></polygon></defs><clipPath id="SVGID_102_"><use xlink:href="#SVGID_101_" style="overflow:visible;"></use></clipPath><g class="st63"><g><path class="st12" d="M23.9,39.4L1.1,27c0-0.4,0.1-0.9,0.2-1.3c0.1-0.4,0.2-0.8,0.4-1.2c0.2-0.4,0.4-0.8,0.7-1.1
						C2.6,23,3,22.7,3.3,22.5l0.4-0.2l22.8,12.4c-0.1,0.1-0.2,0.2-0.4,0.3c-0.3,0.3-0.7,0.6-0.9,0.9c-0.3,0.3-0.5,0.7-0.7,1.1
						c-0.2,0.4-0.4,0.8-0.5,1.2C23.9,38.5,23.9,39,23.9,39.4"></path></g></g></g></g><g><g><defs><path id="SVGID_103_" d="M1.9,24.1l22.8,12.4c-0.1,0.1-0.2,0.3-0.2,0.4l0,0L1.7,24.5l0,0C1.8,24.3,1.8,24.2,1.9,24.1z"></path></defs><clipPath id="SVGID_104_"><use xlink:href="#SVGID_103_" style="overflow:visible;"></use></clipPath><g class="st64"><g><path class="st12" d="M23.9,39.4L1.1,27c0-0.4,0.1-0.9,0.2-1.3c0.1-0.4,0.2-0.8,0.4-1.2c0.2-0.4,0.4-0.8,0.7-1.1
						C2.6,23,3,22.7,3.3,22.5l0.4-0.2l22.8,12.4c-0.1,0.1-0.2,0.2-0.4,0.3c-0.3,0.3-0.7,0.6-0.9,0.9c-0.3,0.3-0.5,0.7-0.7,1.1
						c-0.2,0.4-0.4,0.8-0.5,1.2C23.9,38.5,23.9,39,23.9,39.4"></path></g></g></g></g><path class="st29" d="M180.3,17.5l0.2,45.7l-0.3,45.8c0,0.5-0.1,1-0.2,1.5c-0.1,0.5-0.3,1-0.5,1.4c-0.2,0.5-0.5,0.9-0.8,1.3
		c-0.3,0.4-0.7,0.7-1.1,1.1c-0.4,0.3-0.8,0.6-1.2,0.8c-0.4,0.2-0.9,0.4-1.4,0.4l-48.9,6.9c-0.3,0-0.7,0.1-1,0.1c-0.3,0-0.7,0-1-0.1
		c-0.3-0.1-0.6-0.2-0.9-0.3c-0.3-0.1-0.6-0.3-0.8-0.5c-0.3-0.2-0.5-0.4-0.7-0.7c-0.2-0.2-0.4-0.5-0.6-0.8L101.7,86L82,125.7
		c-0.2,0.3-0.3,0.6-0.5,0.9c-0.2,0.3-0.4,0.6-0.7,0.8c-0.2,0.2-0.5,0.5-0.8,0.7c-0.3,0.2-0.6,0.4-0.9,0.6c-0.3,0.2-0.6,0.3-0.9,0.4
		c-0.3,0.1-0.7,0.2-1,0.2l-49.1,6.9c-0.5,0.1-0.9,0.1-1.4,0c-1.4-0.2-2.6-1.1-3.3-2.3c-0.2-0.4-0.4-0.9-0.5-1.3
		c-0.1-0.5-0.2-1-0.2-1.5L23,39.5c0-0.5,0.1-1,0.2-1.5c0.1-0.5,0.3-1,0.5-1.5c0.2-0.5,0.5-0.9,0.9-1.3c0.3-0.4,0.7-0.8,1.1-1.1
		c0.4-0.3,0.8-0.6,1.3-0.8c0.4-0.2,0.9-0.3,1.4-0.4l48.9-6.9c0.3-0.1,0.7-0.1,1-0.1c0.3,0,0.7,0,1,0.1c0.3,0.1,0.6,0.2,0.9,0.3
		c0.3,0.1,0.6,0.3,0.8,0.5c0.3,0.2,0.5,0.4,0.7,0.7c0.2,0.3,0.4,0.5,0.6,0.8l19.4,34.2l19.6-39.7c0.2-0.3,0.3-0.6,0.6-0.9
		c0.2-0.3,0.4-0.6,0.7-0.8c0.2-0.2,0.5-0.5,0.8-0.7c0.3-0.2,0.6-0.4,0.9-0.6c0.3-0.2,0.6-0.3,0.9-0.4c0.3-0.1,0.6-0.2,0.8-0.2
		l49-6.9c0.5-0.1,0.9-0.1,1.4,0c0.5,0.1,0.9,0.2,1.3,0.4c0.8,0.4,1.5,1.1,2,1.9c0.2,0.4,0.4,0.9,0.5,1.3
		C180.3,16.5,180.3,17,180.3,17.5z M179.2,109.2l0.3-45.8l-0.2-45.7c0-0.4,0-0.8-0.1-1.2c-0.1-0.4-0.3-0.8-0.5-1.1
		c-0.2-0.3-0.4-0.6-0.7-0.9c-0.3-0.3-0.6-0.5-0.9-0.6c-0.3-0.2-0.7-0.3-1.1-0.3c-0.4-0.1-0.8-0.1-1.2,0L126,20.3
		c-0.3,0-0.5,0.1-0.8,0.2c-0.3,0.1-0.5,0.2-0.8,0.3c-0.3,0.1-0.5,0.3-0.7,0.5c-0.2,0.2-0.5,0.4-0.6,0.6c-0.2,0.2-0.4,0.4-0.6,0.7
		c-0.2,0.2-0.3,0.5-0.4,0.8l-20.4,41.2L81.4,29c-0.1-0.2-0.3-0.5-0.5-0.7c-0.2-0.2-0.4-0.4-0.6-0.6c-0.2-0.2-0.4-0.3-0.7-0.4
		c-0.2-0.1-0.5-0.2-0.8-0.3c-0.3-0.1-0.5-0.1-0.8-0.1c-0.2,0-0.5,0-0.7,0l-49,6.9c-0.4,0.1-0.8,0.2-1.2,0.3
		c-0.4,0.2-0.8,0.4-1.1,0.6c-0.3,0.3-0.7,0.6-0.9,0.9c-0.3,0.4-0.5,0.7-0.7,1.1c-0.2,0.4-0.4,0.8-0.5,1.2c-0.1,0.4-0.2,0.9-0.2,1.3
		l-0.2,91.5c0,0.4,0,0.8,0.2,1.2c0.2,0.8,0.6,1.5,1.2,2c0.3,0.3,0.6,0.5,0.9,0.6c0.3,0.2,0.7,0.3,1.1,0.3c0.4,0.1,0.8,0.1,1.2,0
		l49.1-6.9c0.3,0,0.5-0.1,0.8-0.2c0.3-0.1,0.5-0.2,0.8-0.3c0.2-0.1,0.5-0.3,0.7-0.5c0.2-0.2,0.5-0.4,0.7-0.6
		c0.2-0.2,0.4-0.4,0.6-0.7c0.2-0.2,0.3-0.5,0.5-0.8l20.5-41.2l20.2,35.5c0.1,0.2,0.3,0.5,0.5,0.7c0.2,0.2,0.4,0.4,0.6,0.5
		c0.2,0.2,0.4,0.3,0.7,0.4c0.2,0.1,0.5,0.2,0.8,0.2c0.3,0.1,0.5,0.1,0.8,0.1c0.2,0,0.5,0,0.7-0.1l49-6.9c0.4-0.1,0.8-0.2,1.1-0.4
		c0.4-0.2,0.7-0.4,1-0.7c0.3-0.3,0.6-0.6,0.9-0.9c0.3-0.3,0.5-0.7,0.7-1.1c0.2-0.4,0.3-0.8,0.5-1.2
		C179.1,110,179.2,109.6,179.2,109.2"></path><path class="st29" d="M32.9,43.1l41.8-5.9L96.4,75l-21.9,43.9l-41.8,5.9L32.9,43.1z M74,118l21.4-42.8L74.2,38.3L33.8,44l-0.1,79.7
		L74,118"></path><polygon class="st5" points="28.4,32.9 5.6,20.5 54.5,13.7 77.3,26.1 	"></polygon><path class="st65" d="M179.4,17.7l0.2,45.7l-0.3,45.8c0,0.4-0.1,0.8-0.2,1.2c-0.1,0.4-0.3,0.8-0.4,1.2c-0.2,0.4-0.4,0.7-0.7,1.1
		c-0.3,0.3-0.6,0.6-0.9,0.9c-0.3,0.3-0.6,0.5-1,0.7c-0.4,0.2-0.7,0.3-1.1,0.4l-48.9,6.9c-0.3,0-0.6,0.1-0.8,0.1
		c-0.3,0-0.5,0-0.8-0.1c-0.3-0.1-0.5-0.1-0.8-0.2c-0.2-0.1-0.5-0.2-0.7-0.4c-0.2-0.2-0.4-0.3-0.6-0.5c-0.2-0.2-0.3-0.4-0.5-0.7
		l-20.2-35.5l-20.4,41.2c-0.1,0.3-0.3,0.5-0.5,0.8c-0.2,0.2-0.4,0.5-0.6,0.7c-0.2,0.2-0.4,0.4-0.7,0.6c-0.2,0.2-0.5,0.3-0.7,0.5
		c-0.2,0.1-0.5,0.2-0.8,0.3c-0.3,0.1-0.5,0.1-0.8,0.2l-49.1,6.9c-0.4,0.1-0.8,0.1-1.2,0c-0.4-0.1-0.8-0.2-1.1-0.3
		c-0.3-0.2-0.7-0.4-0.9-0.6c-0.6-0.5-1-1.2-1.2-2c-0.1-0.4-0.2-0.8-0.2-1.2l0.2-91.5c0-0.4,0.1-0.9,0.2-1.3c0.1-0.5,0.3-0.9,0.5-1.3
		c0.2-0.4,0.4-0.8,0.7-1.1c0.3-0.3,0.6-0.6,0.9-0.9c0.3-0.3,0.7-0.5,1.1-0.6c0.4-0.2,0.8-0.3,1.2-0.3L77.3,27c0.3,0,0.5-0.1,0.8-0.1
		c0.3,0,0.5,0,0.8,0.1c0.3,0.1,0.5,0.2,0.8,0.3c0.2,0.1,0.5,0.3,0.7,0.4c0.2,0.2,0.4,0.3,0.6,0.6c0.2,0.2,0.3,0.4,0.5,0.7l20.2,35.5
		L122,23.3c0.1-0.3,0.3-0.5,0.4-0.8c0.2-0.2,0.4-0.5,0.6-0.7c0.2-0.2,0.4-0.4,0.6-0.6c0.2-0.2,0.5-0.3,0.7-0.5
		c0.2-0.1,0.5-0.2,0.8-0.3c0.3-0.1,0.5-0.1,0.8-0.2l48.9-6.9c0.4-0.1,0.8-0.1,1.2,0c0.4,0,0.7,0.2,1.1,0.3c0.3,0.2,0.7,0.4,0.9,0.6
		c0.3,0.3,0.5,0.6,0.7,0.9c0.2,0.4,0.3,0.7,0.4,1.1C179.3,16.8,179.4,17.2,179.4,17.7z M170.4,105.4l0.1-81.6l-41.8,5.9l-21.9,43.9
		l21.8,37.7L170.4,105.4 M74.5,118.9L96.4,75L74.7,37.3l-41.8,5.9l-0.2,81.6L74.5,118.9"></path><polygon class="st4" points="22.8,131 0,118.6 0.2,27.1 23,39.5 	"></polygon><g><g><defs><path id="SVGID_105_" d="M23,39.5L0.2,27.1c0-0.5,0.1-1,0.2-1.5c0.1-0.5,0.3-1,0.5-1.5c0.2-0.5,0.5-0.9,0.9-1.3
					c0.3-0.4,0.7-0.8,1.1-1.1c0.4-0.3,0.8-0.6,1.3-0.8c0.4-0.2,0.9-0.3,1.4-0.4l22.8,12.4c-0.5,0.1-1,0.2-1.4,0.4
					c-0.5,0.2-0.9,0.5-1.3,0.8c-0.4,0.3-0.8,0.7-1.1,1.1c-0.3,0.4-0.6,0.9-0.9,1.3c-0.2,0.5-0.4,1-0.5,1.5C23,38.5,23,39,23,39.5z"></path></defs><clipPath id="SVGID_106_"><use xlink:href="#SVGID_105_" style="overflow:visible;"></use></clipPath><g class="st66"><g><path class="st1" d="M23,39.5L0.2,27.1c0-0.5,0.1-1,0.2-1.5c0.1-0.5,0.3-1,0.5-1.5c0.2-0.5,0.5-0.9,0.9-1.3
						c0.3-0.4,0.7-0.8,1.1-1.1l0.4-0.3l22.8,12.4c-0.1,0.1-0.3,0.2-0.4,0.3c-0.4,0.3-0.8,0.7-1.1,1.1c-0.3,0.4-0.6,0.9-0.9,1.3
						c-0.2,0.5-0.4,1-0.5,1.5C23,38.5,23,39,23,39.5"></path><path class="st3" d="M26.1,33.8L3.3,21.4c0.3-0.2,0.6-0.3,0.9-0.5c0.4-0.2,0.9-0.3,1.4-0.4l22.8,12.4c-0.5,0.1-1,0.2-1.4,0.4
						C26.7,33.5,26.4,33.6,26.1,33.8"></path></g></g></g></g></g><g filter=""><path class="st67" d="M77.4,59.5l-26.3,3.7l-0.1,15.2l23.2-3.3v11.6l-23.3,3.3v11.9l26.3-3.7v11.6l-38.2,5.4l0.1-61.8l38.2-5.4
		L77.4,59.5z M73,76.7L49.7,80l0.1-18.1l26.3-3.7v-8.6l-35.4,5l-0.1,58.9l35.5-5v-8.7l-26.3,3.7V88.7L73,85.4L73,76.7"></path><polygon class="st68" points="76.1,49.5 76.1,58.2 49.8,61.9 49.7,80 73,76.7 72.9,85.4 49.7,88.7 49.8,103.4 76,99.8 76,108.4 
		40.5,113.4 40.6,54.5 	"></polygon></g><g filter=""><path class="st69" d="M133.1,58.5c-0.3-4.3,2.9-8.1,7.2-8.5l14.3-2v19l-14.3,2c-1.8,0.4-3.8-0.1-5.2-1.2c-1.3-1.1-2-2.9-2-5.3V58.5
		z M136,53.6c-1.1,1.3-1.6,3-1.5,4.7v4c-0.2,1.6,0.4,3.2,1.5,4.3c1.2,1,2.8,1.3,4.3,1l13-1.8V49.7l-13,1.8
		C138.7,51.7,137.2,52.4,136,53.6"></path><path class="st69" d="M139.4,40.2l25.8-3.6l-0.1,61.8l-11.9,1.7V77L139.3,79c-2.4,0.4-4.8,0.3-7.2-0.4c-2.1-0.6-4-1.7-5.5-3.2
		c-1.6-1.6-2.7-3.5-3.4-5.7c-0.8-2.5-1.2-5.1-1.1-7.7c0-2.7,0.4-5.4,1.2-8c0.7-2.4,1.9-4.7,3.4-6.7c1.5-1.9,3.4-3.5,5.5-4.8
		C134.4,41.3,136.9,40.5,139.4,40.2z M163.8,97.1l0.1-58.9l-24.5,3.4c-2.3,0.3-4.6,1.1-6.7,2.2c-1.9,1.1-3.6,2.6-5,4.3
		c-1.4,1.8-2.5,3.9-3.1,6.1c-0.7,2.4-1.1,5-1.1,7.5c0,2.5,0.3,4.9,1.1,7.3c0.6,1.9,1.7,3.7,3.1,5.2c1.4,1.4,3.1,2.4,5,2.9
		c2.2,0.6,4.5,0.7,6.7,0.3l15.2-2.1v23L163.8,97.1"></path><path class="st70" d="M139.4,41.6l24.5-3.4l-0.1,58.9l-9.2,1.3v-23l-15.2,2.1c-2.2,0.4-4.5,0.2-6.7-0.3c-1.9-0.5-3.6-1.5-5-2.9
		c-1.4-1.5-2.5-3.2-3.1-5.2c-0.7-2.3-1.1-4.8-1.1-7.3c0-2.5,0.4-5.1,1.1-7.5c0.7-2.2,1.7-4.3,3.1-6.1c1.4-1.8,3.1-3.2,5-4.3
		C134.7,42.7,137,41.9,139.4,41.6z M154.6,67V48l-14.3,2c-4.3,0.4-7.5,4.2-7.2,8.5v4c0,2.4,0.7,4.2,2,5.3c1.5,1.2,3.4,1.6,5.2,1.2
		L154.6,67"></path></g></svg>`;
});
const DescriptionList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { isPlaying = false } = $$props;
  if ($$props.isPlaying === void 0 && $$bindings.isPlaying && isPlaying !== void 0)
    $$bindings.isPlaying(isPlaying);
  return `<dl class="flex-initial list-dl text-sm mr-2 "><div><span class="p-0 -ml-20 -mt-4"><h2>${escape(isPlaying ? "Now Playing." : "")}</h2></span>
		<span>${isPlaying ? `<dt class="text-left uppercase"><span class="badge align-middle">${validate_component(Icon, "Icon").$$render($$result, { src: Cube, class: "h-4 rotate-180 " }, {}, {})}</span> 
		${slots.Title ? slots.Title({}) : ``}</dt>

			<dd class="text-left text-tertiary-600 "><span class="badge align-middle">${validate_component(Icon, "Icon").$$render($$result, { src: Cube, class: "h-4" }, {}, {})}</span>
		${slots.Description ? slots.Description({}) : ``}</dd>` : ``}</span></div></dl>`;
});
const NowPlaying = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isPlaying;
  let currentTrack;
  let $Playlist, $$unsubscribe_Playlist;
  let $audioStatus, $$unsubscribe_audioStatus;
  $$unsubscribe_Playlist = subscribe(Playlist, (value) => $Playlist = value);
  const { audioStatus } = Audio.stores;
  $$unsubscribe_audioStatus = subscribe(audioStatus, (value) => $audioStatus = value);
  isPlaying = $audioStatus === "playing";
  currentTrack = $Playlist.currentTrack.name;
  $$unsubscribe_Playlist();
  $$unsubscribe_audioStatus();
  return `${Audio.audioBuffersReady ? `${validate_component(DescriptionList, "DescriptionList").$$render($$result, { isPlaying }, {}, {
    Description: () => {
      return `<span slot="Description">${escape(isPlaying ? "taken from the mindblowing new album." : "")}</span>`;
    },
    Title: () => {
      return `<span slot="Title">${isPlaying ? `${escape(currentTrack)}` : ``}</span>`;
    }
  })}` : ``}`;
});
const FolderScan = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let fileNames = [];
  return `

  <div class="flex items-center"><div class="mr-1">${validate_component(Icon, "Icon").$$render($$result, { src: Layers, class: "h-4 rotate-270" }, {}, {})}</div> 
  <div class="text-sm"><p>Virtual File System.</p></div></div>
  <ul>${each(fileNames, (fileName) => {
    return `<li class="ml-1">${escape(fileName)}</li>`;
  })}</ul>`;
});
const sourceURL_prefix = get_store_value(VFS_PATH_PREFIX) + "speech/";
let playlist;
const unsubscribe = PlaylistVoice.subscribe((container) => {
  playlist = ["test.mp3"];
});
const target = (entry, i) => `${sourceURL_prefix}${entry}`;
async function load({ fetch: fetch2 }) {
  let responses = [];
  let rawAudioBuffers = [];
  for (let i = 0; i < playlist.length; i++) {
    const entry = playlist[i];
    const loadFrom = target(entry);
    console.log("Fetching ", loadFrom);
    const stopwatch = Date.now();
    responses.push(await fetch2(loadFrom));
    console.log(" in ", Date.now() - stopwatch, "ms");
  }
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];
    const rawArrayBuffer = async () => {
      return await response.arrayBuffer();
    };
    if (response.ok) {
      const structuredAudioBuffer = {
        header: {
          name: playlist[i],
          bytes: 0,
          vfsPath: sourceURL_prefix + playlist[i]
        },
        body: rawArrayBuffer()
      };
      const wrap = async () => {
        return structuredAudioBuffer;
      };
      rawAudioBuffers.push(wrap());
    } else {
      console.log("ArrayBuffer fetch failed 😿");
      throw error(404);
    }
  }
  unsubscribe();
  return { buffers: rawAudioBuffers };
}
class VoiceCore extends AudioCore {
  #voiceCore;
  #silentVoiceCore;
  _voiceCoreStatus;
  _currentVFSPath;
  _currentChapterID;
  _currentChapterDurationSeconds;
  _scrubbing;
  _currentChapterName;
  constructor() {
    super();
    this.#voiceCore = this.#silentVoiceCore = null;
    this._voiceCoreStatus = writable("loading");
    this._endNodes = writable({
      mainCore: null,
      silentCore: null
    });
    this._currentVFSPath = "";
    this._currentChapterID = "";
    this._currentChapterName = "";
    this._currentChapterDurationSeconds = 0;
    this._scrubbing = false;
  }
  subscribeToStores() {
  }
  async init() {
    VoiceOver.#voiceCore = new WebRenderer();
    VoiceOver.#silentVoiceCore = new WebRenderer();
    VoiceOver.subscribeToStores();
    load({ fetch }).then((buffersContainer) => {
      console.log("speech buffers", buffersContainer);
      this.parallelDecoder(buffersContainer.buffers);
    });
    while (!super.actx) {
      console.log("Waiting for first WebRenderer instance to load...");
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    VoiceOver.voiceEndNode = await VoiceOver.#voiceCore.initialize(super.actx, {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    }).then((node) => {
      return node;
    });
    VoiceOver.silentVoiceEndNode = await VoiceOver.#silentVoiceCore.initialize(super.actx, {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    }).then((node) => {
      console.log("Silent Voice Core loaded  🎤");
      return node;
    });
    VoiceOver.#voiceCore.on("error", function(e) {
      console.error("🔇 ", e);
    });
    VoiceOver.#silentVoiceCore.on("error", function(e) {
      console.error("🔇 ", e);
    });
    VoiceOver.#voiceCore.on("load", () => {
      console.log("Voice Core loaded  🎤");
      VoiceOver.status = "ready";
      VoiceOver.resumeContext();
    });
    super.connectToDestination(VoiceOver.voiceEndNode);
  }
  async updateVFS(rawAudioBuffer) {
    let vfsDictionaryEntry;
    this.decodeRawBuffer(rawAudioBuffer).then(([decoded, vfsPath]) => {
      if (!decoded) {
        console.warn("Decoding skipped.");
        return;
      }
      for (let i = 0; i < decoded.numberOfChannels; i++) {
        vfsDictionaryEntry = {
          ...vfsDictionaryEntry,
          [`${vfsPath}${channelExtensionFor(i + 1)}`]: decoded.getChannelData(i)
        };
      }
      console.log("vfsDictionaryEntry VOICE ->", vfsDictionaryEntry);
      VoiceOver.#voiceCore?.updateVirtualFileSystem(vfsDictionaryEntry);
    });
  }
  async decodeRawBuffer(rawAudioBuffer) {
    const stopwatch = Date.now();
    while (!rawAudioBuffer)
      await new Promise((resolve) => setTimeout(resolve, 100));
    const { body, header } = rawAudioBuffer;
    let decoded = null;
    while (!super.actx || !body) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    try {
      decoded = await super.actx.decodeAudioData(body);
    } catch (error2) {
      console.log(new Error("Decoding skipped. Dummy buffer created."));
      decoded = super.actx?.createBuffer(1, 1, 44100);
    } finally {
      const { vfsPath } = header;
      const bytes = decoded?.getChannelData(0).length;
      header.bytes = bytes || 0;
      console.log(
        "Decoded audio with length ",
        bytes,
        " to ",
        vfsPath,
        " in ",
        Date.now() - stopwatch,
        "ms"
      );
      Decoding.update(($d) => {
        $d.done = true;
        return $d;
      });
    }
    if (decoded && decoded.duration > 1) {
      PlaylistVoice.update(($plist) => {
        if (!decoded)
          return $plist;
        $plist.durations.set(header.name, decoded.duration);
        return $plist;
      });
    }
    return [decoded, header.vfsPath];
  }
  // trying this here
  parallelDecoder(buffers) {
    let parallel = [];
    Promise.all(buffers).then((_buffers) => {
      for (let i = 0; i < _buffers.length; i++) {
        const track = _buffers[i];
        parallel.push(async () => {
          const decoded = await track.body;
          return VoiceOver.updateVFS({
            header: track.header,
            body: decoded
          });
        });
      }
      Promise.all(parallel.map((func) => func())).then((tracks) => {
        console.log("All ", tracks.length, " SPEECH tracks decoded 🤷🏽 ", _buffers);
        if (!VoiceOver._currentChapterName || VoiceOver._currentChapterName === "") {
          VoiceOver._currentChapterName = _buffers[0].header.name;
          VoiceOver._currentVFSPath = _buffers[0].header.vfsPath;
        }
      });
    });
  }
  // testing
  playFromVFS() {
    const test = VoiceOver._currentVFSPath + ".channel.1";
    VoiceOver.render({
      left: el.sample({ path: test, mode: "trigger" }, 1, 1),
      right: el.sample({ path: test, mode: "trigger" }, 1, 1)
    });
  }
  render(stereoSignal) {
    if (!VoiceOver.#voiceCore || !stereoSignal)
      return;
    VoiceOver.status = "playing";
    const final = stereoOut(stereoSignal);
    VoiceOver.#voiceCore.render(final.left, final.right);
  }
  /*---- getters --------------------------------*/
  get voiceEndNode() {
    return get_store_value(this._endNodes).mainCore;
  }
  /*---- setters --------------------------------*/
  set status(status) {
    this._voiceCoreStatus.update((s) => {
      return status;
    });
  }
  set voiceEndNode(node) {
    this._endNodes.update((endNodes) => {
      endNodes.mainCore = node;
      return endNodes;
    });
  }
  set silentVoiceEndNode(node) {
    this._endNodes.update((endNodes) => {
      endNodes.silentCore = node;
      return endNodes;
    });
  }
}
const VoiceOver = new VoiceCore();
const ElevenLabsLogo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { width = "70%", fill = "#fbfbfb", stroke = "#f1f1f1", transX = "0" } = $$props;
  const viewbox = `0 0 1077 175`;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  if ($$props.stroke === void 0 && $$bindings.stroke && stroke !== void 0)
    $$bindings.stroke(stroke);
  if ($$props.transX === void 0 && $$bindings.transX && transX !== void 0)
    $$bindings.transX(transX);
  return `<svg${add_attribute("width", width, 0)} height="100%"${add_attribute("viewBox", viewbox, 0)} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"${add_attribute("transform", `translate( ${transX} 0)`, 0)}><g transform="matrix(1.04145,0,0,0.527585,-22.3416,-14.3408)"><rect id="Artboard1" x="21.452" y="27.182" width="1033.31" height="330.863" style="fill:none;"></rect><g id="Artboard11"><g transform="matrix(3.89773,0,0,7.69413,-107.932,-447.96)"><g transform="matrix(43.5916,0,0,43.5916,37.4478,98.2806)"><rect x="0.05" y="-0.727" width="0.196" height="0.727" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></rect></g><g transform="matrix(43.5916,0,0,43.5916,47.7885,98.2806)"><rect x="0.05" y="-0.727" width="0.196" height="0.727" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></rect></g><g transform="matrix(43.5916,0,0,43.5916,58.1291,98.2806)"><path d="M0.047,-0L0.047,-0.727L0.571,-0.727L0.571,-0.568L0.244,-0.568L0.244,-0.443L0.544,-0.443L0.544,-0.284L0.244,-0.284L0.244,-0.159L0.57,-0.159L0.57,-0L0.047,-0Z" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></path></g><g transform="matrix(43.5916,0,0,43.5916,84.1974,98.2806)"><rect x="0.05" y="-0.727" width="0.196" height="0.727" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></rect></g><g transform="matrix(43.5916,0,0,43.5916,94.538,98.2806)"><path d="M0.311,0.01C0.253,0.01 0.203,-0.001 0.161,-0.024C0.119,-0.046 0.086,-0.078 0.064,-0.12C0.041,-0.162 0.03,-0.213 0.03,-0.271C0.03,-0.328 0.041,-0.377 0.064,-0.419C0.087,-0.461 0.119,-0.494 0.16,-0.517C0.202,-0.541 0.25,-0.553 0.307,-0.553C0.348,-0.553 0.385,-0.546 0.419,-0.533C0.452,-0.521 0.481,-0.502 0.504,-0.478C0.528,-0.454 0.546,-0.424 0.559,-0.39C0.572,-0.355 0.578,-0.316 0.578,-0.273L0.578,-0.227L0.091,-0.227L0.091,-0.335L0.398,-0.335C0.397,-0.351 0.394,-0.365 0.386,-0.377C0.378,-0.389 0.368,-0.398 0.355,-0.405C0.342,-0.411 0.327,-0.415 0.311,-0.415C0.295,-0.415 0.281,-0.411 0.267,-0.405C0.254,-0.398 0.244,-0.389 0.236,-0.377C0.228,-0.365 0.223,-0.351 0.223,-0.335L0.223,-0.219C0.223,-0.201 0.227,-0.186 0.234,-0.172C0.241,-0.158 0.252,-0.147 0.266,-0.14C0.279,-0.132 0.296,-0.128 0.315,-0.128C0.329,-0.128 0.341,-0.13 0.352,-0.134C0.364,-0.137 0.373,-0.143 0.381,-0.15C0.389,-0.157 0.395,-0.166 0.399,-0.176L0.578,-0.176C0.572,-0.138 0.557,-0.105 0.534,-0.078C0.511,-0.05 0.481,-0.028 0.443,-0.013C0.406,0.002 0.362,0.01 0.311,0.01Z" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></path></g><g transform="matrix(43.5916,0,0,43.5916,119.182,98.2806)"><path d="M0.599,-0.545L0.416,-0L0.189,-0L0.006,-0.545L0.212,-0.545L0.3,-0.185L0.305,-0.185L0.393,-0.545L0.599,-0.545Z" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></path></g><g transform="matrix(43.5916,0,0,43.5916,142.588,98.2806)"><path d="M0.311,0.01C0.253,0.01 0.203,-0.001 0.161,-0.024C0.119,-0.046 0.086,-0.078 0.064,-0.12C0.041,-0.162 0.03,-0.213 0.03,-0.271C0.03,-0.328 0.041,-0.377 0.064,-0.419C0.087,-0.461 0.119,-0.494 0.16,-0.517C0.202,-0.541 0.25,-0.553 0.307,-0.553C0.348,-0.553 0.385,-0.546 0.419,-0.533C0.452,-0.521 0.481,-0.502 0.504,-0.478C0.528,-0.454 0.546,-0.424 0.559,-0.39C0.572,-0.355 0.578,-0.316 0.578,-0.273L0.578,-0.227L0.091,-0.227L0.091,-0.335L0.398,-0.335C0.397,-0.351 0.394,-0.365 0.386,-0.377C0.378,-0.389 0.368,-0.398 0.355,-0.405C0.342,-0.411 0.327,-0.415 0.311,-0.415C0.295,-0.415 0.281,-0.411 0.267,-0.405C0.254,-0.398 0.244,-0.389 0.236,-0.377C0.228,-0.365 0.223,-0.351 0.223,-0.335L0.223,-0.219C0.223,-0.201 0.227,-0.186 0.234,-0.172C0.241,-0.158 0.252,-0.147 0.266,-0.14C0.279,-0.132 0.296,-0.128 0.315,-0.128C0.329,-0.128 0.341,-0.13 0.352,-0.134C0.364,-0.137 0.373,-0.143 0.381,-0.15C0.389,-0.157 0.395,-0.166 0.399,-0.176L0.578,-0.176C0.572,-0.138 0.557,-0.105 0.534,-0.078C0.511,-0.05 0.481,-0.028 0.443,-0.013C0.406,0.002 0.362,0.01 0.311,0.01Z" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></path></g><g transform="matrix(43.5916,0,0,43.5916,167.975,98.2806)"><path d="M0.246,-0.307L0.246,-0L0.05,-0L0.05,-0.545L0.236,-0.545L0.236,-0.442L0.241,-0.442C0.253,-0.476 0.274,-0.503 0.304,-0.523C0.334,-0.543 0.369,-0.553 0.409,-0.553C0.448,-0.553 0.481,-0.544 0.51,-0.526C0.538,-0.508 0.56,-0.484 0.576,-0.453C0.592,-0.423 0.6,-0.388 0.599,-0.348L0.599,-0L0.403,-0L0.403,-0.307C0.404,-0.334 0.397,-0.355 0.383,-0.37C0.369,-0.386 0.35,-0.393 0.325,-0.393C0.309,-0.393 0.295,-0.39 0.283,-0.383C0.271,-0.376 0.262,-0.366 0.256,-0.353C0.249,-0.34 0.246,-0.325 0.246,-0.307Z" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></path></g><g transform="matrix(43.5916,0,0,43.5916,193.486,98.2806)"><path d="M0.047,-0L0.047,-0.727L0.244,-0.727L0.244,-0.159L0.538,-0.159L0.538,-0L0.047,-0Z" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></path></g><g transform="matrix(43.5916,0,0,43.5916,218.006,98.2806)"><path d="M0.202,0.009C0.167,0.009 0.136,0.003 0.11,-0.009C0.083,-0.02 0.062,-0.038 0.047,-0.061C0.032,-0.085 0.024,-0.114 0.024,-0.151C0.024,-0.18 0.029,-0.206 0.039,-0.227C0.05,-0.248 0.064,-0.266 0.082,-0.279C0.1,-0.293 0.122,-0.303 0.146,-0.31C0.17,-0.317 0.196,-0.322 0.224,-0.324C0.255,-0.326 0.28,-0.329 0.298,-0.333C0.317,-0.336 0.33,-0.341 0.338,-0.347C0.347,-0.353 0.351,-0.362 0.351,-0.372L0.351,-0.374C0.351,-0.388 0.345,-0.399 0.335,-0.406C0.324,-0.414 0.31,-0.418 0.293,-0.418C0.274,-0.418 0.259,-0.414 0.247,-0.405C0.235,-0.397 0.228,-0.385 0.226,-0.368L0.045,-0.368C0.048,-0.401 0.058,-0.432 0.077,-0.46C0.096,-0.488 0.124,-0.51 0.16,-0.527C0.196,-0.544 0.241,-0.553 0.295,-0.553C0.335,-0.553 0.37,-0.548 0.401,-0.539C0.432,-0.53 0.458,-0.517 0.48,-0.501C0.502,-0.485 0.518,-0.466 0.53,-0.444C0.541,-0.422 0.547,-0.399 0.547,-0.374L0.547,-0L0.364,-0L0.364,-0.077L0.359,-0.077C0.348,-0.056 0.335,-0.04 0.32,-0.027C0.304,-0.015 0.287,-0.006 0.267,-0C0.247,0.006 0.225,0.009 0.202,0.009ZM0.266,-0.115C0.281,-0.115 0.295,-0.118 0.308,-0.124C0.321,-0.13 0.332,-0.139 0.34,-0.151C0.348,-0.163 0.352,-0.177 0.352,-0.193L0.352,-0.239C0.347,-0.237 0.342,-0.234 0.336,-0.233C0.33,-0.231 0.324,-0.229 0.317,-0.227C0.311,-0.226 0.304,-0.224 0.297,-0.223C0.289,-0.221 0.282,-0.22 0.274,-0.219C0.259,-0.216 0.247,-0.213 0.237,-0.207C0.227,-0.202 0.22,-0.195 0.216,-0.188C0.211,-0.18 0.209,-0.171 0.209,-0.162C0.209,-0.147 0.214,-0.135 0.225,-0.127C0.235,-0.119 0.249,-0.115 0.266,-0.115Z" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></path></g><g transform="matrix(43.5916,0,0,43.5916,242.589,98.2806)"><path d="M0.047,-0L0.047,-0.727L0.243,-0.727L0.243,-0.45L0.246,-0.45C0.253,-0.469 0.263,-0.486 0.277,-0.501C0.291,-0.517 0.308,-0.529 0.328,-0.539C0.348,-0.548 0.372,-0.553 0.399,-0.553C0.435,-0.553 0.469,-0.543 0.502,-0.524C0.535,-0.505 0.561,-0.474 0.581,-0.433C0.602,-0.392 0.612,-0.339 0.612,-0.273C0.612,-0.21 0.602,-0.158 0.583,-0.116C0.563,-0.075 0.537,-0.044 0.505,-0.023C0.472,-0.003 0.437,0.007 0.398,0.007C0.372,0.007 0.349,0.003 0.329,-0.006C0.309,-0.014 0.292,-0.025 0.278,-0.04C0.264,-0.055 0.253,-0.071 0.246,-0.089L0.241,-0.089L0.241,-0L0.047,-0ZM0.239,-0.273C0.239,-0.246 0.242,-0.223 0.249,-0.204C0.256,-0.185 0.266,-0.17 0.279,-0.159C0.292,-0.149 0.307,-0.143 0.325,-0.143C0.343,-0.143 0.359,-0.149 0.371,-0.159C0.384,-0.169 0.394,-0.184 0.4,-0.203C0.407,-0.223 0.411,-0.246 0.411,-0.273C0.411,-0.3 0.407,-0.323 0.4,-0.342C0.394,-0.361 0.384,-0.376 0.371,-0.387C0.359,-0.397 0.343,-0.402 0.325,-0.402C0.307,-0.402 0.292,-0.397 0.279,-0.387C0.266,-0.376 0.256,-0.361 0.249,-0.342C0.242,-0.323 0.239,-0.3 0.239,-0.273Z" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></path></g><g transform="matrix(43.5916,0,0,43.5916,269.648,98.2806)"><path d="M0.548,-0.368L0.368,-0.368C0.367,-0.379 0.363,-0.389 0.356,-0.397C0.349,-0.405 0.34,-0.411 0.33,-0.415C0.319,-0.42 0.307,-0.422 0.294,-0.422C0.277,-0.422 0.263,-0.419 0.251,-0.413C0.239,-0.406 0.233,-0.398 0.233,-0.386C0.233,-0.378 0.236,-0.371 0.243,-0.364C0.251,-0.357 0.265,-0.352 0.286,-0.348L0.396,-0.328C0.452,-0.318 0.494,-0.301 0.521,-0.277C0.548,-0.253 0.562,-0.221 0.563,-0.18C0.562,-0.142 0.551,-0.108 0.528,-0.079C0.505,-0.051 0.474,-0.029 0.434,-0.013C0.395,0.002 0.35,0.01 0.3,0.01C0.216,0.01 0.151,-0.007 0.104,-0.041C0.057,-0.075 0.031,-0.12 0.026,-0.176L0.22,-0.176C0.223,-0.159 0.231,-0.146 0.246,-0.136C0.26,-0.127 0.279,-0.122 0.301,-0.122C0.319,-0.122 0.334,-0.125 0.346,-0.131C0.357,-0.138 0.363,-0.146 0.364,-0.158C0.363,-0.168 0.358,-0.176 0.348,-0.183C0.338,-0.189 0.322,-0.194 0.301,-0.197L0.205,-0.214C0.149,-0.224 0.107,-0.243 0.08,-0.27C0.052,-0.297 0.038,-0.332 0.038,-0.375C0.038,-0.413 0.048,-0.445 0.068,-0.471C0.089,-0.498 0.118,-0.518 0.155,-0.532C0.193,-0.546 0.238,-0.553 0.29,-0.553C0.369,-0.553 0.431,-0.536 0.476,-0.504C0.522,-0.471 0.546,-0.426 0.548,-0.368Z" style="${"fill:" + escape(fill, true) + ";fill-rule:nonzero;stroke:" + escape(stroke, true) + ";stroke-width:0.01px;"}"></path></g></g></g></g></svg>`;
});
const TextToSpeech = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_VFS_PATH_PREFIX;
  $$unsubscribe_VFS_PATH_PREFIX = subscribe(VFS_PATH_PREFIX, (value) => value);
  let activated = false;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="grid grid-rows-3 grid-flow-col gap-0 p-0 mt-4 "><div>${validate_component(Icon, "Icon").$$render(
      $$result,
      {
        src: VoiceActivate,
        class: "w-9 p-1 fill-secondary-200 rounded-md "
      },
      {},
      {}
    )}</div>
    <div class="w-20 opacity-90 -mt-8">${validate_component(ElevenLabsLogo, "ElevenLabsLogo").$$render(
      $$result,
      {
        fill: "white",
        stroke: "antiquewhite",
        width: "80%",
        transX: "-6"
      },
      {},
      {}
    )}</div>
    <div class="-mt-5">${validate_component(SlideToggle, "SlideToggle").$$render(
      $$result,
      {
        name: "speech.1",
        size: "sm",
        active: "bg-secondary-600",
        rounded: "rounded-md",
        checked: activated
      },
      {
        checked: ($$value) => {
          activated = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div>`;
  } while (!$$settled);
  $$unsubscribe_VFS_PATH_PREFIX();
  return $$rendered;
});
const SplashPage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let splash;
  let postView;
  let $singlePost, $$unsubscribe_singlePost;
  let $audioStatus, $$unsubscribe_audioStatus;
  $$unsubscribe_singlePost = subscribe(singlePost, (value) => $singlePost = value);
  const { audioStatus } = Audio.stores;
  $$unsubscribe_audioStatus = subscribe(audioStatus, (value) => $audioStatus = value);
  splash = $audioStatus !== "playing" ? !$singlePost.isOpen : false;
  postView = $singlePost.isOpen;
  $$unsubscribe_singlePost();
  $$unsubscribe_audioStatus();
  return `<div class="absolute info top-20 left-3 -z-10">${validate_component(FolderScan, "FolderScan").$$render($$result, {}, {}, {})}</div>
	<div class="absolute info top-20 right-1 -mt-2">${validate_component(TextToSpeech, "TextToSpeech").$$render($$result, {}, {}, {})}</div>

<div class="container mx-auto my-2 w-[30%] flex-none"><div class="space-y-10 text-center">${!postView ? `<a href="/blog" data-sveltekit-noscroll>${validate_component(SplashSVG, "SplashSVG").$$render($$result, {}, {}, {})}</a>` : ``}
		<hr class="!border-t-4 !border-double">
		${splash ? `<h2 class="gradient-text opacity-90">Welcome to <br>Endless Process
			</h2>` : `${validate_component(NowPlaying, "NowPlaying").$$render($$result, {}, {}, {})}`}</div></div>`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="card variant-soft p-2 m-0.5 flex justify-center items-center overflow-hidden text-xs fading-bg">Endless Process © 2023
	</div>`;
});
const Cables = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $CablesPatch, $$unsubscribe_CablesPatch;
  let $CablesIsLoaded, $$unsubscribe_CablesIsLoaded;
  let $$unsubscribe_CablesAudioContext;
  let $CablesText, $$unsubscribe_CablesText;
  $$unsubscribe_CablesPatch = subscribe(CablesPatch, (value) => $CablesPatch = value);
  $$unsubscribe_CablesIsLoaded = subscribe(CablesIsLoaded, (value) => $CablesIsLoaded = value);
  $$unsubscribe_CablesAudioContext = subscribe(CablesAudioContext, (value) => value);
  $$unsubscribe_CablesText = subscribe(CablesText, (value) => $CablesText = value);
  let { patch } = $$props;
  let { bg = false } = $$props;
  let { spin = false } = $$props;
  let pathPatch = `/cables/${patch}/patch.js`;
  function spinText(prompts = ["End", "Proc"]) {
    if ($CablesIsLoaded) {
      $CablesPatch.config.spinAndPrompt("", prompts[0], prompts[1]);
    }
  }
  if ($$props.patch === void 0 && $$bindings.patch && patch !== void 0)
    $$bindings.patch(patch);
  if ($$props.bg === void 0 && $$bindings.bg && bg !== void 0)
    $$bindings.bg(bg);
  if ($$props.spin === void 0 && $$bindings.spin && spin !== void 0)
    $$bindings.spin(spin);
  {
    if (spin) {
      CablesText.set([Utils.rotateString($CablesText[0]), Utils.rotateString($CablesText[1])]);
      spinText($CablesText);
    }
  }
  $$unsubscribe_CablesPatch();
  $$unsubscribe_CablesIsLoaded();
  $$unsubscribe_CablesAudioContext();
  $$unsubscribe_CablesText();
  return `${$$result.head += `<!-- HEAD_svelte-kumn15_START --><script${add_attribute("src", pathPatch, 0)}><\/script><!-- HEAD_svelte-kumn15_END -->`, ""}

<div class="mb-4 "><canvas id="${"cables_" + escape(patch, true)}" width="100%" height="100%" style="${"width: 100%; height: 100%; z-index: " + escape(bg ? -137 : 0, true) + "; position: fixed;"}"></canvas></div>`;
});
const CanvasBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $CablesIsLoaded, $$unsubscribe_CablesIsLoaded;
  $$unsubscribe_CablesIsLoaded = subscribe(CablesIsLoaded, (value) => $CablesIsLoaded = value);
  let { spin } = $$props;
  if ($$props.spin === void 0 && $$bindings.spin && spin !== void 0)
    $$bindings.spin(spin);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `
${!$CablesIsLoaded ? `<div class="absolute inset-0 flex justify-center items-center">${validate_component(ProgressRadial, "ProgressRadial").$$render(
      $$result,
      {
        value: void 0,
        font: 8,
        width: "w-4",
        stroke: 5,
        meter: "stroke-secondary-500",
        track: "stroke-secondary-300/30"
      },
      {},
      {}
    )}</div>` : ``}

${validate_component(Cables, "Cables").$$render(
      $$result,
      { patch: "ENDPROC010", bg: true, spin },
      {
        spin: ($$value) => {
          spin = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_CablesIsLoaded();
  return $$rendered;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let spin;
  spin = false;
  return `

${validate_component(AppShell, "AppShell").$$render($$result, { class: " p-1 bg-transparent" }, {}, {
    footer: () => {
      return `
		${validate_component(Footer, "PageFooter").$$render($$result, {}, {}, {})}
	`;
    },
    pageHeader: () => {
      return `
		${validate_component(CanvasBody, "CanvasBody").$$render($$result, { spin }, {}, {})}
	`;
    },
    header: () => {
      return `
		${validate_component(EndProcAppBar, "EndProcAppBar").$$render($$result, {}, {}, {})}
	`;
    },
    default: () => {
      return `
	

	
	
	${validate_component(SplashPage, "SplashPage").$$render($$result, {}, {}, {})}
	${slots.default ? slots.default({}) : ``}

	`;
    }
  })}`;
});
export {
  Layout as default
};
