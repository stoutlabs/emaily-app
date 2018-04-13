const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
//const Mailer = require("../services/Mailer");
const sgMail = require("@sendgrid/mail");
const keys = require("../config/keys");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = app => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({ recipients: false });
    res.send(surveys);
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for your input!");
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    const p = new Path("/api/surveys/:surveyId/:choice");

    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      .compact()
      .uniqBy("email", "surveyId")
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();

    res.send({});
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const formattedRecipients = recipients.split(",").map(email => ({
      email: email.trim()
    }));

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: formattedRecipients,
      _user: req.user.id,
      dateSent: Date.now()
    });

    //send email
    //const mailer = new Mailer(survey, surveyTemplate);
    //mailer.send();
    try {
      sgMail.setApiKey(keys.sendGridKey);
      const msg = {
        to: formattedRecipients,
        subject,
        from: "no-reply@stoutlabs.com",
        text: body,
        html: surveyTemplate(survey),
        templateId: "85a8df89-8cf3-4613-ab28-584ada3de9fa"
      };
      await sgMail
        .sendMultiple(msg)
        .then(() => {
          console.log("sent!");
          //Promise.resolve();
        })
        .catch(e => {
          console.log(e);
        });

      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      console.log(user);
      res.send(user);
    } catch (e) {
      res.status(422).send(err);
    }
  });
};
