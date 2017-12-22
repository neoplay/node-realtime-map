var helper = require('./helper.js');

class course {

	constructor(course, vehicle, curPercent, step, route) {

		this.course = course;
		this.vehicle = vehicle;
		this.route = route;
		this.curPercent = curPercent;
		this.step = step;
		console.log('course ' + this.course + ' initialized');

	}

	init() {
		return {
			course: this.course,
			vehicle: this.vehicle,
			line: this.route.line,
			color: this.route.color,
			waypoints: this.route.waypoints
		};
	}

	update() {
		this.curPercent += this.step*0.5;

		var curPos = this.route.waypoints[this.route.waypoints.length-1].distance_total / 100 * this.curPercent; // calculate new position
		console.log('course ' + this.course + ' process: ' + this.curPercent + '% (' + curPos + ' km)');
		
		var curLength = 0;
		var newPos = undefined;
		var nextPos = undefined;
		for(var x = 0; x < this.route.waypoints.length; x++) {
			if(this.route.waypoints[x].distance_total<=curPos) {
				newPos = this.route.waypoints[x];
				nextPos = this.route.waypoints[x+1];
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

		// change direction
		if(this.curPercent==100) {
			this.step = -1;
		} else if(this.curPercent==0) {
			this.step = 1;
		}

		return {course:this.course, pos:finalPos};
	}

}

module.exports = course;