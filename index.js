'use strict';
let mongoose = require('mongoose');
let app = require('./app');
let port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("la conexion a la base de datos correcta")

        //Crear servidor y ponerme a escuchar HTTP
        app.listen(port, ()=>{
           console.log("servidor corriendo http:localhost:3900")
        });
    });

