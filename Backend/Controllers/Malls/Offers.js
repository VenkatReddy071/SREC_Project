const Mall = require('../../models/Malls/Malls');
const Product = require('../../models/Malls/Products');



exports.getMallOffer = async (req, res) => {
    try {
        const restaurant = await Mall.findOne({ email: req.user.email });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        const now = new Date();
        const updatedOffers = restaurant.offer.map(offer => {
            const offerObj = offer.toObject ? offer.toObject() : { ...offer };

            if (offerObj.endDate && new Date(offerObj.endDate) < now) {
                offerObj.active = false;
            }
            return offerObj;
        });

        restaurant.offer = updatedOffers;
        await restaurant.save();

        return res.status(200).json({ offers: updatedOffers });

    } catch (err) {
        console.error("Error in getRestaurantOffer:", err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.getMallOfferId = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Mall.findById(id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        const now = new Date();
        const validOffers = restaurant.offer.filter(offer => {
            const startDate = new Date(offer.startDate);
            const endDate = new Date(offer.endDate);

            return offer.active && startDate <= now && endDate >= now;
        });
        console.log(validOffers);

        return res.status(200).json({ offers: validOffers });

    } catch (err) {
        console.error("Error in getRestaurantOfferId:", err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};
exports.addMallOffer = async (req, res) => {
    const { name, code, percentage, value, applicable, active, startDate, endDate } = req.body;

    if (!name || !code || value === undefined || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing required offer fields.' });
    }
    console.log(req.body);

    try {
        const restaurant = await Mall.findOne({ email: req.user.email });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        if (!restaurant.offer) {
            restaurant.offer = [];
        }

        if (restaurant.offer.some(o => o.code === code)) {
            return res.status(409).json({ message: 'An offer with this code already exists for your restaurant.' });
        }

        const newOffer = {
            name,
            code,
            percentage,
            value,
            applicable,
            active,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };

        restaurant.offer.push(newOffer);

        await restaurant.save();
        console.log('saved');
        const addedOffer = restaurant.offer[restaurant.offer.length - 1];
        return res.status(201).json({ message: 'Offer added successfully!', offer: addedOffer });

    } catch (err) {
        console.error("Error adding restaurant offer:", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.editMallOffer=async(req,res)=>{
  const { offerId } = req.params;
    const { name, code, percentage, value, applicable, active, startDate, endDate } = req.body;

    if (!name || !code || value === undefined || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing required offer fields.' });
    }

    try {
        const restaurant = await Mall.findOne({email:req.user.email});
        const offerIndex = restaurant.offer.findIndex(o => o._id.toString() === offerId);

        if(!restaurant.offer){
          restaurant.offer=[];
        }
        if (offerIndex === -1) {
            return res.status(404).json({ message: 'Offer not found in your restaurant.' });
        }

        if (restaurant.offer?.some((o, idx) => o.code === code && idx !== offerIndex)) {
            return res.status(409).json({ message: 'An offer with this code already exists for your restaurant.' });
        }

        restaurant.offer[offerIndex] = {
            _id: offerId,
            name,
            code,
            percentage,
            value,
            applicable,
            active,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };

        await restaurant.save();
    return     res.status(200).json({ message: 'Offer updated successfully!', offer: restaurant.offer[offerIndex] });
    } catch (err) {
      return   res.status(500).json({ message: err.message });
    }
}

exports.toggleOfferStatus=async(req,res)=>{
  const { offerId } = req.params;
    const { active } = req.body;
    console.log(active);
    try {
        const restaurant = await Mall.findOne({email:req.user.email});
        const offer = restaurant.offer.filter((off)=>off._id.toString()===offerId);

        if (!offer) {
            return res.status(404).json({ message: 'Offer not found in your restaurant.' });
        }
        offer[0].active = active;
        await restaurant.save();
        
      return   res.status(200).json({ message: 'Offer status toggled successfully', offer });
    } catch (err) {
      return   res.status(500).json({ message: err.message });
    }
}

exports.deleteMallOffer=async(req,res)=>{
   const { offerId } = req.params;
    try {
        const restaurant = await Mall.findOne({email:req.user.email});

        restaurant.offer = restaurant.offer.filter((offer)=>offer._id.toString()!==offerId);

        await restaurant.save();
      return   res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (err) {
      return  res.status(500).json({ message: err.message });
    }
}

exports.getProductsByMall=async(req,res)=>{
    const email=req.user.email;
    try{
    
        const restaurant = await Mall.findOne({email:req.user.email});
        const menuItems = await Product.find({ mall: restaurant._id }).select('name _id');
        return res.status(200).json({ menuItems });
    }catch (err) {
        return res.status(500).json({ message: err.message });
    }
  
  }
