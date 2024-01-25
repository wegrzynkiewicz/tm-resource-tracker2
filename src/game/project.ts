import { button_text, div_nodes, div_text, img_props } from "../common/dom.ts";

export interface Project {
  name: string;
}

const projects: Project[] = [
  { name: "buildings" },
  { name: "energy" },
  { name: "harvest" },
  { name: "animals" },
  { name: "microbes" },
  { name: "science" },
  { name: "space" },
  { name: "saturn" },
  { name: "venus" },
  { name: "earth" },
  { name: "city" },
  { name: "event" },
];

export function createProject({ name }: Project) {
  return div_nodes("project", [
    button_text("box _button _project", "-"),
    img_props({
      className: "project_icon",
      width: "40",
      height: "40",
      src: `/images/projects/${name}.png`,
    }),
    div_text("box _counter", "0"),
    button_text("box _button _project", "+"),
  ]);
}

export function createProjectsList() {
  return div_nodes("panel_item", [
    div_nodes("projects", projects.map(createProject)),
  ]);
}

export function createProjectsPanel() {
  return div_nodes("panel", [1, 2, 3, 4].map(createProjectsList));
}
