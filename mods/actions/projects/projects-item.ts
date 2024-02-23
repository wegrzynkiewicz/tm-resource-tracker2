import { button_text, div_nodes, div_text, img_props } from "../../common/frontend-framework/dom.ts";
import { Project, projects } from "./common.ts";

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

export class ProjectsItem {
  public readonly $root: HTMLDivElement;
  public constructor() {
    this.$root = div_nodes("panel_item", [
      div_nodes("projects", projects.map(createProject)),
    ]);
  }
}
