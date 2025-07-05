const Order=require("../../models/Malls/Order");
const Booking=require("../../models/Hospital/Bookings");
const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const User=require("../../models/User/LoginModel");

router.post("/add/view", async (req, res) => {
    try {
        const userId = req.session?.user?.id; 

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please Login/Sign up." });
        }

        const { view, modelView } = req.body;

        const allowedModels = ["Education", "Mall", "Restaurant", "Hospital"];
        if (!allowedModels.includes(modelView)) {
            return res.status(400).json({ message: `Invalid modelView: ${modelView}. Must be one of ${allowedModels.join(', ')}.` });
        }

        const userModel = await User.findById(userId);

        if (!userModel) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!userModel.recentlyView) {
            userModel.recentlyView = [];
        }

        const existingViewIndex = userModel.recentlyView.findIndex(
            (item) => item.view.toString() === view.toString() && item.modelView === modelView
        );

        if (existingViewIndex !== -1) {
            userModel.recentlyView.splice(existingViewIndex, 1);
        }

        userModel.recentlyView.push({
            view: view,
            modelView: modelView,
            viewedAt: new Date(),
        });

        const MAX_RECENTLY_VIEWED = 50;
        if (userModel.recentlyView.length > MAX_RECENTLY_VIEWED) {
            userModel.recentlyView = userModel.recentlyView.slice(-MAX_RECENTLY_VIEWED);
        }

        userModel.viewedPlacesCount = userModel.recentlyView.length;

        await userModel.save();

        return res.status(200).json({ message: "View added successfully.", viewCount: userModel.viewedPlacesCount });
    } catch (error) {
        console.error("Error adding view:", error);
        return res.status(500).json({ message: "Server error occurred while adding view.", error: error.message });
    }
});

router.get("/view/details", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userId = req.session.user && req.session.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Authorization is required." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const rawRecentlyView = user.recentlyView;

    const populatedItems = [];
    const idsToPopulateByModel = {
      Hospital: [],
      Education: [],
      Mall: [],
      Restaurant: [],
    };

    rawRecentlyView.forEach(item => {
      if (item.view && item.modelView && idsToPopulateByModel[item.modelView]) {
        idsToPopulateByModel[item.modelView].push(item.view);
      }
    });

    const Hospital = mongoose.model('Hospital');
    const Education = mongoose.model('EducationalInstitute');
    const Mall = mongoose.model('Mall');
    const Restaurant = mongoose.model('Restaurant');

    const models = { Hospital, Education, Mall, Restaurant };
    const selectFields = "name address location image rating imageUrls.mainImage institutionType";

    for (const modelName in idsToPopulateByModel) {
      const ids = idsToPopulateByModel[modelName];
      if (ids.length > 0) {
        const Model = models[modelName];
        if (Model) {
          const fetchedDocs = await Model.find({ _id: { $in: ids } })
            .select(selectFields)
            .lean();

          fetchedDocs.forEach(doc => {
            const originalItem = rawRecentlyView.find(
              item => item.view && item.view.equals(doc._id) && item.modelView === modelName
            );
            if (originalItem) {
              populatedItems.push({
                view: doc,
                modelView: originalItem.modelView,
                viewedAt: originalItem.viewedAt,
              });
            }
          });
        } else {
          console.warn(`Model not found for modelName: ${modelName}`);
        }
      }
    }

    populatedItems.sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime());

    const viewedItems = populatedItems
      .filter(item => item.view !== null && item.view !== undefined)
      .slice(skip, skip + limit);

    const totalCount = rawRecentlyView.length;

    const hasMore = (page * limit) < totalCount;

    return res.status(200).json({
      page,
      limit,
      totalItems: totalCount,
      hasMore,
      data: viewedItems.map(item => ({
          _id: item.view._id,
          name: item.view.name,
          address: item.view.address,
          location: item.view.location,
          image: item.view.image,
          rating: item.view.rating,
          mainImage: item.view.imageUrls ? item.view.imageUrls.mainImage : undefined,
          institutionType: item.view.institutionType,
          modelView: item.modelView,
          viewedAt: item.viewedAt
      })),
      message: "View details fetched successfully."
    });

  } catch (error) {
    console.error("Error fetching view details:", error);
    return res.status(500).json({ message: "Internal server error.", error: error.message });
  }
});
router.get("/user/stats",async(req,res)=>{
    try{
        const userId=req.session?.user.id;
        if(!userId){
            return res.status(404).json({message:"Not Authorization please  Login."});
        }
        const query={
            user:userId,
            sourceType:"Restaurant",
        };
        const restaurntCount=await Order.countDocuments(query);
        const query1={
            user:userId,
            sourceType:"Mall",
        }
        const mallCount=await Order.countDocuments(query1);

        const hospitalQuery={
            userId:userId,
        }
        const BookingCount=await Booking.countDocuments(hospitalQuery);
        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ message: "User not found." });
        }
        const recentlyViewedCount = user.recentlyView ? user.recentlyView.length : 0;
        return res.status(200).json({
            resCount:restaurntCount,
            mallCount:mallCount,
            bookingCount:BookingCount,
            viewed:recentlyViewedCount,
        })
    }
    catch(error){
        return res.status(400).json({message:"server error",error});
    }




})

module.exports=router;