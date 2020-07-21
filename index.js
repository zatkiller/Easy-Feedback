const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
const cors = require("cors");

require("./models/User");
require("./services/passport"); //passport Configs

mongoose.connect(keys.mongoURI);

const app = express();

app.use(cors());
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

const PORT = process.env.PORT || 5000; // environment variable
app.listen(PORT);
