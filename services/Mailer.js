const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");

class Mailer extends sgMail {
  constructor({ subject, recipients }, content) {
    super();

    this.sgApi = keys.sendGridKey;
    this.from_email = new sgMail.Email("no-reply@stoutlabs.com");
    this.subject = subject;
    this.body = new sgMail.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients);

    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new sgMail.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new sgMail.Trackingsettings();
    const clickTracking = new sgMail.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new sgMail.Personalization();
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  async send() {
    const request = "";
  }
}

module.exports = Mailer;
