import { assertHTMLElement } from "./asserts.ts";
import { cloneTemplate, getElementById, querySelector, ref, refs } from "./common.ts";

export function hydroState(state: HTMLInputElement): void {
  let startYPosition = 0;
  let startValue = 50;
  let current = 50;
  const update = () => {
    state.value = current.toString();
  };
  state.addEventListener("touchstart", (event) => {
    const currentYPosition = event.touches.item(0)!.clientY;
    startYPosition = currentYPosition;
    startValue = current;
    event.preventDefault();
  });
  state.addEventListener("touchmove", (event) => {
    const currentYPosition = event.touches.item(0)!.clientY;
    const result = currentYPosition - startYPosition;
    current = startValue + Math.floor(result / 20);
    update();
    event.preventDefault();
  });
  update();
}

export interface Project {
  name: string;
}

const projects = [
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

export interface Supply {
  name: string;
}

const supplies = [
  { name: "points" },
  { name: "gold" },
  { name: "steel" },
  { name: "titan" },
  { name: "plant" },
  { name: "energy" },
  { name: "heat" },
];

function mapFragments<T, TArray extends T[]>(array: TArray, map: (item: T) => Node): DocumentFragment {
  const fragment = document.createDocumentFragment();
  for (const item of array) {
    const data = map(item);
    fragment.appendChild(data);
  }
  return fragment;
}

function createSupply({ name }: Supply): DocumentFragment {
  const fragment = cloneTemplate("tpl-supply");
  const { amount, icon, production } = refs(fragment);
  (icon as HTMLImageElement).src = `/images/supplies/${name}.svg`;
  amount.classList.add(`--${name}`);
  icon.classList.add(`--${name}`);
  production.classList.add(`--${name}`);
  return fragment;
}

function createSupplies() {
  const fragment = cloneTemplate("tpl-supplies");
  const container = ref(fragment, "supplies");
  const elements = mapFragments(supplies, createSupply);
  container.appendChild(elements);
  return fragment;
}

export function ProjectComponent({ name }: Project) {
  return (
    <div className="project">
      <button className="box --button --project">-</button>
      <img className="project__icon" width="40" height="40" src={`/images/projects/${name}.png`} />
      <div className="box --counter">0</div>
      <button className="box --button --project">+</button>
    </div>
  );
}

function ProjectsComponent() {
  return (
    <div className="panel__item">
      <div className="projects">
        {mapFragments(projects, ProjectComponent)}
      </div>
    </div>
  );
}

function ProjectsPanelComponent() {
  return (
    <div className="panel">
      {mapFragments([1, 2, 3, 4], ProjectsComponent)}
    </div>
  );
}

const root = getElementById("app-content")!;
root.appendChild(ProjectsPanelComponent());


const options = {
  root: getElementById("app-scroll-viewport")!,
  threshold: [1.0],
};

const callback = (entries: IntersectionObserverEntry[]) => {
  for (const entry of entries) {
    const target = entry.target as HTMLElement;
    const shadow = getElementById(`app-shadow-${target.dataset.detector}`)!;
    shadow.classList.toggle(`--enabled`, !entry.isIntersecting);
  }
};
const observer = new IntersectionObserver(callback, options);

observer.observe(getElementById("app-shadow-detector-top")!);
observer.observe(getElementById("app-shadow-detector-bottom")!);

function update(stage: string) {
}

const nodes = document.querySelectorAll("[data-toolbar]");
nodes.forEach((node) => {
  node.addEventListener("click", () => {
    update;
  });
});
