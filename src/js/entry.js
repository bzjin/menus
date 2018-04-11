// D3 is included by globally by default
import debounce from 'lodash.debounce';
import isMobile from './utils/is-mobile';
import part1 from './part1';
import widget from './widget';
import widget2 from './widget2';
import test from './test';
import testA from './testA';

const bodySel = d3.select('body');
let previousWidth = 0;

function resize() {
	const width = bodySel.node().offsetWidth;
	if (previousWidth !== width) {
		previousWidth = width;
		part1.resize();
		widget.resize();
		widget2.resize();
		test.resize();
		testA.resize();
	}
}

function init() {
	// add mobile class to body tag
	bodySel.classed('is-mobile', isMobile.any());
	// setup resize event
	window.addEventListener('resize', debounce(resize, 150));
	// kick off graphic code
	part1.init();
	widget.init();
	widget2.init();
	test.init();
	testA.init();
}

init();
