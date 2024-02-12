import { ServiceResolver } from "../common/dependency.ts";
import { provideAppView } from "./features/app/app.ts";

async function start() {
  const resolver = new ServiceResolver();
  const app = resolver.resolve(provideAppView);
  document.body.appendChild(app.$root);

  const response3 = await fetch(`http://localhost:3008/games`, {
    method: "GET",
    headers: {
      ["Authorization"]: `Bearer 123`,
    },
  });

  //   const token = sessionStorage.getItem('token');
  const response = await fetch("http://localhost:3008/games", {
    method: "POST",
  });
  const data = await response.json();
  const { gameId, token } = data;

  console.log(data);
  sessionStorage.setItem("token", token);

  const response2 = await fetch(`http://localhost:3008/games`, {
    method: "GET",
    headers: {
      ["Authorization"]: `Bearer ${token}`,
    },
  });
  const data2 = await response2.json();
  console.log(data2);
}
start();
