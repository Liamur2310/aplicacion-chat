import express from "express";
import {__dirname} from "./dirname.js";
import handlebars from "express-handlebars";
import viewRouter from "./routes/views.routes.js";
import {Server} from "socket.io";

const app = express();
const PORT = 5000;

const httpServer = app.listen(PORT, () => 
  console.log(`Server runing on port ${PORT}`));

const io = new Server (httpServer);

// Middlewares
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// Configuramos el handlebars
app.engine(
  "hbs",
  handlebars.engine({
    // index.hbs
    extname: "hbs",
    // Plantilla principal
    defaultLayout: "main",
  })
);

// Seteamos nuestro motor
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");  //inicializamos la carpeta views

// Public
app.use(express.static(__dirname + "/public"));   //iniciaizamos la carpeta public

// Routes
app.use("/", viewRouter);   //seteamos la ruta de las vistas

const messages = [];

io.on ("connection", (socket) => {     //inicializamos la conexion de web socket
  console.log("Nuevo usuario conectado");

  socket.on ("message", (data) =>{
    console.log(data);
    messages.push(data);
    io.emit("messages", messages)
  });

  //actividad que se adiciona para informar neuvo usuario conectado
  socket.on("inicio", (data) => {
    io.emit("messages", messages);
    socket.broadcast.emit("connected", data);
  });

  socket.emit("messages", messages);
})


