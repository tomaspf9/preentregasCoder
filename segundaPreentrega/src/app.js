// Import express

import express from "express";
const host = "0.0.0.0";
const app = express();
const port = 8080;

// Import de routes

import productRouter from "./routes/product.routes.js"
import chatRouter from "./routes/chat.routes.js"
import cartRouter from "./routes/cart.routes.js"
import viewsRouter from "./routes/views.routes.js"
import cookiesRouter from "./routes/cookies.router.js"
import sessionsRouter from "./routes/sessions.router.js"

//Utils
import __dirname from "./utils.js";


// Mongo env y url
import MongoStore from "connect-mongo";
import session from "express-session";
import mongoose from "mongoose";
import { messageModel } from "./dao/mongo/models/chat.model.js";
import { productModel } from "./dao/mongo/models/product.model.js";
const mongoURL = "mongodb+srv://tomaspf33:<coder>@cluster0.hwqwlmp.mongodb.net/?retryWrites=true&w=majority";
const enviroment = async () => {await mongoose.connect(mongoURL)};
enviroment();
app.use(session({
	store: MongoStore.create({mongoURL}),
	secret: "<TOKEN>",
	resave: false,
	saveUninitialized: true,
}))

// Strats passport y github
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


//  Handlebars y middlewares

import handlebars from "express-handlebars";
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/cookies",cookiesRouter);
app.use("/api/sessions",sessionsRouter);
app.use("/", viewsRouter);
app.use("/chat", chatRouter);


// Contactar DB
mongoose.set("strictQuery", false);
mongoose.connect(mongoURL, (err) => {
  if (err) {
    console.log("Fallo la conexión a la DB", err.message);
    process.exit();
  } else {
    console.log("Conectado a la BD");
  }
});

// Server y socket

import { Server } from "socket.io";
const server = app.listen(port, () => {
  console.log(`Server OK en ${host}:${port}`);
});

const io = new Server(server);

// Escuchar conexiones
io.on("connection", async socket => {
	console.log(`Client ${socket.id} connected`);

	// Enviar productos
	const products = await productModel.find().lean();
	io.emit("products", products);
	
	productModel.watch().on("change", async change => {
		const products = await productModel.find().lean();
		io.emit("products", products);
	});
	socket.on("user", async data => {
		await messageModel.create({
			user: data.user,
			message: data.message,
		});

	
		const messagesDB = await messageModel.find();
		io.emit("messagesDB", messagesDB);
	});

	socket.on("message", async data => {
		await messageModel.create({
			user: data.user,
			message: data.message,
		});

		const messagesDB = await messageModel.find();
		io.emit("messagesDB", messagesDB);
	});

	socket.on("disconnect", () => {
		console.log(`Client ${socket.id} disconnected`);
	});
})
