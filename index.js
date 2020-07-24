const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");

require("./models/User");
require("./services/passport"); //passport Configs

mongoose.connect(keys.mongoURI);

const app = express();

app.use(express.json());
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000, //milli seconds
		keys: [keys.cookieKey], //encrypted key
	})
);

//Tell passport to use cookkies for authentication
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);

if (process.env.NODE_ENV === 'production') {
	// Express will serve up production assets like main.js file
	app.use(express.static('client/build'));

	// If it doesn't recognize the route, express will serve up the index.html file
	const path = require('path');
	app.get('*', (req, res) => {
		//Catch all case when all previous cases fail
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000; // environment variable
app.listen(PORT);
