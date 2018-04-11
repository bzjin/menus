const $div = d3.select('.part1-chinese');
const $prob = d3.select('.part1-probability');
const $prob2 = d3.select('.part1-probability2');

const $divA = d3.select('.part1a');
const $divB = d3.select('.part1b');

const $segway = $div.select('.graphic');
const $probs = $prob.select('.graphic');
const $probs2 = $prob2.select('.graphic');

const $graphic = $divA.select('.graphic');
const $graphic1 = $divB.select('.graphic');

let bigrams = null
let nested = null
	//$lightyellow = #F5C162
	//$darkyellow = #ECA94A
let width = d3.select('.graphic').node().offsetWidth

function setupChart(upper_bound){
	// OTHER MENUS
	for (let i = 0; i < 100; i++){
		//var i = k + Math.floor(Math.random()*23)
			let $menu = null
			if (sections.asian.includes(nested[i].key)){
				if (nested[i].key == "Chinese"){
					$menu = $segway.append("div.menu")
					createMenu()
					probMenu()
				}
				$menu = $graphic.append("div.menu")
				createMenu()
			} else if (sections.other.includes(nested[i].key)){
				if (nested[i].key == "American"){
					probMenu2()
				}
				$menu = $graphic1.append("div.menu")
				createMenu()
			}

			function createMenu(){
				//let padding = 100
				//if (width > 800 && width < 1300) { padding = }
				$menu.append("p.menu-title").html(nested[i].key)
				$menu.append("p.menu-subtitle").html(totals[nested[i].key] + " restaurants")
				let table = $menu.append("svg")
				let limit = nested[i].values.length
				if (limit > 30) {limit = 30}
				let data_touse = nested[i].values.slice(0,limit)
				let menuwidth = $(".menu").width()

				table
					.at("class", "tables")
					.at("width", menuwidth)
					.at("height", limit * 13 + 20)
					.style("overflow", "visible")

				let xScale = d3.scaleLinear()
					.domain([0,1])
					.range([0, menuwidth/2])

				let xAxis = d3.axisTop(xScale)
					.tickValues([0, .25, .50, .75, 1])
					.tickSize(-(limit - 2) * 13)
					.tickFormat(d3.format(".0%"))

				let xG = table.append("g")
					.at("transform", "translate(100," + " 20)")
					.at("class", "grid")
					.style("stroke-dasharray", "3 3")
					.call(xAxis)
						.selectAll("text")
							.style("font-size", "12px !important")

				let yScale = d3.scaleBand()
					.domain(data_touse.map(a => a.bigram))
					.range([20, limit * 13])

				let yG = table.append("g")
					.at("class", "axis")
					.at("transform", "translate(" + (100) + ", 0)")
					.call(d3.axisLeft(yScale))
						.selectAll("text")
							.style("font-size", "12px !important")

				table.selectAll("rect.chart")
					.data(data_touse)
					.enter()
						.append("rect")
							.at("class", "bar-rect"  + " change" + i)
							.at("x", xScale(0) + 100)
							.at("y", d => yScale(d.bigram))
							.at("width", d => xScale(d.count/totals[d.category]))
							.at("height", 10)
							.style("fill", function(d){
								if (parseInt(d.count/totals[d.category]*100) > upper_bound) {
									return "#BF3841"
								} else { return "#ECA94A"}
							})


				let boundary = null
				let j = 0
				while (parseInt(nested[i].values[j].count/totals[nested[i].key]*100) > 30){
					boundary = j
					j++
				}
			}//end createMenu

			function probMenu(){
				for (let k = 0; k < 3; k++){
					let $oneMenu = $probs.append("div.rand-menu")
					$oneMenu.append("p.rand-menu-title").html("Random Menu #" + (k+1))
					for (let j=0; j < nested[i].values.length; j++){
						var item = nested[i].values[j].bigram
						var percent = nested[i].values[j].count/totals[nested[i].key]
						if (Math.random() < +percent && +percent > .30){
							$oneMenu.append("p.random").html(item)
						}
					}//for loop
				}
			}// probMenu

			function probMenu2(){
				for (let k = 0; k < 3; k++){
					let $oneMenu = $probs2.append("div.rand-menu2")
					$oneMenu.append("p.rand-menu-title").html("Random Menu #" + (k+1))
					for (let j=0; j < 30; j++){
						var item = nested[i].values[j].bigram
						var percent = nested[i].values[j].count/totals[nested[i].key]
						if (Math.random() < percent){
							$oneMenu.append("p.random").html(item)
						}
					}//for loop
				}
			}// probMenu

			d3.select("#shuffle").on("click", function(){
				$(".rand-menu").remove()
				for (let k = 0; k < 3; k++){
					let $oneMenu = $probs.append("div.rand-menu")
					$oneMenu.append("p.rand-menu-title").html("Random Menu #" + (k+1))
					for (let j=0; j < 30; j++){
						var item = nested[0].values[j].bigram
						var percent = nested[0].values[j].count/totals[nested[0].key]
						if (Math.random() < +percent){
							$oneMenu.append("p.random").html(item)
						}
					}//for loop
				}
			})

			d3.select("#shuffle2").on("click", function(){
				$(".rand-menu2").remove()
				for (let k = 0; k < 3; k++){
					let $oneMenu = $probs2.append("div.rand-menu2")
					$oneMenu.append("p.rand-menu-title").html("Random Menu #" + (k+1))
					for (let j=0; j < 30; j++){
						var item = nested[2].values[j].bigram
						var percent = nested[2].values[j].count/totals[nested[2].key]
						if (Math.random() < +percent){
							$oneMenu.append("p.random").html(item)
						}
					}//for loop
				}
			})
	}
}



