
const Mall = require('../../models/Malls/Malls');
const Product = require('../../models/Malls/Products');
const mongoose = require('mongoose');


const sendErrorResponse = (res, statusCode, message, error = null) => {
    console.error(message, error);
    res.status(statusCode).json({
        success: false,
        message,
        error: error ? error.message : null,
    });
};

exports.addMall = async (req, res) => {
    try {
        const newMall = new Mall(req.body);
        const savedMall = await newMall.save();
        res.status(201).json({
            success: true,
            message: "Mall added successfully!",
            mall: savedMall,
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return sendErrorResponse(res, 400, "A mall with this email already exists.", error);
        }
        sendErrorResponse(res, 500, "Failed to add new mall.", error);
    }
};
exports.updateMall = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendErrorResponse(res, 400, "Invalid Mall ID.");
        }
        const updatedMall = await Mall.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true, context: 'query' } // context: 'query' for unique validator to work on update
        );

        if (!updatedMall) {
            return sendErrorResponse(res, 404, "Mall not found.");
        }

        res.status(200).json({
            success: true,
            message: "Mall updated successfully!",
            mall: updatedMall,
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return sendErrorResponse(res, 400, "A mall with this email already exists.", error);
        }
        sendErrorResponse(res, 500, "Failed to update mall.", error);
    }
};


exports.getAllMalls = async (req, res) => {
    try {
        console.log('--- getAllMalls Request Initiated ---');
        console.log('Raw req.query:', req.query);

        const {
            page = 1,
            limit = 15,
            searchTerm,
            mallType,
            amenities,
            minRating,
            minStores,
            maxStores,
            minArea,
            maxArea,
            offersAvailable,
        } = req.query;

        const query = {}; 
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { locationName: { $regex: searchTerm, $options: 'i' } },
                { address: { $regex: searchTerm, $options: 'i' } },
            ];
            console.log(`Filter: searchTerm applied for "${searchTerm}"`);
        }
        if (mallType) {
            const typesArray = mallType.split(',').map(type => type.trim());
            if (typesArray.length > 0) {
                query.mallType = { $in: typesArray };
                console.log(`Filter: mallType applied for: ${typesArray.join(', ')}`);
            } else {
                console.log('Warning: mallType query parameter was empty after splitting.');
            }
        }
        if (amenities) {
            const amenitiesArray = amenities.split(',').map(amenity => amenity.trim());
            if (amenitiesArray.length > 0) {
                query.amenities = { $all: amenitiesArray };
                console.log(`Filter: amenities applied for: ${amenitiesArray.join(', ')}`);
            } else {
                console.log('Warning: amenities query parameter was empty after splitting.');
            }
        }


        if (minRating) {
            const parsedMinRating = Number(minRating);
            if (!isNaN(parsedMinRating)) {
                query.rating = { $gte: parsedMinRating };
                console.log(`Filter: minRating applied (>= ${parsedMinRating})`);
            } else {
                console.log(`Warning: minRating "${minRating}" is not a valid number.`);
            }
        }


        if (minStores || maxStores) {
            query.totalStores = {};
            const parsedMinStores = Number(minStores);
            const parsedMaxStores = Number(maxStores);

            if (minStores && !isNaN(parsedMinStores)) {
                query.totalStores.$gte = parsedMinStores;
                console.log(`Filter: minStores applied (>= ${parsedMinStores})`);
            }
            if (maxStores && !isNaN(parsedMaxStores)) {
                query.totalStores.$lte = parsedMaxStores;
                console.log(`Filter: maxStores applied (<= ${parsedMaxStores})`);
            }

            if (Object.keys(query.totalStores).length === 0) {
                delete query.totalStores;
                console.log('Warning: minStores/maxStores provided but neither was a valid number.');
            }
        }

        if (minArea || maxArea) {
            query.totalAreaSqFt = {};
            const parsedMinArea = Number(minArea);
            const parsedMaxArea = Number(maxArea);

            if (minArea && !isNaN(parsedMinArea)) {
                query.totalAreaSqFt.$gte = parsedMinArea;
                console.log(`Filter: minArea applied (>= ${parsedMinArea})`);
            }
            if (maxArea && !isNaN(parsedMaxArea)) {
                query.totalAreaSqFt.$lte = parsedMaxArea;
                console.log(`Filter: maxArea applied (<= ${parsedMaxArea})`);
            }
            if (Object.keys(query.totalAreaSqFt).length === 0) {
                delete query.totalAreaSqFt;
                console.log('Warning: minArea/maxArea provided but neither was a valid number.');
            }
        }

        if (offersAvailable === 'true') {
            query.offersAvailable = true;
            console.log('Filter: offersAvailable applied (true)');
        } else if (offersAvailable === 'false') {
            query.offersAvailable = false;
            console.log('Filter: offersAvailable applied (false)');
        }
        query.status={};
        query.status.$ne="pending"
        console.log('Final MongoDB Query Object:', JSON.stringify(query, null, 2));
        console.log(`Pagination: page=${page}, limit=${limit}`);

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const malls = await Mall.find(query)
            .skip(skip)
            .limit(parseInt(limit));

        const totalMalls = await Mall.countDocuments(query);
        const hasMore = (parseInt(page) * parseInt(limit)) < totalMalls;

        console.log(`Found ${malls.length} malls out of ${totalMalls} total matching the query.`);
        console.log('--- getAllMalls Request Completed ---');

        res.status(200).json({
            success: true,
            message: "Malls fetched successfully!",
            malls,
            totalMalls,
            currentPage: parseInt(page),
            perPage: parseInt(limit),
            hasMore,
        });
    } catch (error) {
        // Assuming sendErrorResponse is defined or handle error here
        console.error("Error in getAllMalls:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch malls.",
            error: error.message,
        });
    }
};

