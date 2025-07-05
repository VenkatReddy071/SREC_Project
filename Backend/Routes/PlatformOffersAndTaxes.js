const express=require("express");
const router = express.Router();
const Offer = require('../models/PlatformOffers');


router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({});
    res.status(200).json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/', async (req, res) => {
  const { name, type, value, applicableTo, startDate, endDate } = req.body;

  if (!name || !type || !value || !startDate || !endDate) {
    return res.status(400).json({ message: 'Please enter all required fields for the offer.' });
  }

  try {
    const newOffer = new Offer({
      name,
      type,
      value,
      applicableTo,
      startDate,
      endDate
    });

    const offer = await newOffer.save();
    res.status(201).json(offer);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Offer with this name already exists.' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    await Offer.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+
    res.status(200).json({ message: 'Offer removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;