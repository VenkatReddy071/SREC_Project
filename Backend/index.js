const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./connect/ConnDB");

dotenv.config({ path: ".env.development" });

const app = express();

// Connect DB
connectDB();
app.set('trust proxy', 1);

// Middleware



const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'sessions'
});

store.on('error', (error) => {
  console.error("Session store error:", error);
});
const isProduction = process.env.NODE_ENV === 'production';


app.use(session({
  name: "session-id",
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
     sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  }
}));

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,             
// }));
app.use(cors({
  origin: "https://srecnandyalinfo.onrender.com",
  credentials: true,
  exposedHeaders: ['Set-Cookie'],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const HistoryRouter=require("./Routes/History")
const LoginRouter = require("./Routes/User/Login");
const HospitalRouter=require("./Controllers/Hospitals/HospitalsSection")
const DoctorRouter=require("./Routes/Hospital/Doctor");
const BookingRouter=require("./Controllers/Hospitals/Booking/Bokking");
const MallRouter=require("./Routes/Malls/Malls");
const ProductRouter=require("./Routes/Malls/Product");
const CartRouter=require("./Routes/Malls/Cart");
const OrderRouter=require("./Routes/Malls/ORder/Order");
const RestaurantRouter=require("./Routes/Restaurant/Restaurant");
const MenuRouter=require("./Routes/Restaurant/Menu");
const SchoolRouter=require("./Routes/Schools/School")
const TeacherRouter=require("./Routes/Schools/Teacher");
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", LoginRouter);
app.use("/api/hospitals",HospitalRouter);
app.use("/api",HistoryRouter);
app.use("/api/doctor",DoctorRouter);
app.use("/api/booking",BookingRouter);
app.use("/api/malls",MallRouter);
app.use("/api/product",ProductRouter);
app.use("/api/cart",CartRouter);
app.use("/api/order",OrderRouter);
app.use("/api/restaurant",RestaurantRouter);
app.use("/api/menu",MenuRouter);
app.use("/api/school",SchoolRouter);
app.use("/api/teacher",TeacherRouter);
// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// const { MongoClient } = require("mongodb");
// const fs = require("fs");
// const dotenv = require("dotenv");

// dotenv.config({ path: ".env.development" });

// const uri = "mongodb+srv://ndlinfo:ndlinfo@srec.nky2xvg.mongodb.net/?retryWrites=true&w=majority&appName=SREC"
// const client = new MongoClient(uri);

// async function exportData() {
//   try {
//     await client.connect();
//     const db = client.db("SREC");        // 👉 Your DB name here
//     const collection = db.collection("Hospitals");  // 👉 Your collection

//     const data = await collection.find({}).toArray(); // Get all documents

//     fs.writeFileSync("Hospital.json", JSON.stringify(data, null, 2));
//     console.log("✅ Data successfully written to app.json");
//   } catch (error) {
//     console.error("❌ Error:", error);
//   } finally {
//     await client.close();
//   }
// }

// exportData();

// const { MongoClient } = require("mongodb");
// const fs = require("fs");
// const dotenv = require("dotenv");

// // Load environment variables from .env.development file
// dotenv.config({ path: ".env.development" });

// // MongoDB connection URI
// // Replace with your actual MongoDB connection string if it differs
// const uri = "mongodb+srv://ndlinfo:ndlinfo@srec.nky2xvg.mongodb.net/?retryWrites=true&w=majority&appName=SREC";
// const client = new MongoClient(uri);

// const dbName = "SREC"; // Your database name
// const collectionName = "Reviews"; // Your collection name
// const outputIdsFileName = "hospital_ids.json"; // File to store the _id values

// /**
//  * Deletes all documents from the specified collection.
//  */
// // async function deleteData() {
// //     try {
// //         await client.connect();
// //         const db = client.db(dbName);
// //         const collection = db.collection(collectionName);

// //         console.log(`🗑️ Deleting all documents from '${collectionName}' collection...`);
// //         const result = await collection.deleteMany({});
// //         console.log(`✅ Successfully deleted ${result.deletedCount} documents.`);
// //     } catch (error) {
// //         console.error("❌ Error deleting data:", error);
// //         throw error; // Re-throw to propagate the error
// //     } finally {
// //         // Client is closed in the main function to allow subsequent operations
// //         // await client.close();
// //     }
// // }

// /**
//  * Imports data from a JSON file into the specified collection.
//  * @param {string} filePath - The path to the JSON file containing the data.
//  */
// async function importData(filePath) {
//     try {
//         await client.connect();
//         const db = client.db(dbName);
//         const collection = db.collection(collectionName);

//         console.log(`📂 Reading data from ${filePath}...`);
//         const rawData = fs.readFileSync(filePath);
//         const dataToImport = JSON.parse(rawData);

//         if (!Array.isArray(dataToImport) || dataToImport.length === 0) {
//             console.warn("⚠️ No data found in the JSON file or it's not an array. No documents will be imported.");
//             return;
//         }

//         console.log(`➕ Importing ${dataToImport.length} documents into '${collectionName}' collection...`);
//         const result = await collection.insertMany(dataToImport);
//         console.log(`✅ Successfully imported ${result.insertedCount} documents.`);
//     } catch (error) {
//         console.error(`❌ Error importing data from ${filePath}:`, error);
//         throw error; // Re-throw to propagate the error
//     } finally {
//         // Client is closed in the main function to allow subsequent operations
//         // await client.close();
//     }
// }

// async function readHospitalIds() {
//     let ids = [];
//     try {
//         await client.connect();
//         const db = client.db(dbName);
//         const collection = db.collection(collectionName);

//         console.log(`🔍 Reading _id values from '${collectionName}' collection...`);
//         // Find all documents and project only the _id field
//         const cursor = collection.find({}, { projection: { _id: 1 } });

//         await cursor.forEach(doc => {
//             ids.push(doc._id);
//         });

//         console.log(`✅ Successfully read ${ids.length} _id values.`);
//         return ids;
//     } catch (error) {
//         console.error("❌ Error reading _id values:", error);
//         throw error; // Re-throw to propagate the error
//     } finally {
//         // Client is closed in the main function to allow subsequent operations
//         // await client.close();
//     }
// }

// /**
//  * Main function to orchestrate the delete, import, and read process.
//  */
// async function main() {
//     try {
//         // Step 1: Delete existing data
//         // await deleteData();

//         // // Step 2: Import new data from Hospital.json
//         // // Ensure 'Hospital.json' exists in the same directory as this script
//         await importData("reviews_data.json");
//         // const hospitalIds = await readHospitalIds();
//         // const stringifiedIds = hospitalIds.map(id => id.toString()); // Convert ObjectId to string for logging and storage
//         // console.log("\nHospital _IDs:", stringifiedIds);
//         // console.log(`📝 Writing _id values to ${outputIdsFileName}...`);
//         // fs.writeFileSync(outputIdsFileName, JSON.stringify(stringifiedIds, null, 2));
//         // console.log(`✅ _ID values successfully written to ${outputIdsFileName}`);

//         // console.log("\n✨ Process completed: Data deleted, new data imported, _IDs read, and stored successfully.");
//     } catch (error) {
//         console.error("\nOverall process failed:", error);
//     } finally {
//         // Ensure the client is closed after all operations are done
//         await client.close();
//     }
// }

// // Execute the main function
// main();

