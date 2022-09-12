require("dotenv").config();
const {Router} = require('express');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51LfBfGH8GSChtV84Al5MVXVlaqwTJi8mnNXKxrfkPZ1XcBg4wnYvrQqGSdMJZiFCzead3KQ7XAve9r1KHWPcfN2h00gaHi5Soe');
const nodemailer = require('nodemailer');

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
      to: email, //Receptor
      subject: "Mail Verification", //Asunto
      html: `<b>Has realizado una apuesta de ${amount}</b>`, //Texto del mail
    });
    
    console.log(payment);
    return res.status(200).json({ message: "Successful Payment" });
  } catch (error) {
    return res.status(400).json({ message: error.raw.message });
  }
})

module.exports = router;