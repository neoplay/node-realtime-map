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

// https://developers.google.com/maps/documentation/javascript/examples/polyline-complex?hl=de
// JSON.stringify(poly.getPath().getArray())
var flightPlanCoordinates = [{"lat":47.55120203027912,"lng":7.536739110946655},{"lat":47.55179218678149,"lng":7.538992166519165},{"lat":47.55228458221312,"lng":7.539968490600586},{"lat":47.55289282900606,"lng":7.541647553443909},{"lat":47.55298334131823,"lng":7.5422269105911255},{"lat":47.552552501313286,"lng":7.5446248054504395},{"lat":47.551712534144585,"lng":7.5480687618255615},{"lat":47.55172339587493,"lng":7.548546195030212},{"lat":47.55191166550984,"lng":7.548969984054565},{"lat":47.552581465458296,"lng":7.549651265144348},{"lat":47.552827660044485,"lng":7.550123333930969},{"lat":47.553334527609444,"lng":7.55185067653656},{"lat":47.554058615626445,"lng":7.553867697715759},{"lat":47.55443875783014,"lng":7.554758191108704},{"lat":47.55478269363823,"lng":7.555798888206482},{"lat":47.555090423763566,"lng":7.556324601173401},{"lat":47.55698020914153,"lng":7.558910250663757},{"lat":47.55753771901118,"lng":7.559870481491089},{"lat":47.557798370941185,"lng":7.560760974884033},{"lat":47.5578273321867,"lng":7.561490535736084},{"lat":47.55756668040078,"lng":7.56234347820282},{"lat":47.557153979087865,"lng":7.5639259815216064},{"lat":47.55715759928896,"lng":7.565487027168274}];
var totDistance = 0;
var distance = 0;
for(var x = 0; x < flightPlanCoordinates.length; x++) {
	// distance
	if(x>0) { // skip first entry
		distance = helper.getDistanceFromLatLonInKm(flightPlanCoordinates[x-1], flightPlanCoordinates[x]);
		flightPlanCoordinates[x-1].distance = distance;
		totDistance += distance;
	}
	flightPlanCoordinates[x].distance_total = totDistance;
}
//console.log(flightPlanCoordinates);

io.on('connection', function(socket){
	io.emit('marker set', flightPlanCoordinates);
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});

var curPercent = 0;
function update(step) {
	curPercent += step;
	var curPos = flightPlanCoordinates[flightPlanCoordinates.length-1].distance_total / 100 * curPercent; // calculate new position
	//console.log('current process: ' + curPercent + '% (' + curPos + ' km)');
	
	var curLength = 0;
	var newPos = undefined;
	var nextPos = undefined;
	for(var x = 0; x < flightPlanCoordinates.length; x++) {
		if(flightPlanCoordinates[x].distance_total<=curPos) {
			newPos = flightPlanCoordinates[x];
			nextPos = flightPlanCoordinates[x+1];
		}
	}

	// debug output
	//console.log('last point: ' + JSON.stringify(newPos));
	//console.log('next point: ' + JSON.stringify(nextPos));
	var diff = curPos - newPos.distance_total;
	var section = 1 / newPos.distance * diff;
	//console.log('km to add: ' + diff + ' (' + section + ')');
	var finalPos = newPos;
	if(diff>0) {
		finalPos = helper.interpolate(newPos, nextPos, section);
	}
	//console.log('final pos: ' + JSON.stringify(finalPos));

	io.emit('marker update', finalPos);
	if(curPercent==100) {
		setTimeout(function() { update(-1); }, 500);
	} else if(curPercent==0) {
		setTimeout(function() { update(1); }, 500);
	} else {
		setTimeout(function() { update(step); }, 500);
	}
}
update(1);