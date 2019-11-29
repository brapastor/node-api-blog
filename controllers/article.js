"use strict";
let validator = require('validator');
let Article = require('../models/article');
const fs = require('fs');
const path = require('path');

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
        let articleID = req.params.id;

        // Recoger los datos que llegan por put
        let params = req.body;

        // Validar Datoss
        try {
            let validate_title = !validator.isEmpty(params.title);
            let validate_content = !validator.isEmpty(params.content);

            if (validate_title && validate_content) {
                // find and update
                Article.findOneAndUpdate({_id: articleID}, params, {new: true}, (err, articleUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar'
                        });
                    }
                    if (!articleUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el articulo'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        message: articleUpdated
                    });
                });
            } else {
                // Devolver respuesta
                return res.status(200).send({
                    status: 'error',
                    message: 'La Validacion no es correcta'
                });
            }
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
    },
    delete: (req, res) => {
        // Recoger el id de la url
        let articleId = req.params.id;

        // find and delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al Borrar'
                });
            }
            if (!articleRemoved) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista'
                });
            }

            return res.status(200).send({
                status: 'success',
                articleRemoved
            });
        });

    },
    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/articles.js (hecho)
        // Recoger el fichero de la peticion
        let file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(200).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir nombre y la extension del archivo
        let file_path = req.files.file0.path;
        let file_split = file_path.split('/');

        //Nombre del Archivo
        file_name = file_split[2];

        // Extension del fichero
        let extension_split = file_name.split('.');
        let file_ext = extension_split[1];

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            // Borrar el archivo
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                });
            });
        } else {
            // si todo es Valido, sacando la id de la url
            let articleId = req.params.id;

            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) => {
                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: 'error',
                        article: 'Error al guadar la imagen de articulo'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });


        }
    },
    getImage: (req, res) => {
        let file = req.params.image;
        let path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }

        });

    },
    search: (req, res) => {
        // Sacar el string a buscar
        let seachStrig = req.params.search;

        //Find
        Article.find({
            "$or": [
                {"title": {"$regex": seachStrig, "$options": "i"}},
                {"content": {"$regex": seachStrig, "$options": "i"}},
            ]
        }).sort([['date', 'descending']])
            .exec((err,articles)=>{
                if (err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion'
                    });
                }
                if (!articles || articles.length <= 0){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu busqueda'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });

    }

}; // end controller

module.exports = controller;