const sgMail = require('@sendgrid/mail'); //Pode package
const keys = require('../config/keys');

module.exports = async ({ subject, recipients }, content) => {
    // using SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    sgMail.setApiKey(keys.sendGridKey);
    const formattedRecipients = recipients.map(({ email }) => email);
    const msg = {
        to: formattedRecipients,
        from: "gheedylan@yahoo.com.sg",
        subject: subject,
        html: content,
    };
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
}

//Old API
// const sendgrid = require('sendgrid');
// const helper = sendgrid.mail;
// const keys = require('../config/keys');

// class Mailer extends helper.Mail {
//     constructor({ subject, recipients }, content) {
//         super();

//         this.sgApi = sendgrid(keys.sendGridKey);
//         this.from_email = new helper.Email('no-reply@emaily.com');
//         this.subject = subject;
//         this.body = new helper.Content('text/html', content);
//         this.recipients = this.formatAddresses(recipients);

//         this.addContent(this.body); //add to the Mailer, add Content is a built in helper function from helper.Mail
//         this.addClickTracking();
//         this.addRecipients();
//     }

//     formatAddresses(recipients) {
//         return recipients.map(({ email }) => {
//             return new helper.Email(email);
//         });
//     }

//     addClickTracking() {
//         const trackingSettings = new helper.TrackingSettings();
//         const clickTracking = new helper.ClickTracking(true, true);

//         trackingSettings.setClickTracking(clickTracking);
//         this.addTrackingSettings(trackingSettings);
//     }

//     addRecipients() {
//         const personalize = new helper.Personalization();

//         this.recipients.forEach(recipient => {
//             personalize.addTo(recipient);
//         });

//         this.addPersonalization(personalize);
//     }

//     async send() {
//         console.log("Sent")
//         const request = this.sgApi.emptyRequest({
//             method: 'POST',
//             path: '/v3/mail/send',
//             body: this.toJSON()
//         });

//         const response = await this.sgApi.API(request).catch(err => console.log(err))
//         return response;
//     }
// }
// module.exports = Mailer;
