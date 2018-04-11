/* node.offsetWidth(); */
let chicago_rest = []
let coor

function setupChart(){
	for(let i=0; i<chicago_rest.length; i++){
		let index = chicago_rest[i]
		let str = ""
		for(let j=0; j<index.categories.length; j++){
			str += index.categories[j].alias + ","
		}
		index.categories = str
	}
	console.log(JSON.stringify(chicago_rest))

	// create map object, tell it to live in 'map' div and give initial latitude, longitude, zoom values
	// pass option to turn scroll wheel zoom off
	var mymap = L.map('mapid').setView([coor.latitude, coor.longitude], 15);

	/* Red-Yellow style:
	L.tileLayer('https://api.mapbox.com/styles/v1/bzjin/cje35oxjz58bg2so9a55n3uan/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnpqaW4iLCJhIjoiY2lyZ2Y2YzQwMDBhZGdlbm5jeWd4bW5xdiJ9.6focl_u481ea4df6CJg41w', {
	Greyscale style:
	https://api.mapbox.com/styles/v1/bzjin/cirkygs990005g2mbdt2ubxfo/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnpqaW4iLCJhIjoiY2lyZ2Y2YzQwMDBhZGdlbm5jeWd4bW5xdiJ9.6focl_u481ea4df6CJg41w
	*/
	L.tileLayer('	https://api.mapbox.com/styles/v1/bzjin/cirkygs990005g2mbdt2ubxfo/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnpqaW4iLCJhIjoiY2lyZ2Y2YzQwMDBhZGdlbm5jeWd4bW5xdiJ9.6focl_u481ea4df6CJg41w', {
	id: "pk.eyJ1IjoiYnpqaW4iLCJhIjoiY2lyZ2Y2YzQwMDBhZGdlbm5jeWd4bW5xdiJ9.6focl_u481ea4df6CJg41w",
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	maxZoom: 17,
	minZoom: 14,
	}).addTo(mymap);

	//Scroll controls
	mymap.scrollWheelZoom.disable();

	mymap.on('click', function() {
		if (mymap.scrollWheelZoom.enabled()) {
			mymap.scrollWheelZoom.disable();
			}
			else {
			mymap.scrollWheelZoom.enable();
			}
		});

	for (let i = 0; i < chicago_rest.length; i++){
		let d = chicago_rest[i]
		let lat = d.coordinates.latitude
		let lon = d.coordinates.longitude

		if (!(lat == null || lon == null)){
			var circle = L.circle([lat, lon], 10,
				{color:'red',
				opacity:1,
				fillColor: 'red',
				fillOpacity:.4,
				weight: 1
				})
				.addTo(mymap);

			circle.bindPopup(function(){
				var str = "<br> <img class='popup_img' src='" + d.image_url + "'/>"
				+ "<b><a href='" + d.url + "'>" + d.name + "</a>"
				return str
			});
		}

	}


}

function updateCharts(){

}

function updateDimensions() {
}

function resize() {
	updateDimensions();
	updateCharts()
}

function init() {
	const path = 'assets/data/chicago-';
	const files = ['0', '1', '2', '3', '4', '5'].map(d => `${path}${d}.json`);

	d3.loadData(...files, (err, response) => {
		for (let i = 0; i < response.length; i++){
			chicago_rest = chicago_rest.concat(response[i].businesses)
		}

		coor = response[0].region.center

		setupChart();
		resize();
	})

}

export default { init, resize };
