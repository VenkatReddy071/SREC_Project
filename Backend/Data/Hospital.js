const Hospital =require("../models/Hospital/Hospital")
const Article=require("../models/Hospital/Articles");
const mongoose=require("mongoose");
const MONGODB_URI ="mongodb+srv://ndlinfo:ndlinfo@srec.nky2xvg.mongodb.net/SREC?retryWrites=true&w=majority&appName=SREC"; // REPLACE WITH YOUR MONGODB URI
console.log("Type of Article:", typeof Article);
console.log("Is Article a Mongoose Model?", Article.prototype instanceof mongoose.Model);

async function createTeachersForAllInstitutes() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
        const image_urls = [
            "https://img.freepik.com/free-photo/close-up-interviewee-taking-notes_23-2149037859.jpg?ga=GA1.1.367584337.1719885901&semt=ais_items_boosted&w=740",
            "https://img.freepik.com/free-photo/old-newspapers-white-background_23-2149318880.jpg?ga=GA1.1.367584337.1719885901&semt=ais_items_boosted&w=740",
            "https://img.freepik.com/free-photo/truth-concept-composition-detective-desk_23-2149051321.jpg?ga=GA1.1.367584337.1719885901&semt=ais_items_boosted&w=740",
            "https://img.freepik.com/free-photo/stack-old-coming-book-strips_23-2150256430.jpg?ga=GA1.1.367584337.1719885901&semt=ais_items_boosted&w=740"
        ];
        const createdHospitals=await Hospital.find({});
        const articlesToCreate = [];
        createdHospitals.forEach(hospital => {
            const numArticles = 5;
            for (let i = 0; i < numArticles; i++) {
                articlesToCreate.push({
                    name: `Health Update: ${hospital.name} - Topic ${i + 1}`,
                    email: `info${i + 1}@${hospital.name.replace(/\s/g, '').toLowerCase()}.com`,
                    image_url: image_urls[i % image_urls.length] || `https://placehold.co/600x400/${Math.floor(Math.random()*16777215).toString(16)}/000?text=Article+${hospital.name.charAt(0)}+${i + 1}`,
                    hospital: hospital._id,
                    info: `This article from ${hospital.name} provides valuable insights into the latest medical advancements and patient care strategies related to Topic ${i + 1}. It aims to inform and educate the community on important health matters.`,
                    publishedBy: `Dr. ${String.fromCharCode(65 + i)} Patient`
                });
            }
        });
        await Article.insertMany(articlesToCreate);
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
}

createTeachersForAllInstitutes();