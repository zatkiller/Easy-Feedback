const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy; // has inernal identifier of google
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users"); //Fetch something from mongoose

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

//google strategy requires client id and client secret
passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: "/auth/google/callback", //relative path causes http address
			proxy: true,
		},
		async (accessToken, refreshToken, profile, done) => {
			const existingUser = await User.findOne({ googleId: profile.id }); //Query to check if user already exists, query returns a promise

			if (existingUser) {
				// Record exists
				return done(null, existingUser);
			}

			//New user, no record of user
			const user = await new User({ googleId: profile.id }).save();
			done(null, user);
			//done used when finished
		}
	)
);
