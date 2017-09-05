var accountSid = 'AC404a8e9e902b5edc9630db87b616c90f'; // PROD SID
var authToken = 'ae4f830464c447ea84c5fd92200dd7db';   // PROD AUTH TOKEN
//var accountSid = 'ACfe6cddbc680a08fe910739be2cdd3a2b'; // TEST SID
//var authToken = 'c0ff0b41f9a529d14accba9aa9683d86';   // TEST AUTH TOKEN
var schedule	= require('node-schedule');
var twilio		= require('twilio');
var https		= require('https');
var request		= require('request');;
var schedule 	= require('node-schedule');
var client		= new twilio(accountSid, authToken);

var longitude = 36.148;
var lattitude = -86.805;

var notifyUser = function(rainChance) {
	client.messages.create({
		body: 'Hey! Don\'t forget an umbrella, it might rain in Nashville today',
		to: '+12028218823',  // Text this number
		from: '+12408835505' // From a valid Twilio number
	})
		.then((message) => console.log(message.sid));
};

var checkWeather = function(latitude, longitude) {
	request("https://api.darksky.net/forecast/290fbcd3beaff129c4391e061512c930/" + latitude + "," + longitude, function (error, response, body) {
		console.log('error:', error); // Print the error if one occurred 
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 

		var json = JSON.parse(body);
		var hourlyArr = json.hourly.data;
		var rainFlag = false;
		
		for (var i = 0; i < 12; i++) {
			if (hourlyArr[i].precipProbability > 0.15 || hourlyArr[i].precipIntencity > 0.1 || hourlyArr[i].icon == "rain") {
				console.log("User successfully notified");
				notifyUser();
				rainFlag = true;
				return;
			}
		}
		if (!rainFlag) {
			console.log("It is not going to rain in the next 12 hours");
		}
		return rainFlag;
	});
};

var j = schedule.scheduleJob('0 40 10 * * *', function(){
  checkWeather(longitude, lattitude);
});