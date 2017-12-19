var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var helper = require('./helper.js');
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/resources/map.html');
});

var flightPlanCoordinates = [
	{lat: 41.27780646738183, lng: -90.439453125},
	{lat: 41.9022770409637, lng: -90.186767578125},
	{lat: 42.0737622400872, lng: -89.615478515625},
	{lat: 42.057450220246814, lng: -88.59375},
	{lat: 41.631867410697474, lng: -88.385009765625},
	{lat: 41.054501963290505, lng: -88.604736328125},
	{lat: 40.65563874006118, lng: -87.275390625},
	{lat: 41.236511201246216, lng: -86.66015625},
	{lat: 41.95949009892467, lng: -86.099853515625},
	{lat: 42.33418438593939, lng: -86.715087890625},
	{lat: 42.44778143462245, lng: -87.451171875}
];
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
		setTimeout(function() { update(-1); }, 200);
	} else if(curPercent==0) {
		setTimeout(function() { update(1); }, 200);
	} else {
		setTimeout(function() { update(step); }, 200);
	}
}
update(1);