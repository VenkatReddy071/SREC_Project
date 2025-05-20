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

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,             
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  name: "session-id",
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in ms
    httpOnly: true,
    sameSite: 'lax', 
    secure: false    
  }
}));

// Routers
const LoginRouter = require("./Routes/User/Login");

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", LoginRouter);

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
