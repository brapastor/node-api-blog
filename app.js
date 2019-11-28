"use strict";

//Cargar modulos de node para crear el servidor
let express = require('express');
let bodyParser = require('body-parser');

//Ejecutar Express (http)
let app = express();

//Cargar Ficheros rutas
let article_routes = require('./routes/article');

//Middlewares
app.use(bodyParser.urlencoded({extented: false}));
app.use(bodyParser.json());

// CORS

//Añadir prefijos a rutas / Cargar rutas
app.use('/api',article_routes);


//Exportar modulo(fichero actual)
module.exports = app;