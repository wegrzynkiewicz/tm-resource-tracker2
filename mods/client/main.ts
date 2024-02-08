import { createApp } from "./features/app.ts";

document.body.appendChild(createApp());
async function start() {

  //   const token = sessionStorage.getItem('token');
  const response = await fetch('http://localhost:3008/games', {
    method: 'POST',
  });
  const data = await response.json();
  const { gameId, token } = data;

  console.log(data);
  sessionStorage.setItem('token', token);

  const response2 = await fetch(`http://localhost:3008/games`, {
    method: 'GET',
    headers: {
      ['Authorization']: `Bearer ${token}`,
    },
  });
  const data2 = await response2.json();
  console.log(data2);
}
start();
