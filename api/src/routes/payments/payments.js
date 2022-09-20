require("dotenv").config();
const {Router} = require('express');
const Stripe = require('stripe');
const stripe = new Stripe(`${process.env.STRIPE_SECRET}`);
const nodemailer = require('nodemailer');
const { validateToken } = require("../tokenController");

const router = Router();

const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'QatarBets2022@gmail.com', // generated ethereal user
        pass: 'pcuclpxdckaayvbw', // generated ethereal password
      },
    });

router.post('/', async (req, res, next) => {

  const { id, amount } = req.body;
  const token = validateToken(req.cookies.acces_token || '');
  if (token === '') {
    res.json('Usuario invalido');
  }
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "BET",
      payment_method: id,
      confirm: true,
    });

    await transporter.sendMail({
      from: '"QatarBets" <QatarBets2022@gmail.com>', //Emisor
      to: token.email, //Receptor
      subject: "Mail Verification", //Asunto
      html: `<b>Has realizado una apuesta de ${amount}</b>`, //Texto del mail
    });
    
    return res.status(200).json({ message: "Successful Payment" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
})

module.exports = router;