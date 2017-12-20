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
activeCourses.push(new course('0601', 0, 1, routes.getRoute("6")));
activeCourses.push(new course('0602', 10, 1, routes.getRoute("6")));
activeCourses.push(new course('0603', 90, 1, routes.getRoute("6")));
activeCourses.push(new course('0604', 100, -1, routes.getRoute("6")));

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