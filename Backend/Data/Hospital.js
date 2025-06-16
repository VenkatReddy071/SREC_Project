const mongoose = require("mongoose");

// Provided image URLs for main images (cycled for the primary institute image)
const mainImageUrls = [
  "https://img.freepik.com/free-photo/red-buildings-households_1127-2024.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/low-rise-building_1127-3268.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/city-building-along-road-daytime_181624-45987.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/low-rise-building_1127-3272.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/architecture-modern-city-building-dusk-generative-ai_188544-8013.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/kids-getting-back-school-together_23-2149507650.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/male-female-students-wear-face-chill-stand-front-university_1150-24695.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/low-angle-cheerful-team-students-passed-test-by-preparing-all-together_496169-2336.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/free-time-students-bachelor-s-campus-life-rhythm-five-friendly-students-are-walking_8353-6408.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/analog-landscape-city-with-buildings_23-2149661462.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/architecture-independence-palace-ho-chi-minh-city_181624-21243.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/modern-amphitheater-usa_1268-14358.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/working-urban-singapore-amazing-complex_1122-1722.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/entrance-modern-office-building_1127-2295.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/happy-college-students-with-books-hands-walking-together-campus_8353-6400.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/outdoor-portrait-serious-curly-female-student-sitting-with-laptop-ground_197531-6965.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/church-city-shanghai-china_1127-2931.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/team-meeting-startups_23-2148898707.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/view-palace-culture-iasi-romania_1268-20703.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/glass-buildings-seen-from-lake_1127-2268.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740"
];

let mainImageIndex = 0; // To cycle through the mainImageUrls

// Provided image URLs for gallery images
const galleryImageUrls = [
  "https://img.freepik.com/free-photo/empty-hallway-background_23-2149408813.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/people-studying-college_23-2147678837.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/students-studying-indoors-full-shot_23-2149647035.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/room-interior-design_23-2148899437.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/people-table-library_23-2147678900.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/clean-empty-library-hall_23-2149215414.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/teenagers-enjoying-reading-steps_23-2147864040.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/teenagers-reading-staircase-library_23-2147864038.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/full-shot-student-library_23-2149647115.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/people-chatting-choosing-books_23-2147678965.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/room-interior-design_23-2148899442.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/students-working-study-group_23-2149281178.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/empty-classroom-due-coronavirus-pandemic_637285-8845.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/high-angle-students-learning-library_23-2149647043.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/empty-office-workplace-with-table-chair-locker_1170-1956.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/having-test-university_1098-14206.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/three-young-perspective-startupers-sitting-modern-light-library-meeting-talking-about-new-project-looking-though-details-work-having-productive-day-friends-atmosphere_176420-8294.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/view-modern-classroom-school_23-2150911443.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740",
  "https://img.freepik.com/free-photo/classroom-with-colorful-wall-with-planet-theme-it_188544-29087.jpg?ga=GA1.1.367584337.1719885901&semt=ais_hybrid&w=740"
];


function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomPhoneNumber() {
  const prefixes = ['9', '8', '7', '6'];
  let number = prefixes[getRandomInt(0, prefixes.length - 1)];
  for (let i = 0; i < 9; i++) {
    number += getRandomInt(0, 9);
  }
  return number;
}

function generateAward() {
  const awardNames = [
    "Excellence in Academics", "Sports Championship", "Innovation Award",
    "Community Service Recognition", "Best Faculty Award", "Green Campus Award",
    "Cultural Fest Winner", "Alumni Achievement", "Research Excellence", "Top Ranking"
  ];
  return {
    name: awardNames[getRandomInt(0, awardNames.length - 1)],
    year: getRandomInt(2010, 2024),
    description: `Awarded for outstanding achievements in ${generateRandomString(20)}.`,
  };
}

