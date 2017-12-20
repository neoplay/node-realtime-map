var helper = require('./helper.js');

class routes {

	constructor() {

		// https://developers.google.com/maps/documentation/javascript/examples/polyline-complex?hl=de
		// JSON.stringify(poly.getPath().getArray())
		this.routes = [
			{
				"line": "6",
				"waypoints": [{"lat":47.55112961798061,"lng":7.536535263061523},{"lat":47.55188270099466,"lng":7.539088726043701},{"lat":47.55236061344829,"lng":7.5400543212890625},{"lat":47.55296885935877,"lng":7.542157173156738},{"lat":47.55251991663103,"lng":7.544989585876465},{"lat":47.55166546662039,"lng":7.548401355743408},{"lat":47.55254888079405,"lng":7.549645900726318},{"lat":47.55338883455778,"lng":7.5520920753479},{"lat":47.55482251763861,"lng":7.555868625640869},{"lat":47.55718294068955,"lng":7.559173107147217},{"lat":47.557820091876835,"lng":7.560632228851318},{"lat":47.5577911306273,"lng":7.561683654785156},{"lat":47.557110536655316,"lng":7.563807964324951},{"lat":47.55709605583646,"lng":7.564988136291504},{"lat":47.55738567145322,"lng":7.570245265960693},{"lat":47.55724086384494,"lng":7.5705671310424805},{"lat":47.55632856671012,"lng":7.572176456451416},{"lat":47.555575547585136,"lng":7.5756096839904785},{"lat":47.55466322145552,"lng":7.579450607299805},{"lat":47.55354813461487,"lng":7.582046985626221},{"lat":47.552512675587785,"lng":7.584439516067505},{"lat":47.55180304849531,"lng":7.586660385131836},{"lat":47.55129616611763,"lng":7.586982250213623},{"lat":47.55113685921494,"lng":7.587615251541138},{"lat":47.55165822545907,"lng":7.588945627212524},{"lat":47.55241854193442,"lng":7.5897181034088135},{"lat":47.55342503915874,"lng":7.589857578277588},{"lat":47.55394638263902,"lng":7.590039968490601},{"lat":47.55414188510692,"lng":7.589074373245239},{"lat":47.554692184433925,"lng":7.589138746261597},{"lat":47.55506870169635,"lng":7.589374780654907},{"lat":47.556524060290485,"lng":7.588881254196167},{"lat":47.55678471726302,"lng":7.588376998901367},{"lat":47.557718727433475,"lng":7.587872743606567},{"lat":47.55861651996539,"lng":7.587239742279053},{"lat":47.55920297290943,"lng":7.587218284606934},{"lat":47.55998489995701,"lng":7.587926387786865},{"lat":47.5596156580832,"lng":7.588602304458618},{"lat":47.56082473452818,"lng":7.591134309768677},{"lat":47.56117224834381,"lng":7.592035531997681},{"lat":47.56163559651221,"lng":7.593441009521484},{"lat":47.56195414600083,"lng":7.5946104526519775},{"lat":47.56348170867821,"lng":7.599309682846069},{"lat":47.56347446914972,"lng":7.599513530731201},{"lat":47.564075346609776,"lng":7.601863145828247},{"lat":47.56458934475055,"lng":7.6031506061553955},{"lat":47.5665801350218,"lng":7.607206106185913},{"lat":47.56602272137253,"lng":7.607946395874023},{"lat":47.56694932780969,"lng":7.610574960708618},{"lat":47.567152020782764,"lng":7.6110148429870605},{"lat":47.568816969091905,"lng":7.613847255706787},{"lat":47.57001859455327,"lng":7.616153955459595},{"lat":47.571343246095424,"lng":7.618675231933594},{"lat":47.57255205187078,"lng":7.625284194946289},{"lat":47.57289224966248,"lng":7.627526521682739},{"lat":47.57287777320574,"lng":7.629071474075317},{"lat":47.57374635352771,"lng":7.632354497909546},{"lat":47.573999686741224,"lng":7.632654905319214},{"lat":47.57551966028563,"lng":7.634178400039673},{"lat":47.57580193622905,"lng":7.634543180465698},{"lat":47.576887598753125,"lng":7.637579441070557},{"lat":47.57753898546278,"lng":7.638823986053467},{"lat":47.57823378902109,"lng":7.639607191085815},{"lat":47.57888515898335,"lng":7.640883922576904},{"lat":47.579203603571166,"lng":7.641119956970215},{"lat":47.58012273958633,"lng":7.641184329986572},{"lat":47.580831983119445,"lng":7.641817331314087},{"lat":47.58162082433416,"lng":7.643212080001831},{"lat":47.58193201530544,"lng":7.644714117050171},{"lat":47.58243136439364,"lng":7.646859884262085},{"lat":47.582735313680566,"lng":7.64773964881897},{"lat":47.58431292686543,"lng":7.649370431900024},{"lat":47.58484843612878,"lng":7.649939060211182},{"lat":47.58621613086989,"lng":7.650561332702637},{"lat":47.58688911040184,"lng":7.650893926620483},{"lat":47.58749695544523,"lng":7.651097774505615},{"lat":47.5887922207395,"lng":7.65196681022644},{"lat":47.589783547382545,"lng":7.651870250701904},{"lat":47.59191809210176,"lng":7.6531147956848145},{"lat":47.594580724151726,"lng":7.6551854610443115}]
			}
		];

		this._calculate();

	}

	_calculate() {
		for(var i = 0; i < this.routes.length; i++) {
			console.log('line ' + this.routes[i].line + ' initialized (' + this.routes[i].waypoints.length + ' waypoints)');
			var totDistance = 0;
			var distance = 0;
			for(var x = 0; x < this.routes[i].waypoints.length; x++) {
				// distance
				if(x>0) { // skip first entry
					distance = helper.getDistanceFromLatLonInKm(this.routes[i].waypoints[x-1], this.routes[i].waypoints[x]);
					this.routes[i].waypoints[x-1].distance = distance;
					totDistance += distance;
				}
				this.routes[i].waypoints[x].distance_total = totDistance;
			}
		}
	}

	getRoute(line) {
		var result = this.routes.find(function(e){ return e.line == line; });
		return result;
	}
}

module.exports = routes;