import { assertHTMLElement } from "./asserts.ts";
import { cloneTemplate, getElementById, querySelector, querySelectorAll, ref, refs } from "./common.ts";

export function hydroState(state: HTMLInputElement): void {
  let startYPosition = 0;
  let startValue = 50;
  let current = 50;
  const update = () => {
    state.value = current.toString();
  }
  state.addEventListener('touchstart', (event) => {
    const currentYPosition = event.touches.item(0)!.clientY;
    startYPosition = currentYPosition;
    startValue = current;
    event.preventDefault();
  });
  state.addEventListener('touchmove', (event) => {
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
  { name: 'buildings' },
  { name: 'energy' },
  { name: 'harvest' },
  { name: 'animals' },
  { name: 'microbes' },
  { name: 'science' },
  { name: 'space' },
  { name: 'saturn' },
  { name: 'venus' },
  { name: 'earth' },
  { name: 'city' },
  { name: 'event' },
];

export interface Supply {
  name: string;
}

const supplies = [
  { name: 'points' },
  { name: 'gold' },
  { name: 'steel' },
  { name: 'titan' },
  { name: 'plant' },
  { name: 'energy' },
  { name: 'heat' },
]

function mapFragments<T, TArray extends T[]>(array: TArray, map: (item: T) => DocumentFragment): DocumentFragment {
  const fragment = document.createDocumentFragment();
  for (const item of array) {
    const data = map(item);
    fragment.appendChild(data);
  }
  return fragment;
}

function createSupply({ name }: Supply): DocumentFragment {
  const fragment = cloneTemplate('tpl-supply');
  const { amount, icon, production } = refs(fragment);
  (icon as HTMLImageElement).src = `/images/supplies/${name}.svg`
  amount.classList.add(`--${name}`);
  icon.classList.add(`--${name}`);
  production.classList.add(`--${name}`);
  return fragment;
}

function createSupplies() {
  const fragment = cloneTemplate('tpl-supplies');
  const container = ref(fragment, 'supplies');
  const elements = mapFragments(supplies, createSupply);
  container.appendChild(elements);
  return fragment;
}

function createProject({ name }: Project): DocumentFragment {
  const template = cloneTemplate('tpl-project');
  const icon = ref(template, 'icon') as HTMLImageElement;
  (icon as HTMLImageElement).src = `/images/projects/${name}.png`;
  return template;
}

function createProjects() {
  const fragment = cloneTemplate('tpl-projects');
  const container = ref(fragment, 'projects');
  const elements = mapFragments(projects, createProject);
  container.appendChild(elements);
  return fragment;
}

const fragment = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  const panel = createSupplies();
  fragment.appendChild(panel);
}
const resourcesRoot = document.getElementById('panel');
assertHTMLElement(resourcesRoot, 'div');
resourcesRoot.appendChild(fragment);

const root = getElementById('app-content')!;
const options = {
  root,
  threshold: [1.0],
}
const callback = (entries: IntersectionObserverEntry[]) => {
  for (const entry of entries) {
    const target = entry.target as HTMLElement;
    const shadow = getElementById(`app-shadow-${target.dataset.shadow}`)!;
    shadow.classList.toggle(`--enabled`, !entry.isIntersecting,);
  }
}
const observer = new IntersectionObserver(callback, options);

observer.observe(getElementById('app-shadow-detector-top')!);
observer.observe(getElementById('app-shadow-detector-bottom')!);

function update(stage: string) {

}

for (const button of ['supplies', 'projects', 'history', 'settings']) {
  const element = getElementById(`btn-${button}`)!;
  element.addEventListener('click', () => update(button));
}
