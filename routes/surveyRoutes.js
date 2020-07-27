const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model("surveys");

module.exports = (app) => {
	app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
		const { title, subject, body, recipients } = req.body; //req from front end

		const survey = new Survey({
			title, //ES6 syntax
			subject,
			body,
			recipients: recipients
				.split(",")
				.map((email) => ({ email: email.trim() })), //trim to remove whitespace
			_user: req.user.id,
			dateSent: Date.now(),
		});

		//Sending email
		const mailer = new Mailer(survey, surveyTemplate(survey));
	});
};
