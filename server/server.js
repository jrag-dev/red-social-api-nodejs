const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const { dbConnect } = require("./db/mongodb");


const app = express();
const port = process.env.PORT || 3001;

// conexión a ala base de datos
dbConnect(process.env.MONGODB_URI_DEV);

// TODO: middlewares

// morgan
app.use(morgan("common"))

// habilitar express json
app.use(express.json())

// helmet
app.use(helmet())

// habilitar carpeta publica
app.use(express.static(path.join(__dirname, "../public")))

// rutas de la api
app.use(require("./routes"))


app.listen(port, () => {
  console.log({
    activo: "Servidor activo",
    endpoint: `http://localhost:${port}`
  })
})