var accountSid = 'AC404a8e9e902b5edc9630db87b616c90f'; // PROD SID
var authToken = 'ae4f830464c447ea84c5fd92200dd7db';   // PROD AUTH TOKEN
//var accountSid = 'ACfe6cddbc680a08fe910739be2cdd3a2b'; // TEST SID
//var authToken = 'c0ff0b41f9a529d14accba9aa9683d86';   // TEST AUTH TOKEN

// Load mongoose package
var mongoose = require('mongoose');
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://localhost/RainyDay');

var schedule	= require('node-schedule');
var request		= require('request');
var twilio		= require('twilio');
var client		= new twilio(accountSid, authToken);
const express	= require('express');
var bodyParser	= require('body-parser');
const app		= express();
app.use(bodyParser.json());

// Create a schema
var notificationSchema = new mongoose.Schema({
	recipient: String,
	hour: [],
	minute: []
});
// Create a model based on the schema
var Notification = mongoose.model('Notification', notificationSchema);
var reminders = [];

var longitude = 36.148;
var lattitude = -86.805;

app.get('/', function (req, res) {
	res.send('Hello World!')
})

app.post('/', function (req, res) {
	console.log(req.body);

	var reqHour = [];
	var reqMin = [];
	for (var i = 0; i < 5; i++) {
		if (req.body.data[i] != '') {
			reqHour.push(req.body.data[i].substring(0, 2));
			reqMin.push(req.body.data[i].substring(3, 5));
		} else {
			reqHour.push('-1');
			reqMin.push('-1');
		}
	}
	// Create a user in memory
	var testNotification = new Notification({recipient: req.body.recipient, hour: reqHour, minute: reqMin});
	// Save it to database
	testNotification.save(function(err){
		if(err)
			console.log(err);
		else
			console.log(testNotification);
	});
	res.send('Nice Post');
})

app.listen(3000, function () {
	console.log('Rainy Day server listening on port 3000!')
})

var jobList = [];

var notifyUser = function(recipient) {
	client.messages.create({
		body: 'Hey! Don\'t forget an umbrella, it might rain in Nashville today',
		to: recipient,  // Text this number
		from: '+12408835505' // From a valid Twilio number
	})
		.then((message) => console.log(message.sid));
};

var checkWeather = function(latitude, longitude, recipient) {
	request("https://api.darksky.net/forecast/290fbcd3beaff129c4391e061512c930/" + latitude + "," + longitude, function (error, response, body) {
		console.log('error:', error); // Print the error if one occurred 
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 

		var json = JSON.parse(body);
		var hourlyArr = json.hourly.data;
		var rainFlag = false;

		for (var i = 0; i < 12; i++) {
			if (hourlyArr[i].precipProbability > 0.15 || hourlyArr[i].precipIntencity > 0.1 || hourlyArr[i].icon == "rain") {
				console.log("User successfully notified");
				notifyUser(recipient);
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

Notification.find(function (err, notifications) {
	if (err) return console.error(err);
	reminders = notifications;

	reminders.forEach(function(user) {
		for (var i = 0; i < 7; i++) {
			var j = schedule.scheduleJob(user.minute[i] + ' ' + user.hour[i] + ' * * ' + i.toString(), function() {
				checkWeather(longitude, lattitude, user.recipient);
			});
			console.log('adding job ' + user.recipient + '-' + i.toString() + ' to queue');
			jobList.push(j);
		}
	});
});