
const Product = require('../../models/Malls/Products');
const Mall = require('../../models/Malls/Malls'); 
const mongoose = require('mongoose');

const sendErrorResponse = (res, statusCode, message, error = null) => {
    console.error(message, error);
    res.status(statusCode).json({
        success: false,
        message,
        error: error ? error.message : null,
    });
};

exports.addProductByMallEmail = async (req, res) => {
    try {
        const { mallEmail, ...productData } = req.body;

        if (!mallEmail || !/^\S+@\S+\.\S+$/.test(mallEmail)) {
            return sendErrorResponse(res, 400, "Mall email is required and must be a valid email format.");
        }

        const mall = await Mall.findOne({ email: mallEmail.toLowerCase() });
        if (!mall) {
            return sendErrorResponse(res, 404, "Mall not found with the provided email.");
        }
        productData.mall = mall._id;

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product added successfully to the specified mall!",
            product: savedProduct,
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to add product.", error);
    }
};

exports.getProductsByMallId = async (req, res) => {
    try {
        const { mallId } = req.params;
        const {
            page = 1,
            limit = 30,
            category,
            brand,
            minPrice,
            maxPrice,
            searchTerm,
            status
        } = req.query;

        if (!mongoose.Types.ObjectId.isValid(mallId)) {
            return sendErrorResponse(res, 400, "Invalid Mall ID.");
        }

        const query = { mall: mallId };

        if (category) {
            query.category = category;
        }
        if (brand) {
            query.brand = { $regex: brand, $options: 'i' };
        }
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        if (status) {
            query.status = status;
        }

        // Price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice && !isNaN(minPrice)) {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice && !isNaN(maxPrice)) {
                query.price.$lte = Number(maxPrice);
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const products = await Product.find(query)
            .skip(skip)
            .limit(parseInt(limit));

        const totalProducts = await Product.countDocuments(query);
        const hasMore = (parseInt(page) * parseInt(limit)) < totalProducts;

        res.status(200).json({
            success: true,
            message: `Products for mall ID ${mallId} fetched successfully!`,
            products,
            totalProducts,
            currentPage: parseInt(page),
            perPage: parseInt(limit),
            hasMore,
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to fetch products by mall ID.", error);
    }
};


exports.getProductsByMallEmail = async (req, res) => {
    try {
        const { mallEmail } = req.params;
        const {
            page = 1,
            limit = 10,
            category,
            brand,
            minPrice,
            maxPrice,
            searchTerm,
            status
        } = req.query;

        if (!mallEmail || !/^\S+@\S+\.\S+$/.test(mallEmail)) {
            return sendErrorResponse(res, 400, "Invalid mall email format.");
        }

        const mall = await Mall.findOne({ email: mallEmail.toLowerCase() });
        if (!mall) {
            return sendErrorResponse(res, 404, "Mall not found with the provided email.");
        }

        const query = { mall: mall._id }; // Filter by mall's _id

        // Apply product filters as in getProductsByMallId
        if (category) {
            query.category = category;
        }
        if (brand) {
            query.brand = { $regex: brand, $options: 'i' };
        }
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        if (status) {
            query.status = status;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice && !isNaN(minPrice)) {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice && !isNaN(maxPrice)) {
                query.price.$lte = Number(maxPrice);
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const products = await Product.find(query)
            .skip(skip)
            .limit(parseInt(limit));

        const totalProducts = await Product.countDocuments(query);
        const hasMore = (parseInt(page) * parseInt(limit)) < totalProducts;

        res.status(200).json({
            success: true,
            message: `Products for mall email ${mallEmail} fetched successfully!`,
            products,
            totalProducts,
            currentPage: parseInt(page),
            perPage: parseInt(limit),
            hasMore,
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to fetch products by mall email.", error);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return sendErrorResponse(res, 400, "Invalid Product ID.");
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            req.body,
            { new: true, runValidators: true } // Returns the updated document, runs schema validators
        );

        if (!updatedProduct) {
            return sendErrorResponse(res, 404, "Product not found.");
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            product: updatedProduct,
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to update product.", error);
    }
};

exports.getPopularProduct=async(req,res)=>{
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendErrorResponse(res, 400, "Invalid Product ID.");
        }
        const mall=await Mall.findById(id);
        const updatedProduct = await Product.findById(
            mall?._id,
        ).limit(10);

        if (!updatedProduct) {
            return sendErrorResponse(res, 404, "Product not found.");
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            product: updatedProduct,
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to update product.", error);
    }
}
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return sendErrorResponse(res, 400, "Invalid Product ID.");
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return sendErrorResponse(res, 404, "Product not found.");
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully!",
            product: deletedProduct,
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to delete product.", error);
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return sendErrorResponse(res, 400, "Invalid Product ID.");
        }

        const product = await Product.findById(productId);

        if (!product) {
            return sendErrorResponse(res, 404, "Product not found.");
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully!",
            product: product,
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to fetch product.", error);
    }
};