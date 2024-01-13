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

const fragment = document.createDocumentFragment();
for (const _data of supplies) {
//   fragment.appendChild(resource);
}
const resourcesRoot = document.getElementById('supplies');
assertHTMLElement(resourcesRoot, 'div');
resourcesRoot.appendChild(fragment);
