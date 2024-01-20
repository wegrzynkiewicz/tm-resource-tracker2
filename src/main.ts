import { createApp } from "./game/app.ts";

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

document.body.appendChild(createApp());