function generateEducationalInstitute(type, index) {
  const districts = ["Kurnool", "Nandyal"];
  const randomDistrict = districts[getRandomInt(0, districts.length - 1)];

  const mainImageUrl = mainImageUrls[mainImageIndex % mainImageUrls.length];
  mainImageIndex++;

  const galleryImages = [];
  const numGalleryImages = getRandomInt(3, 4); // At least 3 to 4 gallery images
  for (let i = 0; i < numGalleryImages; i++) {
    galleryImages.push(galleryImageUrls[getRandomInt(0, galleryImageUrls.length - 1)]);
  }

  const common = {
    name: `${type} of ${generateRandomString(8)} ${index + 1}`,
    institutionType: type,
    image: mainImageUrl,
    gallery: galleryImages, // Now uses provided gallery URLs
    location: `${generateRandomString(10)} Town, ${randomDistrict} District, Andhra Pradesh`,
    rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)),
    info: `A leading ${type.toLowerCase()} dedicated to ${generateRandomString(30)}.`,
    foundationYear: getRandomInt(1900, 2020),
    mobileNumber: generateRandomPhoneNumber(),
    hostel: Math.random() > 0.5,
    awards: Array.from({ length: getRandomInt(0, 2) }).map(() => generateAward()),
  };

  if (type === "School") {
    const boards = ["CBSE", "ICSE", "BSEAP", "Other State Board", "International"];
    const specialTrainings = ["JEE/NEET Prep", "Olympiad Coaching", "Sports Training", "Arts & Culture"];
    const extracurriculars = ["Debate Club", "Science Fair", "Coding Club", "Drama Society", "Music Band", "Sports Team"];
    const transportations = ["School Bus Service", "Public Transport Accessible", "No Service"];

    return {
      ...common,
      schoolDetails: {
        board: boards[getRandomInt(0, boards.length - 1)],
        specialTraining: specialTrainings[getRandomInt(0, specialTrainings.length - 1)],
        extraCurricularActivities: Array.from({ length: getRandomInt(1, 3) }).map(() =>
          extracurriculars[getRandomInt(0, extracurriculars.length - 1)]
        ),
        transportation: transportations[getRandomInt(0, transportations.length - 1)],
      },
    };
  } else { // College
    const specializations = [
      "Computer Science Engineering", "Electronics and Communication Engineering",
      "Mechanical Engineering", "Civil Engineering", "Electrical Engineering",
      "Information Technology", "Biotechnology", "Chemical Engineering",
      "Mathematics", "Physics", "Chemistry", "English Literature", "History",
      "Economics", "Political Science", "Law", "Medicine", "Pharmacy", "Architecture"
    ];
    const affiliationTypes = ["University", "Autonomous", "Deemed University", "Affiliated College", "Other"];
    const courseTypes = ["B.Tech", "M.Tech", "MBA", "MBBS", "B.Sc", "M.Sc", "BA", "MA", "PhD"];
    const extracurriculars = ["Tech Club", "Literary Society", "Sports Team", "Entrepreneurship Cell", "NCC/NSS", "Debate Society"];
    const transportations = ["College Bus Service", "Public Transport Accessible", "No Service"];

    return {
      ...common,
      collegeDetails: {
        specializations: Array.from({ length: getRandomInt(2, 5) }).map(() =>
          specializations[getRandomInt(0, specializations.length - 1)]
        ),
        affiliationType: affiliationTypes[getRandomInt(0, affiliationTypes.length - 1)],
        courseTypes: Array.from({ length: getRandomInt(1, 4) }).map(() =>
          courseTypes[getRandomInt(0, courseTypes.length - 1)]
        ),
        extraCurricularActivities: Array.from({ length: getRandomInt(2, 4) }).map(() =>
          extracurriculars[getRandomInt(0, extracurriculars.length - 1)]
        ),
        transportation: transportations[getRandomInt(0, transportations.length - 1)],
      },
    };
  }
}

const schools = [];
for (let i = 0; i < 150; i++) {
  schools.push(generateEducationalInstitute("School", i));
}

const colleges = [];
for (let i = 0; i < 150; i++) {
  colleges.push(generateEducationalInstitute("College", i));
}

const allInstitutes = [...schools, ...colleges];

const EducationalInstitute =require("../models/Schools/School")

const mongoDbUri="mongodb+srv://ndlinfo:ndlinfo@srec.nky2xvg.mongodb.net/SREC?retryWrites=true&w=majority&appName=SREC"
async function insertData() {

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully!');

    console.log('Deleting existing EducationalInstitute data...');
    await EducationalInstitute.deleteMany({}); // Optional: Clear existing data before inserting
    console.log('Existing data deleted.');

    console.log(`Inserting ${allInstitutes.length} new EducationalInstitute documents...`);
    await EducationalInstitute.insertMany(allInstitutes);
    console.log('All data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    console.log('Closing MongoDB connection.');
    await mongoose.connection.close();
  }
}

// Execute the insertion function
insertData();
