import { mapToFragment } from "../common.ts";

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
  return (
    <div className="project">
      <button className="box --button --project">-</button>
      <img className="project__icon" width="40" height="40" src={`/images/projects/${name}.png`} />
      <div className="box --counter">0</div>
      <button className="box --button --project">+</button>
    </div>
  );
}

export function createProjectsList() {
  return (
    <div className="panel__item">
      <div className="projects">
        {mapToFragment(projects, createProject)}
      </div>
    </div>
  );
}

export function createProjectsPanel() {
  return (
    <div className="panel">
      {mapToFragment([1, 2, 3, 4], createProjectsList)}
    </div>
  );
}
