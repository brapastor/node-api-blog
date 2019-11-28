"use strict";
let validator = require('validator');
let Article = require('../models/article');

let controller = {
    datosCurso: (req, res) => {
        let hola = req.body.hola;
        return res.status(200).send(
            {
                curso: "master en frameworks",
                autor: "Brayan Pastor",
                url: "brapastor.com",
                hola
            });
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'soy la accion test de mi controlador de articulos'
        })
    },
    save: (req, res) => {
        // Recoger los parametros por post
        let params = req.body;

        // Validar datos (Validator)
        try {
            var validate_title = !validator.isEmpty(params.title); // cuando no este vacio
            var validate_content = !validator.isEmpty(params.content); // cuando no este vacio
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            })
        }
        if (validate_title && validate_content) {
            // Crear el objeto a guardar
            let article = new Article();

            // Asignar Valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // Guardar el Articulo en la bd
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!!'
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: "Los datos no son validos"
            })
        }

    },
    getArticles: (req, res) => {
        let query = Article.find({});
        let last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        query.sort('-_id').exec((err, articles) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos !!!'
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay Articulos para mostrar'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });

    },
    getArticle: (req, res) => {
        // Recoger el id de la url
        let articleId = req.params.id;

        // Comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el Articulo'
            });
        }
        // Buscar el articulo
        Article.findById(articleId, (err, article) => {
            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el Articulo'
                });
            }

            //Devolver en json
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },
    update: (req, res) => {
        //Recoger el id del articulo por la url

        // Recoger los datos que llegan por put

        // Validar Datoss

        // Find and Update

        // Devolver respuesta

        return res.status(200).send({
            status: 'success'
        });
    }

}; // end controller

module.exports = controller;