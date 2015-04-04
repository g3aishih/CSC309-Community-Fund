/*
 * Server file
 */

//Add dependencies 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var User = require('./src/models/user');
var Project = require('./src/models/project');
var func = require('./src/controllers/server-controller')
var app = express();

//Connect to Mongo database
mongoose.connect('mongodb://localhost/communityfund');

//Setup routes
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use('/api', require('./src/routes/api'));
app.use('/src', express.static(__dirname + '/src'));

//Respond to GET, PUT, POST, DELETE requests
app.get('/', function(req, res) {
	func.authenticateEmail(req.cookies.email, function(response) {
		if (response) {
			res.sendFile('src/html/main.html', {root: __dirname});
		} else {
			res.sendFile('src/html/root.html', {root: __dirname});
		}
	});
});

app.get('/root.html', function(req, res) {
	res.sendFile('src/html/root.html', {root: __dirname});
});

app.get('/main.html', function(req, res) {
	func.authenticateEmail(req.cookies.email, function(response) {
		if (response) {
			res.sendFile('src/html/main.html', {root: __dirname});
		} else {
			res.redirect('/');
		}
	});
});

app.post('/signup', function(req, res) {
	func.authenticateSignUp(req.body.email, function(response) {
		if (response) {
			func.createUser(req.body.name, req.body.email, req.body.password, function(response) {
				res.send(true);
			});
		} else {
			res.send(false);
		}
	});
});

app.post('/login', function(req, res) {
	func.authenticateLogin(req.body.email, req.body.password, function(response) {
		if (response) {
			res.cookie("email", req.body.email, {
				path: '/',
				httpOnly: true,
				maxAge: 604800000
			});
			res.send(true);
		} else {
			res.send(false);
		}
	});
});

app.post('/logout', function(req, res) {
	res.clearCookie("email");
	res.redirect('/root.html');
});

app.post('/createIdea', function(req, res) {
	func.createIdea(req.body.title, req.body.description, req.body.category, req.body.tags, req.cookies.email, function(response) {
		res.json(response);
	});
});

app.get('/getUserIdeas', function(req, res) {
	func.getUserIdeas(req.cookies.email, function(response) {
		res.json(response);
	});
});

app.get('/getOtherIdeas', function(req, res) {
	func.getOtherIdeas(req.cookies.email, function(response) {
		res.json(response);
	});
});

app.put('/idea/:id', function(req, res) {;
	func.updateIdea(req.params.id, req.body.title, req.body.description, req.body.category, req.body.tags, req.body.likes, req.body.dislikes, function(response) {
		res.json(response);
	});
});

app.delete('/idea/:id', function(req, res) {
	func.deleteIdea(req.params.id, function(response) {
		res.json(response);
	});
});

app.get('/getUser', function(req, res) {
	func.getUser(req.cookies.email, function(response) {
		res.send(response);
	});
});

app.get('/findRating/:id', function(req, res) {
	func.findRating(req.cookies.email, req.params.id, function(response) {
		res.json(response);
	});
});

app.put('/user/:flag', function(req, res) {
	if (req.body.flag == -1) {
		func.pullUserRating(req.cookies.email, req.params.flag, req.body.id, function(response) {
			res.json(response);
		});
	} else if (req.body.flag == 1){
		func.pushUserRating(req.cookies.email, req.params.flag, req.body.id, function(response) {
			res.json(response);
		});	
	} else if (req.body.flag == 0) {
		func.pushUserRating(req.cookies.email, req.params.flag, req.body.id, function(response) {
			func.pullUserRating(req.cookies.email, (1 - req.params.flag), req.body.id, function(response) {
				res.json(response);
			});
		});			
	}
});

app.get('/getRatings', function(req, res) {
	func.getRatings(req.cookies.email, function(response) {
		res.json(response);
	});
});

app.get('/categoryCount', function(req, res) {
	func.categoryCount(function(response) {
		res.json(response);
	});
});

app.get('/view/:id', function(req, res) {
	res.sendFile('src/html/view.html', {root: __dirname});
});

app.get('/getIdea/:id', function(req, res) {
	func.getIdea(req.params.id, function(response) {
		res.json(response);
	});
});

app.put('/updateCategory', function(req, res) {
	func.updateCategory(req.cookies.email, req.body.category, req.body.flag, function(response) {
		res.json(response);
	});
});

app.put('/updateSorting', function(req, res) {
	func.updateSorting(req.cookies.email, req.body.order, req.body.sortBy, function(response) {
		res.json(response);
	});
});

app.post('/setFilter', function(req, res) {
	func.setFilter(req.cookies.email, req.body.clear, req.body.tags, function(response) {
		res.json(response);
	});
});

app.post('/retrieve', function(req, res) {
	func.retrieve(req.body.posInt, req.body.sdate, req.body.edate, function(response) {
		res.json(response);
	});
});

//Listen on port 8080
console.log("App is running on localhost:8080");
app.listen(8080);