$("#myRange").on("input", function(){
		let val = $(this).val()
		$("#value").html(val + "%")

		updateChart(val)
});



function updateChart(upper_bound){
		d3.selectAll(".bar-rect").transition()
				.style("fill", function(d){
						if (parseInt(d.count/totals[d.category]*100) > upper_bound) {
							return "#BF3841"
						} else { return "#ECA94A"}
					})
}

function updateDimensions() {
	width = d3.select('.graphic').node().offsetWidth
	if (width > 800){
		let menuwidth = $(".menu").width()

		d3.selectAll(".tables").transition()
			.at("width", menuwidth)

		let xScale = d3.scaleLinear()
			.domain([0,1])
			.range([0, menuwidth/2])

		let xAxis = d3.axisTop(xScale)
			.tickValues([0, .25, .50, .75, 1])
			.tickSize(-(30 - 2) * 13)
			.tickFormat(d3.format(".0%"))

		d3.selectAll(".grid")
			.style("stroke-dasharray", "3 3")
			.call(xAxis)
				.selectAll("text")
					.style("font-size", "12px !important")

		d3.selectAll(".bar-rect").transition()
			.at("width", d => xScale(d.count/totals[d.category]))
		}
}

function resize() {
	updateDimensions()
	//updateChart()
}

function init() {
	const path = 'assets/data/';
	const files = ['finiti/shared_food', 'finiti/cuisine_count'].map(d => `${path}${d}.csv`);

	d3.loadData(...files, (err, response) => {
		bigrams = response[0]
		/*response[1].forEach(function(d){
			console.log('"' + d.cuisine + '":' + d.count + ",")
		})*/

		nested = d3.nest()
				.key(function(d) { return d.category; })
				.entries(bigrams)

		nested.sort(function(a,b){
			return +totals[b.key] - +totals[a.key]})

		nested.forEach(function(d){
			d.values.sort(function(a,b){ return b.count - a.count})

		})

		setupChart(30);
		resize();
	})

}

