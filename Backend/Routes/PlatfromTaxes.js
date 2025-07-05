const express=require("express");
const router = express.Router();
const Tax = require('../models/PlatformTaxes');
router.get('/', async (req, res) => {
  try {
    const taxes = await Tax.find({});
    res.status(200).json(taxes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/', async (req, res) => {
  const { name, type, value, applicableTo } = req.body;

  if (!name || !type || !value) {
    return res.status(400).json({ message: 'Please enter all required fields for the tax.' });
  }

  try {
    const newTax = new Tax({
      name,
      type,
      value,
      applicableTo
    });

    const tax = await newTax.save();
    res.status(201).json(tax);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Tax with this name already exists.' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id);

    if (!tax) {
      return res.status(404).json({ message: 'Tax not found' });
    }

    await Tax.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+
    res.status(200).json({ message: 'Tax removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;