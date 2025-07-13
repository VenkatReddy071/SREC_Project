
const Restaurant = require('../../models/Dining/Restaurant');
const APIFeatures = require('../../Utilities/apiFeature');
const MenuItem=require("../../models/Dining/Menu");
const User=require("../../models/User/LoginModel");
const multer = require("multer");
const path = require("path");
const createNotifications=require("../../Utilities/UserNotification")
const historyLogRecorder = require("../../Utilities/HistoryLogs");


const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/images/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Error: Only image files (jpeg, jpg, png, gif) are allowed!"));
        }
    }
});


const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/documents/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-doc-" + file.originalname);
    }
});

const uploadDocument = multer({
    storage: documentStorage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        // Allow images and PDF for documents
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Error: Only image (jpeg, jpg, png) and PDF files are allowed for documents!"));
        }
    }
});

// --- Multer Storage Configuration for Doctor Images ---
const doctorImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/doctors/"); // Store doctor images in a dedicated 'uploads/doctors' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-doctor-" + file.originalname);
    }
});

const uploadDoctorImage = multer({
    storage: doctorImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit for doctor images
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Error: Only image files (jpeg, jpg, png, gif) are allowed for doctor images!"));
        }
    }
});

exports.createRestaurant = async (req, res) => {
   try {
    const { body, files } = req;
    const restaurantData = { ...body };
  
    const newRestaurant = await Restaurant.create(restaurantData);

    await historyLogRecorder(
      req,
      newRestaurant.constructor.modelName,
      "CREATE",
      "POST",
      "Restaurant",
      `A Restaurant are CREATED`
    );

    res.status(201).json({
      status: 'success',
      data: {
        restaurant: newRestaurant,
      },
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
        errors: error.errors,
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to create restaurant',
      error: error.message,
    });
  }
};
exports.getAllRestaurants = async (req, res) => {
  try {
    const features = new APIFeatures(Restaurant.find({status:{$ne:"Pending"}}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const restaurants = await features.query;
    const totalRestaurants = await Restaurant.countDocuments(features.filterQuery);
    await historyLogRecorder(
                      req,
                      totalRestaurants.constructor.modelName,
                        "READ",
                        "GET",
                        "Restaurant",
                        `All Restaurant are read by user`
        ); 
    res.status(200).json({
      status: 'success',
      results: restaurants.length,
      total: totalRestaurants,
      data: {
        restaurants,
      },
    });
  } catch (error) {
    console.error('Error in getAllRestaurants:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve restaurants',
      error: error.message,
    });
  }
};

exports.getUniqueCuisines = async (req, res) => {
    try {
        const cuisines = await Restaurant.distinct('cuisine');

        await historyLogRecorder(
                      req,
                      cuisines.constructor.modelName,
                        "READ",
                        "GET",
                        "Restaurant",
                        `All Cuisines are read by user`
        );     
        res.status(200).json({
            status: 'success',
            results: cuisines.length,
            data: {
                cuisines: cuisines.flat().filter(Boolean).sort() // Flatten if cuisine is array of arrays, filter empty
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch cuisines',
            error: error.message
        });
    }
};


exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        status: 'fail',
        message: 'No restaurant found with that ID',
      });
    }
    await historyLogRecorder(
                      req,
                      restaurant.constructor.modelName,
                        "READ",
                        "GET",
                        "Restaurant",
                        `A Restaurant are read by user by Id:${req.params.id}`
        );
    res.status(200).json({
      status: 'success',
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error('Error fetching restaurant by ID:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve restaurant',
      error: error.message,
    });
  }
};
exports.getRestaurantByEmail = async (req, res) => {
  try {
    const { email } = req.user;
    const restaurant = await Restaurant.findOne({ email: email });

    if (!restaurant) {
      return res.status(404).json({
        status: 'fail',
        message: 'No restaurant found with that email address',
      });
    }
    await historyLogRecorder(
                      req,
                      restaurant.constructor.modelName,
                        "READ",
                        "GET",
                        "Restaurant",
                        `A Restaurant are read by EMAIL by Id:${email}`
        );
    res.status(200).json({
      status: 'success',
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error('Error fetching restaurant by email:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve restaurant by email',
      error: error.message,
    });
  }
};
exports.createRestaurant = async (req, res) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);
    await historyLogRecorder(
                      req,
                      newRestaurant.constructor.modelName,
                        "CREATE",
                        "POST",
                        "Restaurant",
                        `A Restaurant are CREATED`
    );
    res.status(201).json({
      status: 'success',
      data: {
        restaurant: newRestaurant,
      },
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
        errors: error.errors,
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to create restaurant',
      error: error.message,
    });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!restaurant) {
      return res.status(404).json({
        status: 'fail',
        message: 'No restaurant found with that ID',
      });
    }
    await historyLogRecorder(
                      req,
                      restaurant.constructor.modelName,
                        "CREATE",
                        "PUT",
                        "Restaurant",
                        `A Restaurant are UPDATED by Id:${req.params.id}`
    );
    res.status(200).json({
      status: 'success',
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
        errors: error.errors,
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update restaurant',
      error: error.message,
    });
  }
};
exports.getRestaurantOutlet=async(req,res)=>{
  try{
    const {email}=req?.user;
    if(!email){
      return res.status(404).json({message:"UnAuthorization"});
    }
    const restaurant=await Restaurant.findOne({email}).select("name email   phone address seatingAvailability")
    res.status(200).json({
            success: true,
            message: "Mall fetched successfully!",
            mall: restaurant,
    });
  }
  catch (error) {
    console.error('Error fetching restaurant by ID:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve restaurant',
      error: error.message,
    });
  }
}
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        status: 'fail',
        message: 'No restaurant found with that ID',
      });
    }
    await historyLogRecorder(
                      req,
                      restaurant.constructor.modelName,
                        "DELETED",
                        "DELETED",
                        "Restaurant",
                        `A Restaurant are DELETED by Id:${req.params.id}`
    );
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete restaurant',
      error: error.message,
    });
  }
};

