
const Product = require('../../models/Dining/Menu');
const Restaurant = require('../../models/Dining/Restaurant');
const APIFeatures = require('../../Utilities/apiFeature');
const historyLogRecorder = require("../../Utilities/HistoryLogs");
exports.getAllProducts = async (req, res) => {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    const totalProducts = await Product.countDocuments(features.filterQuery);


    await historyLogRecorder(
                    req,
                  totalProducts.constructor.modelName,
                    "READ",
                    "GET",
                    "Restaurant",
                    `All menu items are read by user Restaurant id is:${totalProducts.restaurantId}`
    ); 
    res.status(200).json({
      status: 'success',
      results: products.length,
      total: totalProducts,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
};

exports.getProductsByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const baseQuery = { restaurantId };

    const features = new APIFeatures(Product.find(baseQuery), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    const totalProducts = await Product.countDocuments({ ...baseQuery, ...features.filterQuery });

    if (!products || products.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No products found for that restaurant ID or matching the filters.',
      });
    }
    await historyLogRecorder(
                    req,
                  totalProducts.constructor.modelName,
                    "READ",
                    "GET",
                    restaurantId,
                    "Restaurant",
                    "Restaurant",
                    `All menu items are read by user Restaurant id is:${restaurantId}`
    ); 
    res.status(200).json({
      status: 'success',
      results: products.length,
      total: totalProducts,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error('Error fetching products by restaurant ID:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve products for restaurant',
      error: error.message,
    });
  }
};

exports.getProductsByRestaurantEmail = async (req, res) => {
  try {
    const { email } = req.user;
    const restaurant = await Restaurant.findOne({ email: email });

    if (!restaurant) {
      return res.status(404).json({
        status: 'fail',
        message: 'No restaurant found with that email address.',
      });
    }
    const restaurantId = restaurant._id;
    const baseQuery = { restaurantId };
    const features = new APIFeatures(Product.find(baseQuery), req.query)
      .filter()
      .sort();

    const products = await features.query;
    const totalProducts = await Product.countDocuments({ ...baseQuery, ...features.filterQuery });

    if (!products || products.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No products found for this restaurant or matching the filters.',
      });
    }
    await historyLogRecorder(
                    req,
                  totalProducts.constructor.modelName,
                    "READ",
                    "GET",
                    restaurantId,
                    "Restaurant",
                    `All menu items are read by user Restaurant By Email is:${email}`
    ); 
    res.status(200).json({
      status: 'success',
      results: products.length,
      total: totalProducts,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error('Error fetching products by restaurant email:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve products by restaurant email',
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'No product found with that ID',
      });
    }

    await historyLogRecorder(
                    req,
                  product.constructor.modelName,
                    "READ",
                    "GET",
                    product.restaurantId,
                    "Restaurant",
                    `The menu is read by Id:${req.params.id}`
    ); 
    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve product',
      error: error.message,
    });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { email } = req.user;

    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant) {
      return res.status(404).json({
        status: 'fail',
        message: 'Restaurant not found for the authenticated user.',
      });
    }
    const { 
      name, 
      description, 
      priceINR, 
      category, 
      imageUrl,
      rating,
      productType,
      isVegetarian,
      isVegan,
      isTopSeller,
      isNewArrival,
      isAvailable, } = req.body;

    if (!name || !priceINR || !category) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required product fields: name, price, category.',
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      priceINR,
    category, 
      imageUrl,
      rating,
      productType,
      isVegetarian,
      isVegan,
      isTopSeller,
      isNewArrival,
      isAvailable,
      restaurantId: restaurant._id,
    });

    await historyLogRecorder(
                    req,
                  newProduct.constructor.modelName,
                    "CREATE",
                    "POST",
                    newProduct.restaurantId,
                    "Restaurant",
                    `The menu is Created by Id:${restaurant._id}`
    ); 
    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'fail',
        message: `Validation failed: ${errors.join(', ')}`,
        errors: error.errors,
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred while creating the product.',
      error: error.message,
    });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'No product found with that ID',
      });
    }
    await historyLogRecorder(
                    req,
                  product.constructor.modelName,
                    "CREATE",
                    "PUT",
                    product.restaurantId,
                    "Restaurant",
                    `The menu is UPDATED by Id:${product.restaurantId}`
    ); 
    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: error.message,
        errors: error.errors,
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'No product found with that ID',
      });
    }
    await historyLogRecorder(
                    req,
                  product.constructor.modelName,
                    "DELETE",
                    "DELETE",
                    product.restaurantId,
                    "Restaurant",
                    `The menu is DELETED by Id:${product.restaurantId}`
    ); 
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};


