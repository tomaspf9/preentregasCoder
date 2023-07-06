const socket = io();

let message = document.getElementById("message");
let user = document.getElementById("userName");
let btn = document.getElementById("send");
let output = document.getElementById("output");
let actions = document.getElementById("actions");

const getMessage = async () => {
  const response = await fetch("http://localhost:8080/chat/messages");
  const data = await response.json();
  const message = data.map(
    (msj) =>
      (output.innerHTML += `<p>
        <strong>${msj.user}</strong>: ${msj.message} 
     </p>`)
  );
};
getMessage();

btn.addEventListener("click", () => {
  socket.emit("mensaje", {
    message: message.value,
    user: user.value,
  });
  message.value = "";
});

message.addEventListener("keypress", () => {
  socket.emit("escribiendo", user.value);
});

socket.on("mensajeServidor", (data) => {
  actions.innerHTML = "";
  output.innerHTML += `<p>
       <strong>${data.user}</strong>: ${data.message} 
    </p>`;
});

socket.on("escribiendo", (data) => {
  actions.innerHTML = `<p><em>${data} esta escribiendo...</em></p>`;
});