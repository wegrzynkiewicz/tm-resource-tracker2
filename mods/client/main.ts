import "./polyfill.ts"
import { createApp } from "./features/app.ts";

document.body.appendChild(createApp());

const response = await fetch('http://localhost:3008/game/create', {

  method: 'POST',
});
const data = await response.json();
console.log(data);
