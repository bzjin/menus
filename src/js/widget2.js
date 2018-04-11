const $div= d3.select('.widget2');
const $graphic = $div.select('.graphic');

let bigrams = null
let nested = null
let nested_cuisines = null
let most_shared = null
let foods = null
let top100 = null

let current = "asian"
let current_nb = 1

let xValues = {"asian": null, "other": null, "all": null}
let yValues = {"asian": null, "other": null, "all": null}
let yConcentration = {"asian": null, "other": null, "all": null}
let dataValues = {"asian": null, "other": null, "all": null}
let choices = ["asian", "other", "all"]

let width = d3.select('.prose-text').node().offsetWidth
let gwidth = d3.select('.prose-text').node().offsetWidth

let m = 25
let xScale = d3.scaleBand()
let yScale = d3.scaleBand()
let xAxis
let yAxis

let svg = $graphic.append("svg")

let xG = svg.append("g")
let yG = svg.append("g")

function setupChart(category, nb){
	m = 30
	if (width < 500){
		m = 15
	} else if (width < 600 && width >= 501) {
		m = 20
	} else {
		m = 30
	}

	var xDomain = xValues[category]
	var yDomain = yValues[category]

	xScale
			.domain(xDomain)
			.range([0, xDomain.length * (m+2)])

	yScale
		.domain(yDomain)
		.range([0, yDomain.length * (m+2)])

	xAxis = d3.axisTop(xScale)
	yAxis = d3.axisLeft(yScale)

	svg
		.at("width", xDomain.length * (m+2) + 200)
		.at("height", yDomain.length * (m+2) + 150)
		.style("overflow", "visible")

	xG
	.at("transform", "translate(120, 60)")
	.style("stroke-width", 0)
	.call(xAxis)
			.selectAll("text")
				.style("text-anchor", "start")
				.at("transform", function(){
					if (width < 640){
						return "rotate(-90) translate(3, 13)"
					} else {
						return "rotate(-55) translate(3, 10)"
					}
				})
				.style("font-size", 12)
				.style("font-weight", 700)


	yG
	.at("transform", "translate(120, 60)")
	.style("stroke-width", 0)
	.call(yAxis)
			.selectAll("text")
				.style("font-size", 12)
				.at("transform", "translate(4, 2)")
				.style("font-weight", 700)

}



function updateCharts(category, nb){
	sliceData(nb)
	d3.selectAll("text.widget2-svg").remove()
	d3.selectAll("rect.widget2-svg").remove()

	var xDomain = xValues[category]
	var yDomain = yValues[category]

	m = 30
	if (category == "all") {
		m = 20
	} else if (width < 500){
		m = 15
	} else if (width < 640 && width >= 501) {
		m = 25
	} else if (gwidth > 1300){
 		m = 30
 	}

	xScale
		.domain(xDomain)
		.range([0, xDomain.length * (m+2)])

	yScale
		.domain(yDomain)
		.range([0, yDomain.length * (m+2)])

	xAxis = d3.axisTop(xScale)
	yAxis = d3.axisLeft(yScale)

	svg
		.at("width", xDomain.length * (m+2) + 200)
		.at("height", 160)
		.at("class", category)
		.style("overflow", "visible")

	var tip = d3.tip()
		.offset([-20, 0])
		.attr("class", "d3-tip-heatmap")
		.html(function(bigram, category, count, total){
			var percent = parseInt(count * 100)
			//if (percent > 100) { percent = 100}
			return "<span class='bold'>" + bigram + "</span><br>Occurs in <span class='bold'>" + percent + "%</span> of <span class='bold'>" + total + " " + category + " </span>restaurants"})

	svg.call(tip)

	xG.transition()
		.call(xAxis)
			.selectAll("text")
				.style("text-anchor", "start")
				.at("transform", "rotate(-55) translate(3, 10)")
				.style("font-size", 12)
				.style("font-weight", 700)

	yG.transition()
		.call(yAxis)
		.selectAll("text")
			.style("font-size", 12)
			.at("transform", "translate(4, 2)")
			.style("font-weight", 700)

	dataValues[category].forEach(function(d){
		d.values.forEach(function(el){
			svg.append("rect")
				.at("class", "widget2-svg")
				.at("x", xScale(el.category) + 123)
				.at("y", yScale(el.bigram) + 63)
				.at("width", m)
				.at("height", m)
				.at("rx", 5)
				.at("ry", 5)
				.style("fill", function(){
					if(isNaN(xScale(el.category))) {
						return "none"}
					else return color(el.count/totals[el.category])})

				svg.append("text")
					.at("class", "h-text widget2-svg")
					.at("x", xScale(el.category) + 123 + m/2)
					.at("y", yScale(el.bigram) + 63 + m/2)
					.text(function(){
						//if (Math.sqrt(totals[el.category]) > 3) {
						return parseInt(el.count/totals[el.category] * 100)//}
					})
		})
	})
}

function updateDimensions() {
}

function resize() {
	width = d3.select('.prose-text').node().offsetWidth
	updateDimensions()
	updateCharts(current, current_nb)
}

function init() {
	const path = 'assets/data/';
	const files = ['finiti/shared_food'].map(d => `${path}${d}.csv`);

	d3.loadData(...files, (err, response) => {
		bigrams = response[0]
		sliceData(2)
		setupChart("asian", 2);
		resize();
	})
}

function sliceData(nb){
		let matched_bigrams = []
		let ordered_cuisines = []
		let matchup = []
		top100 = []
		let cuisine_key = []

			bigrams.forEach(function(d){
				if (sections["asian"].indexOf(d.category) > -1){
					matched_bigrams.push(d)
				}
			})

			nested = d3.nest()
				.key(function(d){ return d.bigram})
				.entries(matched_bigrams)

			nested.forEach(function(d){
				if (d.key == "chicken curry" || d.key == "egg roll" || d.key == "miso soup"){
					matchup.push({
						"food": d.key,
						"cuisines": d.values.length,
						"total": d3.sum(d.values.map(a => a.count)),
						"values": d.values
					})
				}
			})

			nested_cuisines = d3.nest()
				.key(function(d){ return d.category})
				.entries(matched_bigrams)

			nested_cuisines.forEach(function(d){
				ordered_cuisines.push({
					"cuisine": d.key,
					"count": totals[d.key]
				})
			})

			most_shared = matchup.sort(function(a,b){
				return +b.cuisines - +a.cuisines || +b.total - +a.total
			})

			ordered_cuisines = ordered_cuisines.sort(function(a,b){
				return +b.count - +a.count
			})

			top100 = most_shared
			foods = top100.map(a => a.food)
			cuisine_key = ordered_cuisines.map(a => a.cuisine)

			xValues["asian"] = cuisine_key
			yValues["asian"] = foods
			dataValues["asian"] = top100

}

var range = ["#F5C162","#fd8d3c","#fc4e2a","#bd0026","#800026"];

var color = d3.scaleQuantile()
	.domain([0, 0.1, 0.2, 0.3, 0.4, .5])
	.range(range)

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