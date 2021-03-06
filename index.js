var express = require('express');
var helper = require('./helper.js');
var port = process.env.PORT || 3000;

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/html/map.html');
});

var routes = new (require('./routes.js'))();

var course = require('./course.js');
var activeCourses = [];
activeCourses.push(new course('0601', 'flexity', 0, 1, routes.getRoute("6")));
activeCourses.push(new course('0602', 'flexity', 10, 1, routes.getRoute("6")));
activeCourses.push(new course('0603', 'flexity', 90, 1, routes.getRoute("6")));
activeCourses.push(new course('0801', 'flexity', 100, -1, routes.getRoute("8")));
activeCourses.push(new course('0201', 'flexity', 40, -1, routes.getRoute("2")));
activeCourses.push(new course('0301', 'flexity', 60, 1, routes.getRoute("3")));

io.on('connection', function(socket){
	activeCourses.forEach(function(course) {
		io.emit('marker set', course.init());
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});

function start() {
	activeCourses.forEach(function(course) {
		io.emit('marker update', course.update());
	});
	setTimeout(start, 500);
}
start();