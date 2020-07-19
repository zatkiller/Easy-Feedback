const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy; // has inernal identifier of google
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users"); //Fetch something from mongoose

//google strategy requires client id and client secret
passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: "/auth/google/callback",
		},
		(accessToken, refreshToken, profile, done) => {
			console.log("access token", accessToken);
			console.log("refresh token", refreshToken);
			console.log("profile", profile);
			new User({
				googleId: profile.id,
			}).save();
		}
	)
);
