const createSVGElement = (tag: string) => document.createElementNS("http://www.w3.org/2000/svg", tag);

export interface SVGIconProps {
  className: string;
  icon: string;
}

export function SVGIcon({ className, icon }: SVGIconProps) {
  const svg = createSVGElement("svg");
  svg.setAttribute("class", className);
  const use = createSVGElement("use");
  use.setAttribute("href", `/images/symbols.svg#icon-${icon}`);
  svg.appendChild(use);
  return svg;
}