var totals = {
	"Home Cooking":1,
	"Spanish":8,
	"Chinese":139,
	"Caterers":40,
	"Asian":137,
	"Italian":53,
	"Mediterranean":27,
	"European":20,
	"Thai":18,
	"American":130,
	"Contemporary American":13,
	"Mexican":27,
	"Latin American":18,
	"Pizza":21,
	"Hamburgers and Hot Dogs":8,
	"Burgers":13,
	"Hot Dogs":5,
	"Continental":13,
	"Breakfast and Brunch":53,
	"Middle Eastern and African":1,
	"Middle Eastern":8,
	"Vegetarian":16,
	"Steakhouse":7,
	"Chicken":6,
	"Bar and Grills":8,
	"Dessert":5,
	"Steak Houses":3,
	"Healthy":11,
	"Greek":7,
	"Vegetarian Friendly":33,
	"Family Style":42,
	"Take Out":37,
	"Food Delivery Service":1,
	"Fast Food":35,
	"Delivery Service":3,
	"Delivery":3,
	"Sandwiches/Subs":1,
	"Desserts/Ice Cream":1,
	"Seafood":55,
	"Traditional American":14,
	"Southern":3,
	"Latin":5,
	"Southwestern":3,
	"Steak House":3,
	"American (Traditional)":1,
	"Coffee and Espresso":11,
	"Coffee Shops":18,
	"Coffee House":9,
	"Coffee and Tea":17,
	"Barbecue":10,
	"Bakery":7,
	"Natural and Organic Foods":3,
	"Deli and Sandwich":17,
	"Cafe":22,
	"Bar":42,
	"Dim Sum":16,
	"Mongolian":3,
	"Sushi":23,
	"Japanese":65,
	"Asian/Pacific":21,
	"Noodle Shop":6,
	"Gluten Free Options":11,
	"Southeast Asian":12,
	"Sandwich Shops":10,
	"Sandwiches":11,
	"Breakfast Brunch and Lunch":18,
	"Sports Bars":1,
	"Breakfast":14,
	"Brunch and Lunch":12,
	"Pubs":11,
	"Pub":10,
	"Soups":11,
	"Burger":1,
	"Diners":4,
	"Night Clubs":5,
	"Bars":9,
	"Cocktail Lounges":1,
	"Dance Clubs":1,
	"Contemporary Asian":1,
	"Lounge":1,
	"Vegan":3,
	"Health Food":5,
	"French":29,
	"Fine Dining":5,
	"Tapas / Small Plates":4,
	"Contemporary French / American":1,
	"Chain":4,
	"Sushi Bars":10,
	"Delicatessen":2,
	"Delicatessens":9,
	"Malaysian":3,
	"Vietnamese":10,
	"Vegan Options":12,
	"Ice Cream and Frozen Desserts":3,
	"Cafeterias":8,
	"Ice Cream":4,
	"Bagels":3,
	"Donut Shops":2,
	"Bakeries":5,
	"Donuts":2,
	"Deli":5,
	"Yogurt":2,
	"Diner":4,
	"Contemporary":3,
	"Beverages":2,
	"Fast food":1,
	"Bistro":2,
	"Bar Food":2,
	"Hawaiian":5,
	"Taverns":5,
	"Cheesesteak":1,
	"Hamburgers":4,
	"Korean":6,
	"Californian":12,
	"New American":3,
	"Food Trucks":1,
	"Southern / Soul":1,
	"Asian Fusion":2,
	"Fusion":5,
	"German":1,
	"Filipino":1,
	"Indian":11,
	"Gastro Pub":1,
	"Brasserie":1,
	"Comfort Food":3,
	"Brazilian Steakhouse":1,
	"Caribbean":2,
	"Cuban":1,
	"Banquet Halls and Reception Facilities":3,
	"Creole and Cajun":1,
	"Irish":9,
	"Supermarkets and Super Stores":1,
	"Kosher":1,
	"Brazilian":2,
	"South American":1,
	"Wine Bar":1,
	"Steak":1,
	"Fries":1,
	"Shakes":1,
	"Cajun/Creole":1,
	"Turkish":1,
	"Cambodian":1,
	"Taiwanese":2,
	"Meat Markets":1,
	"Ramen":1,
	"Juice and Smoothies":1,
	"Bubble Tea":1,
	"Grocery Stores":1,
	"Coffee and Tea-Wholesale and Manufacturers":1,
	"Provencal":1,
	"Omelets":1,
	"Ice Cream and Desserts":2,
	"Singaporean":1,
	"Crepes":1,
	"Polynesian":1,
	"Salad":1
}

var sections = {
	"asian": ["Chinese","Japanese","Thai","Indian","Vietnamese"],
	"other": ["American","Italian","French", "Mediterranean", "Mexican"]
}


export default { init, resize };
