/* eslint-env: mocha */

require("babel-core/register");

const regexes = require("./regexes");

global.fetch = require("node-fetch");
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const mockery = require("mockery");

mockery.enable({
	warnOnReplace: false
});

mockery.registerMock("react-native", require("../mocks/react-native"));

const embed = require("./oembed").fetchData,
	assert = require("assert");


describe("oembed : ", function () {
	this.timeout(50000);
	it("should return correct oembedlink data : ", function () {
		return embed("https://www.youtube.com/watch?v=uVdV-lxRPFo").then((text) => {
			assert(text.title === "Captain America: Civil War - Trailer World Premiere", "title is different");
			assert(text.type === "video", "it is not returning type video");
			assert(text.width === 480 , "bad width length");
			assert(text.height === 270 , "bad height length");
		}).catch(function(err) {
			//
		});
	});

	it("should return correct opengraph data : ", function() {
		return embed("http://on.aol.com/video/officials-fox-lake-officer-s-death-a-suicide-519216799?context=PC:homepage:PL1944:1446706878971").then((text) => {
			assert(text.title === "Officials: Fox Lake Officer&#x27;s Death a Suicide");
			assert(text.type === "video", "It is not returning the article");
			assert(text.thumbnail_url === "http://feedapi.b2c.on.aol.com/v1.0/app/videos/aolon/519216799/images/470x264.jpg?region=US", "it is not returning the string");
			assert(text.width === "470");
			assert(text.height === "264");
		}).catch(function(err) {
			//
		});
	});

	it("should return correct meta data : ", function() {
		return embed("http://www.w3schools.com/").then((text) => {
			assert(text.title === "W3Schools Online Web Tutorials");
		}).catch(function(err) {
			//
		});
	});

	it("should return correct image data : ", function(){
		return embed("http://1.images.comedycentral.com/images/shows/GetSpooked/getspooked_thumbnail.jpg?width=640&height=360&crop=true").then((text) => {
			assert(text.type === "image", "it should have image type");
			assert(text.thumbnail_url === "http://1.images.comedycentral.com/images/shows/GetSpooked/getspooked_thumbnail.jpg?width=640&height=360&crop=true");
		}).catch(function(err) {
			//
		});
	});
});


describe("tests for regex : ", function(){

	const link = regexes.link;
	const meta = regexes.propertyRegex("type");
	const cont = regexes.content;

	it("testing link regex : ", function() {
		const test1 = "<link>".match(link);
		const test2 = "<link type='application/json+oembed'".match(link);
		const test3 = "<link something type='application/json+oembed'>".match(link);
		const test4 = "<link something type='application/json+oembed' something>".match(link);

		assert(test1 === null, "the value should be null");
		assert(test2 === null, "the value should be null");
		assert(test3 !== null, "the value should not be null");
		assert(test4 !== null, "the value should not be null");
	});
	it("testing link and href regex : ", function() {
		const href = regexes.matchHTTP;
		const test1 = "<link href='http://manoj' type='application/json+oembed'>".match(link)[0].match(href);
		const test2 = "<link type='application/json+oembed' href='https://manoj' >".match(link)[0].match(href);
		const test3 = "<link something type='application/json+oembed'>".match(link)[0].match(href);

		assert(test1 !== null, "the value should not be null test1");
		assert(test2 !== null, "the value should not be null test2");
		assert(test3 === null, "the value should be null");
	});
	it("testing meta regex : ", function() {
		const test1 = "<meta>".match(meta);
		const test2 = "<meta property='og:time'>".match(meta);
		const test3 = "<meta manoj property='og:type' content='some'>".match(meta);

		assert(test1 === null, "the value of the test1 should be null");
		assert(test2 === null, "the value of the test2 should be null");
		assert(test3 !== null, "the value of the test3 should not be null");
	});
	it("testing meta with content regex : ", function() {
		const test1 = "<meta manoj property='og:type' content='some'>".match(meta)[0].match(cont);
		const test2 = "<meta content='some'manoj property='og:type'>".match(meta)[0].match(cont);

		assert(test1 !== null, "the value of test1 should not be null");
		assert(test2 !== null, "the value of test2 should not be null");
	});
});
