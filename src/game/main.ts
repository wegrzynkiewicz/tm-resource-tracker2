import { assertHTMLElement } from "./asserts";
import { cloneTemplate } from "./common";
import { resources } from "./resources";

const fragment = document.createDocumentFragment();
for (const resource of resources) {
  const { refs, root } = cloneTemplate('resource-template');
  const { icon, state } = refs;
  assertHTMLElement(icon, 'img');
  assertHTMLElement(state, 'input');
  icon.src = resource.icon;
  fragment.appendChild(root);

  let currentY = 0;
  let startValue = 0;
  let currentValue = 0;

  state.value = "50";

  state.addEventListener('touchstart', (event) => {
    startValue = parseInt(state.value);
    currentY = event.touches.item(0)!.clientY;
    event.preventDefault();
  })
  state.addEventListener('touchmove', (event) => {
    const result = event.touches.item(0)!.clientY - currentY;
    currentValue = startValue + Math.floor(result / 20);
    state.value = currentValue.toString();
    event.preventDefault();
  });
  state.addEventListener('touchend', (event) => {
    event.preventDefault();
  })
}
const resourcesRoot = document.getElementById('resources');
assertHTMLElement(resourcesRoot, 'div');
resourcesRoot.appendChild(fragment);
