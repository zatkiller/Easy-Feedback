const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');


const Survey = mongoose.model("surveys");

module.exports = (app) => {
	app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
		const { title, subject, body, recipients } = req.body;

		const survey = new Survey({
			title,
			subject,
			body,
			recipients: recipients.split(',').map(email => ({ email: email.trim() })),
			_user: req.user.id,
			dateSent: Date.now()
		});

		const mailer = new Mailer(survey, surveyTemplate(survey));
		try {
			await mailer.send();
			await survey.save();
			req.user.credits -= 1;
			const user = await req.user.save();

			res.send(user);
		} catch (err) {
			res.status(422).send(err);
		}

		// 	try {
		// 		Mailer(survey, surveyTemplate(survey));
		// 		await survey.save(); // mongoose
		// 		req.user.credits -= 1;
		// 		const user = await req.user.save();

		// 		res.send(user); // Update via mongoose
		// 	}
	});

	app.get('/api/surveys/:surveyId/:choice', (req, res) => {
		res.send("Thank you for voting!");
	});

	app.post('/api/surveys/webhooks', (req, res) => {

		const p = new Path('/api/surveys/:surveyId/:choice');

		_.chain(req.body)//chain is from lodash, allows chaining of lodash functions
			.map(({ email, url }) => {
				const match = p.test(new URL(url).pathname);
				if (match) {
					return { email, surveyId: match.surveyId, choice: match.choice };
				}
			})
			.compact() //from lodash libraries, only return objects, no undefined
			.uniqBy('email', 'surveyId')
			.each(({ surveyId, email, choice }) => {
				Survey.updateOne( //query that will run inside MongoDB, not in Node, ;pls through survey email
					{ //Find the record with this details
						_id: surveyId, //mongo Idis assigned _id
						recipients: {
							$elemMatch: { email: email, responded: false }
						}
					},
					{ //$ is mongo operator for querying
						//choice is always yes or no
						$inc: { [choice]: 1 }, //increment by 1, [choice] is not an array. es6 syntax that evaluates to yes or no
						$set: { 'recipients.$.responded': true }, ///$ sign here is the index found by $elemMatch
						lastResponded: new Date()
					}
				).exec();
			})
			.value(); //returns the value
		//Async function but no need to wait for this to return to complete the function


		res.send({});

		// const events = _.map(req.body, ({ email, url }) => { // from event props
		// 	const pathname = new URL(url).pathname;//get pathname only
		// 	const p = new Path('/api/surveys/:surveyId/:choice');
		// 	const match = p.test(pathname);
		// 	if (match) {
		// 		return { email, surveyId: match.surveyId, choice: match.choice };
		// 	}

		// 	const compactEvents = _.compact(events);
		// 	const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId')

		// 	console.log(uniqueEvents)

		// 	res.send({})
		// })
	});
};
