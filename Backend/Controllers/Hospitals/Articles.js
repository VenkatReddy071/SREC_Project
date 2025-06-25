const express=require("express");
const Article=require("../../models/Hospital/Articles");
const Hospital=require("../../models/Hospital/Hospital");

const app=express.Router();
app.get('/articles', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const articles = await Article.find()
            .skip(skip)
            .limit(limit)
            .populate('hospital', 'name location')
            .sort({ createdAt: -1 });

        const totalArticles = await Article.countDocuments();

        res.json({
            articles,
            totalPages: Math.ceil(totalArticles / limit),
            currentPage: page,
            totalArticles
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/articles/hospital/:hospitalId', async (req, res) => {
    const { hospitalId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const articles = await Article.find({ hospital: hospitalId })
            .skip(skip)
            .limit(limit)
            .populate('hospital', 'name location')
            .sort({ createdAt: -1 });

        const totalArticles = await Article.countDocuments({ hospital: hospitalId });

        res.json({
            articles,
            totalPages: Math.ceil(totalArticles / limit),
            currentPage: page,
            totalArticles
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/articles/email/:email', async (req, res) => {
    const { email } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const articles = await Article.find({ email: email.toLowerCase() }) // Ensure email is lowercased for matching
            .skip(skip)
            .limit(limit)
            .populate('hospital', 'name location')
            .sort({ createdAt: -1 });

        const totalArticles = await Article.countDocuments({ email: email.toLowerCase() });

        res.json({
            articles,
            totalPages: Math.ceil(totalArticles / limit),
            currentPage: page,
            totalArticles
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/articles', async (req, res) => {
    try {
        const newArticle = new Article(req.body);
        await newArticle.save();
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedArticle = await Article.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(updatedArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



app.get('/api/patient-stories', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const stories = await PatientStory.find()
            .skip(skip)
            .limit(limit)
            .populate('hospital', 'name location')
            .sort({ publishedDate: -1 });

        const totalStories = await PatientStory.countDocuments();

        res.json({
            stories,
            totalPages: Math.ceil(totalStories / limit),
            currentPage: page,
            totalStories
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/patient-stories/hospital/:hospitalId', async (req, res) => {
    const { hospitalId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const stories = await PatientStory.find({ hospital: hospitalId })
            .skip(skip)
            .limit(limit)
            .populate('hospital', 'name location')
            .sort({ publishedDate: -1 });

        const totalStories = await PatientStory.countDocuments({ hospital: hospitalId });

        res.json({
            stories,
            totalPages: Math.ceil(totalStories / limit),
            currentPage: page,
            totalStories
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/patient-stories', async (req, res) => {
    try {
        const newStory = new PatientStory(req.body);
        await newStory.save();
        res.status(201).json(newStory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/patient-stories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStory = await PatientStory.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedStory) {
            return res.status(404).json({ message: 'Patient story not found' });
        }
        res.json(updatedStory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
module.exports=app;