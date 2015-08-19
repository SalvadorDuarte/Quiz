var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
			where: {id: Number(quizId)},
			include: [{model: models.Comment}]
		}).then(
			function(quiz) {
				if (quiz) {
					req.quiz=quiz;
					next();
				}
				else
				{
					next(new Error('No existe quizId=' + quizId));
				}
			}
	).catch(function(error) {next(error);} );
};

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
	res.render('quizes/show', {quiz: req.quiz, errors: []});
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
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta)
	{
		resultado = 'Correcto';
	}
	
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});	
};

//GET /quizes
//Se añade búsqueda de preguntas: El patrón buscado es reemplazado por %, siendo insensible a mayúsculas 
exports.index = function(req, res) {
	var search;
	if (req.query.search)
	{
		search = '%' + req.query.search.replace(/\s/gi, "%") + '%';
	}
	else 
	{	
		search = '%'
	}

	var filtro = {where: ["upper(pregunta) like upper(?)", search], order: 'pregunta ASC'};

	models.Quiz.findAll(filtro).then(
		function(quizes){
			res.render('quizes/index', {quizes: quizes, errors: []});	
		}
	).catch(function(error) {next(error);} )
};

//GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		// crea objeto quiz
			{pregunta:"Pregunta", respuesta:"Respuesta"}
		);

		res.render('quizes/new', {quiz: quiz, errors: []});
};

//GET /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	
	quiz.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				// guarda en DB los campos pregunta y respuesta de quiz
				quiz.save({fields: ["pregunta", "respuesta"]}).then(
					function(){
						res.redirect('/quizes'); // Redirección HTTP (URL relativo) a lista de preguntas
					});
			}
		}
	);
};

//GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	
	req.quiz.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/edit', {quiz: quiz, errors: err.errors});
			} else {
				// guarda en DB los campos pregunta y respuesta de quiz
				req.quiz.save({fields: ["pregunta", "respuesta"]}).then(
					function(){
						res.redirect('/quizes'); // Redirección HTTP (URL relativo) a lista de preguntas
					});
			}
		}
	);
};

//DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(
		function(){
			res.redirect('/quizes');
		}
	).catch(function(error){next(error)});
};


//GET /author
exports.author = function(req, res) {
	res.render('quizes/author', {autor: 'Salvador Duarte Perez', 
								 autor_imagen: '/images/autor.jpg'}
	);
};
