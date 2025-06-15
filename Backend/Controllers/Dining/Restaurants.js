
const Restaurant = require('../../models/Dining/Restaurant');
const APIFeatures = require('../../Utilities/apiFeature');

exports.getAllRestaurants = async (req, res) => {
  try {
    const features = new APIFeatures(Restaurant.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const restaurants = await features.query;
    const totalRestaurants = await Restaurant.countDocuments(features.filterQuery);

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

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        status: 'fail',
        message: 'No restaurant found with that ID',
      });
    }

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