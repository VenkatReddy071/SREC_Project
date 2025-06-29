// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const connectDB = require("./connect/ConnDB");

// dotenv.config({ path: ".env.development" });

// const app = express();

// // Connect DB
// connectDB();
// // Middleware



// const MongoDBStore = require('connect-mongodb-session')(session);

// const store = new MongoDBStore({
//   uri: process.env.MONGO_URL,
//   collection: 'sessions'
// });

// store.on('error', (error) => {
//   console.error("Session store error:", error);
// });

// app.use(session({
//   name: "session-id",
//   secret: process.env.SESSION_SECRET || "your-secret-key",
//   resave: false,
//   saveUninitialized: false,
//   store: store,
//   cookie: {
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//     sameSite: 'lax',
//     secure:true
//   }
// }));

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,             
// }));
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const HistoryRouter=require("./Routes/History")
// const LoginRouter = require("./Routes/User/Login");
// const HospitalRouter=require("./Controllers/Hospitals/HospitalsSection")
// const DoctorRouter=require("./Routes/Hospital/Doctor");
// const BookingRouter=require("./Controllers/Hospitals/Booking/Bokking");
// const MallRouter=require("./Routes/Malls/Malls");
// const ProductRouter=require("./Routes/Malls/Product");
// const CartRouter=require("./Routes/Malls/Cart");
// const OrderRouter=require("./Routes/Malls/ORder/Order");
// const RestaurantRouter=require("./Routes/Restaurant/Restaurant");
// const MenuRouter=require("./Routes/Restaurant/Menu");
// const SchoolRouter=require("./Routes/Schools/School")
// const TeacherRouter=require("./Routes/Schools/Teacher");
// const ReviewRouter=require("./Routes/Review");
// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// app.use("/api", LoginRouter);
// app.use("/api/hospitals",HospitalRouter);
// app.use("/api",HistoryRouter);
// app.use("/api/doctor",DoctorRouter);
// app.use("/api/booking",BookingRouter);
// app.use("/api/malls",MallRouter);
// app.use("/api/product",ProductRouter);
// app.use("/api/cart",CartRouter);
// app.use("/api/order",OrderRouter);
// app.use("/api/restaurant",RestaurantRouter);
// app.use("/api/menu",MenuRouter);
// app.use("/api/school",SchoolRouter);
// app.use("/api/teacher",TeacherRouter);
// app.use("/api/review",ReviewRouter);
// // Start Server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./connect/ConnDB");
const {Server}=require("socket.io");
const http=require("http");
dotenv.config({ path: ".env.development" });
const app = express();
const server=http.createServer(app);

connectDB();
app.set('trust proxy', 1);

const io=new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
});
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 * 7
});

store.on('error', (error) => {
    console.error("Session store error:", error);
});
const isProduction = process.env.NODE_ENV === 'production';


if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    console.log("Server running in production mode, trusting proxy.");
} else {
    console.log("Server running in development mode.");
}

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());

app.use(session({
    name: "session-id",
    secret: process.env.SESSION_SECRET || "a-very-strong-secret-key-please-change-me",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const HistoryRouter = require("./Routes/History");
const LoginRouter = require("./Routes/User/Login");
const HospitalRouter = require("./Controllers/Hospitals/HospitalsSection");
const DoctorRouter = require("./Routes/Hospital/Doctor");
const BookingRouter = require("./Controllers/Hospitals/Booking/Bokking");
const MallRouter = require("./Routes/Malls/Malls");
const ProductRouter = require("./Routes/Malls/Product");
const CartRouter = require("./Routes/Malls/Cart");
const OrderRouter = require("./Routes/Malls/ORder/Order");
const RestaurantRouter = require("./Routes/Restaurant/Restaurant");
const MenuRouter = require("./Routes/Restaurant/Menu");
const SchoolRouter = require("./Routes/Schools/School");
const TeacherRouter = require("./Routes/Schools/Teacher");
const ReviewRouter = require("./Routes/Review");
const ArticleRouter=require("./Controllers/Hospitals/Articles");
const dashboardRoutes=require("./Routes/Restaurant/DashboardOverview");
const taxesAndCharges=require("./Routes/Restaurant/TaxesAndCarges");
const mallDashboardRoute=require("./Routes/Malls/OverView");
const MallOfferRouter=require("./Routes/Malls/Offers");
const MallTaxes=require("./Routes/Malls/Taxes");
const Search=require("./Controllers/SearchFuncationality/Search");
const Contact=require("./Routes/Contact.js/Contact");
const HospitalOverview=require("./Routes/Hospital/Overview");
const SchoolOverview=require("./Routes/Schools/OVerview");
const AdminOverview=require("./Routes/AdminDashboard/Overview")
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api", LoginRouter);
app.use("/api",AdminOverview);
app.use("/api",Search);
app.use("/api/hospitals", HospitalRouter);
app.use("/api", HistoryRouter);
app.use("/api/doctor", DoctorRouter);
app.use("/api/booking", BookingRouter);
app.use("/api/malls", MallRouter);
app.use("/api",ArticleRouter);
app.use("/api/product", ProductRouter);
app.use("/api/cart", CartRouter);
app.use("/api/order", OrderRouter);
app.use("/api/restaurant", RestaurantRouter);
app.use("/api/menu", MenuRouter);
app.use("/api/school", SchoolRouter);
app.use("/api/teacher", TeacherRouter);
app.use("/api/review", ReviewRouter);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/mall",mallDashboardRoute);
app.use("/api/restaurants",taxesAndCharges);
app.use("/api/mall",MallTaxes);
app.use("/api/mall",MallOfferRouter);
app.use("/api/hospital",HospitalOverview);
app.use('/api/contact',Contact);
app.use("/api/schools",SchoolOverview);
const PORT = process.env.PORT || 4000;
io.on('connection',(socket)=>{
    console.log("new user is connected",socket.id);
    io.on('joinUser',(userId)=>{
        console.log('new user is joined via',userId);
    })

    io.on('disconnect',()=>{
        console.log('dissconnnect');
    })
})


server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

