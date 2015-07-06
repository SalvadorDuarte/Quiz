var models = require('../models/models.js');

//OLD: Método antiguo de una pagina con pregunta estatica
////GET /quizes/question
//exports.question = function(req, res) {
//	models.Quiz.findAll().success(function(quiz){
//		res.render('quizes/question', {pregunta: quiz[0].pregunta});	
//	})
//	
//	//OLD: forma de realizar pregunta sin bbdd
//	//res.render('quizes/question', {pregunta: 'Capital de Italia'});
//};

//GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: quiz});	
	})
};

//OLD: Método antiguo de una pagina con pregunta estatica
////GET /quizes/answer
//exports.answer = function(req, res) {
//	models.Quiz.findAll().success(function(quiz){
//		if (req.query.respuesta === quiz[0].respuesta)
//		{
//			res.render('quizes/answer', {respuesta: 'Correcto'});	
//		}
//		else
//		{
//			res.render('quizes/answer', {respuesta: 'Incorrecto'});	
//		}
//	})
//};

//GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.find(req.params.quizId).success(function(quiz){
		if (req.query.respuesta === quiz.respuesta)
		{
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});	
		}
		else
		{
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto'});	
		}
	})
};

//GET /quizes/:id
exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs', {quizes: quizes});	
	})
};

//GET /author
exports.author = function(req, res) {
	res.render('quizes/author', {autor: 'Salvador Duarte Perez', 
								 autor_imagen: '/images/autor.jpg'}
	);
};
