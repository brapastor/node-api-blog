"use strict";

let express = require('express');
let ArticleController = require('../controllers/article');

let router = express.Router();

//RUTAS DE PRUEBA
router.post('/datos-cursos', ArticleController.datosCurso);
router.post('/datos-cursos', ArticleController.datosCurso);

//Rutas uriles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);

module.exports = router;


