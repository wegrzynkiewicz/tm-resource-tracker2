// TODO: Move to shared
const createSVGElement = (tag: string) => document.createElementNS("http://www.w3.org/2000/svg", tag);

export function svg_icon(className: string, icon: string) {
  const svg = createSVGElement("svg");
  svg.setAttribute("class", className);
  const use = createSVGElement("use");
  use.setAttribute("href", `/images/symbols.svg#icon-${icon}`);
  svg.appendChild(use);
  return svg;
}
