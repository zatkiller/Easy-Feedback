const mongoose = require("mongoose");
const { Schema } = mongoose; //Schema makes sure mongoose knows all the attributes available in the DB

const userSchema = new Schema({
	googleId: String,
	credits: { type: Number, default: 0 },
});

mongoose.model("users", userSchema); //Tells mongoose to create a new collection in the database