exports.getRestaurantOffer = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ email: req.user.email });

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
        await historyLogRecorder( 
                      req,
                      restaurant.constructor.modelName,
                        "READ",
                        "GET",
                        "Restaurant",
                        `A Restaurant are Offers  are read by EMAIL:${req.user.email}`
        );
        return res.status(200).json({ offers: updatedOffers });

    } catch (err) {
        console.error("Error in getRestaurantOffer:", err);
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

exports.getRestaurantOfferId = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);

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
exports.addRestaurantOffer = async (req, res) => {
    const { name, code, percentage, value, applicable, active, startDate, endDate } = req.body;

    if (!name || !code || value === undefined || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing required offer fields.' });
    }
    console.log(req.body);

    try {
        const restaurant = await Restaurant.findOne({ email: req.user.email });

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
        const users=await User.find({role:"user"});
        for(const user of users){
          await createNotifications({userId:user._id,type:"promotion",title: "Exclusive Offer Just For You!",message:`Don't miss out on our latest promotion! Get ${value}% off on ${applicable}   on Restaurant ${restaurant._id} for a limited time. Shop now!"`})
        }
        
        console.log('saved');
        const addedOffer = restaurant.offer[restaurant.offer.length - 1];
        await historyLogRecorder( 
                      req,
                      restaurant.constructor.modelName,
                        "GET",
                        "POST",
                        "Restaurant",
                        `A Restaurant are Offers  are POSTED by EMAIL:${req.user.email}`
        );
        return res.status(201).json({ message: 'Offer added successfully!', offer: addedOffer });

    } catch (err) {
        console.error("Error adding restaurant offer:", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.editRestaurantOffer=async(req,res)=>{
  const { offerId } = req.params;
    const { name, code, percentage, value, applicable, active, startDate, endDate } = req.body;

    if (!name || !code || value === undefined || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing required offer fields.' });
    }

    try {
        const restaurant = await Restaurant.findOne({email:req.user.email});
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
        const restaurant = await Restaurant.findOne({email:req.user.email});
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

exports.deleteRestaurantOffer=async(req,res)=>{
   const { offerId } = req.params;
    try {
        const restaurant = await Restaurant.findOne({email:req.user.email});

        restaurant.offer = restaurant.offer.filter((offer)=>offer._id.toString()!==offerId);

        await restaurant.save();
      return   res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (err) {
      return  res.status(500).json({ message: err.message });
    }
}

exports.getMenubyRestaurant=async(req,res)=>{
    const email=req.user.email;
    try{
    
        const restaurant = await Restaurant.findOne({email:req.user.email});
        const menuItems = await MenuItem.find({ restaurantId: restaurant._id }).select('name _id');
        return res.status(200).json({ menuItems });
    }catch (err) {
        return res.status(500).json({ message: err.message });
    }
  
  }
