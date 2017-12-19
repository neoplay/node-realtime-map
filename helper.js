var deg2rad = function(deg) {
	return deg * (Math.PI/180)
}

exports.getDistanceFromLatLonInKm = function(pos1, pos2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(pos2.lat-pos1.lat);  // deg2rad below
	var dLon = deg2rad(pos2.lng-pos1.lng); 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(pos1.lat)) * Math.cos(deg2rad(pos2.lat)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
}

exports.interpolate = function(pos1, pos2, section) { // section between 0 and 1
	var lat = pos1.lat + (section * (pos2.lat-pos1.lat));
	var lng = pos1.lng + (section * (pos2.lng-pos1.lng));
	return {lat: lat, lng: lng};
}