import { assertHTMLElement } from "./asserts";
import { cloneTemplate, ref } from "./common";
import { Supply, supplies } from "./supplies";

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

export function createSupply(supply: Supply) {
  const { icon, hasProduction, name } = supply;
  const fragment = cloneTemplate('template-supply');
  const production = ref(fragment, 'production');
  const image = ref(fragment, 'icon') as HTMLImageElement;
  const cells = fragment.querySelectorAll('.supply');
  for (const cell of cells) {
    cell.classList.add(`--${name}`);
  }
  production.classList.add(`--${name}`);
  if (hasProduction === false) {
    production.remove();
  }
  image.src = icon;
  return fragment;
}

export function createPanel() {
  const panel = cloneTemplate('template-panel');
  const container = ref(panel, 'supplies');
  for (const _data of supplies) {
    const supply = createSupply(_data)
    container.appendChild(supply);
  }
  return panel;
}

const fragment = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  const panel = createPanel();
  fragment.appendChild(panel);
}
const resourcesRoot = document.getElementById('panel');
assertHTMLElement(resourcesRoot, 'div');
resourcesRoot.appendChild(fragment);
