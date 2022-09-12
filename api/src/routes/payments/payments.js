require("dotenv").config();
const {Router} = require('express');
const axios = require('axios');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51LfBfGH8GSChtV84Al5MVXVlaqwTJi8mnNXKxrfkPZ1XcBg4wnYvrQqGSdMJZiFCzead3KQ7XAve9r1KHWPcfN2h00gaHi5Soe');

const router = Router();

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

    console.log(payment);
    return res.status(200).json({ message: "Successful Payment" });
  } catch (error) {
    return res.status(400).json({ message: error.raw.message });
  }
})

module.exports = router;