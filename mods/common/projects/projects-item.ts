import { Project, projects } from "./common.ts";

export function createProject({ name }: Project) {
  return div_nodes("project", [
    img_props({
      className: "project_icon",
      width: "40",
      height: "40",
      src: `/images/projects/${name}.png`,
    }),
    button("box _button _project", "-"),
    div("box _counter", "0"),
    button("box _button _project", "+"),
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
