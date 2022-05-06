const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var listaUsuarios = Array();

// hacer que los archivos que te pidan los busque en la carpeta Front
app.use(express.static("Front"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
  // console.log(ip.address() + "\n");
});

io.on("connection", (socket) => {
  console.log("\n" + "Ha entrado un cliente!!!");
  socket.on("tuNombre", (tuNombre) => {
    if (tuNombre != "") {
      var nombrerandom = "user_" + tuNombre;
    } else {
      var nombrerandom = "user_Anónimo";
    }
    if (tuNombre == null) {
      var nombrerandom = "user_" + Math.floor(Math.random() * 10000); // random number between 0 and 9999
    }

    socket["userinfo"] = {
      nombre: nombrerandom,
      escribiendo: "",
    };

    listaUsuarios.push(socket["userinfo"]); //
    socket.emit("usuarioSMS", socket["userinfo"].nombre);
    console.log(socket["userinfo"].nombre); //
    console.log(listaUsuarios);
    socket.on("Escribiendo", (e) => {
      if (e == true) {
        socket["userinfo"].escribiendo = "Escribiendo...";
        io.emit("listaUsers", listaUsuarios); // broadcast io
      } else {
        socket["userinfo"].escribiendo = "";
        io.emit("listaUsers", listaUsuarios); // broadcast io
      }
    });

    io.emit("listaUsers", listaUsuarios); // broadcast io

    socket.on("disconnect", () => {
      console.log("\n\n" + socket["userinfo"].nombre + " disconnected");
      // for (let usu of listaUsuarios){}  ARRAY DEL PRIMERO AL ULTIMO SOLAMENTE
      
      listaUsuarios = listaUsuarios.filter(
        (item) => item.nombre !== socket["userinfo"].nombre
      );
      
      io.emit("listaUsers", listaUsuarios);
      console.log(listaUsuarios);
    });
  });
});

io.on("connection", (socket) => {
  socket.on("chat message", (html) => {
    // el que se conecte socket
    console.log("message: " + html);
  });
});

io.on("connection", (socket) => {
  socket.on("chat message", (html) => {
    io.emit("chat message", html);
  });
});
