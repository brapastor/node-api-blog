"use strict";

let express = require('express');
let ArticleController = require('../controllers/article');

let router = express.Router();

let multipart = require('connect-multiparty');
let md_upload = multipart({uploadDir: './upload/articles'});

//RUTAS DE PRUEBA
router.post('/datos-cursos', ArticleController.datosCurso);
router.post('/datos-cursos', ArticleController.datosCurso);

//Rutas uriles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/articles/:id', ArticleController.getArticle);
router.put('/articles/:id', ArticleController.update);
router.delete('/articles/:id', ArticleController.delete);
router.post('/upload-image/:id', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;


