require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const morgan = require("morgan");

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

const app = express();
app.use(formidable());
app.use(cors());
app.use(morgan("dev"));

app.post("/form", (req, res) => {
  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname}  <${req.fields.email}>`,
    to: "ludosix@gmail.com",
    subject: "TripAdvisor - Prise de contact",
    text: req.fields.message,
  };

  try {
    mailgun.messages().send(data, (error, body) => {
      if (!error) {
        return res.json({
          status: "success",
          message: "Message envoyé avec succès !",
        });
      } else {
        return res.json({
          status: "error",
          message:
            "Une erreur est survenue lors de l'envoi de l'email, veuillez réessayer plus tard.",
        });
      }
    });
  } catch (error) {
    return res.json({
      status: "error",
      message:
        "Une erreur est survenue lors de l'envoi de l'email, veuillez réessayer plus tard.",
    });
  }
});

app.get("/", (req, res) => {
  console.log("Route /");
  return res.json({ message: "Bienvenue sur mon serveur dédié au formulaire" });
});

app.all("*", (req, res) => {
  return res.json({ message: "All routes" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