exports.getMallByEmailWithProducts = async (req, res) => {
    try {
        const { email } = req.user;

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return sendErrorResponse(res, 400, "Invalid email format.");
        }

        const mall = await Mall.findOne({ email: email.toLowerCase() });

        if (!mall) {
            return sendErrorResponse(res, 404, "Mall not found with the provided email.");
        }


        const products = await Product.find({ mall: mall._id });

        res.status(200).json({
            success: true,
            message: "Mall and its products fetched successfully!",
            mall: mall,
            products: products,
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to fetch mall and products by email.", error);
    }
};

exports.getMallOutlet=async (req,res)=>{
    try {
        const { email } = req.user;

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return sendErrorResponse(res, 400, "Invalid email format.");
        }

        const mall = await Mall.findOne({ email: email.toLowerCase() }).select("name email phoneNumber locationName address");

        if (!mall) {
            return sendErrorResponse(res, 404, "Mall not found with the provided email.");
        }
        res.status(200).json({
            success: true,
            message: "Mall fetched successfully!",
            mall: mall,
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to fetch mall and products by email.", error);
    }
}


exports.getMallById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendErrorResponse(res, 400, "Invalid Mall ID.");
        }

        const mall = await Mall.findById(id);

        if (!mall) {
            return sendErrorResponse(res, 404, "Mall not found.");
        }

        res.status(200).json({
            success: true,
            message: "Mall fetched successfully!",
            mall: mall,
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to fetch mall.", error);
    }
};

exports.deleteMall = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendErrorResponse(res, 400, "Invalid Mall ID.");
        }

        const deletedMall = await Mall.findByIdAndDelete(id);

        if (!deletedMall) {
            return sendErrorResponse(res, 404, "Mall not found.");
        }
        await Product.deleteMany({ mall: id });

        res.status(200).json({
            success: true,
            message: "Mall and associated products deleted successfully!",
            mall: deletedMall, // Returns the deleted document
        });
    } catch (error) {
        sendErrorResponse(res, 500, "Failed to delete mall.", error);
    }
};

exports.getMallByEmail=async(req,res)=>{
    try{
        const email=req.user.email;
        const mall=await Mall.findOne({email});
        return res.status(200).json({mall});
    }
    catch(error){
        return res.status(400).json(error);
    }
}