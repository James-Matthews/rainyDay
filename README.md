# rainyDay
Scheduled task node server that updates users via text message when it is going to rain to remember to bring a rain coat.  The reminders are sent whenever the user desires (usually 10 minutes before leaving for work/school for the day)

Front end implemented with AngularJS and MaterializeCSS. It allows users to fill in their information and send a POST request to the server which then adds the data to the MongoDB.

Back end created in Node.js, leveraging several modules like twilio, node-schedule, express, request, and body-parser.  It handles the requests from the front end and hits the weather API to determine when to send text alerts.
