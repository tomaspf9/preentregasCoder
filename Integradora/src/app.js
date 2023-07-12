import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import productRouter from "./routes/product.routes"
import chatRouter from "./routes/chat.routes"
import cartRouter from "./routes/cart.routes"

import __dirname from "./utils.js";
import { Server } from 'socket.io';

const app = express();
const port = 8080;

mongoose.connect(
    "mongodb+srv://tomaspf33:coder@cluster0.hwqwlmp.mongodb.net/?retryWrites=true&w=majority")

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static("public"));

const server = app.listen(port, () => {
  console.log(`Server OK en puerto ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Contactar DB
mongoose.set("strictQuery", false);
mongoose.connect(mongoURL, (err) => {
  if (err) {
    console.log("Fallo de conexión DB", err.message);
    process.exit();
  } else {
    console.log("Conectado a la BD");
  }
});

// Server en 8080
const httpServer = app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});

const io = new Server(httpServer);
const messages = [];

// Escuchar conexiones
io.on("connection", (socket) => {
	console.log("New client connected");

	// Enviar productos
	socket.emit("products", products);

	// Chat
	io.emit("messagesLogs", messages);

	socket.on("user", data => {
		messages.push(data);
		io.emit("messagesLogs", messages);
	});

	socket.on("message", data => {
		messages.push(data);
		io.emit("messagesLogs", messages);
	});

	// Aviso de desconexión
	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
//app.use("/api/viewProducts", viewsRouter);
app.use("/chat", chatRouter);
