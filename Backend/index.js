

// // const express = require("express");
// // const cors = require("cors");
// // const dotenv = require("dotenv");
// // const session = require("express-session");
// // const cookieParser = require("cookie-parser");
// // const connectDB = require("./connect/ConnDB");
// // const { Server } = require("socket.io");
// // const http = require("http");
// // const jwt=require("jsonwebtoken");
// // dotenv.config({ path: ".env.development" });
// // const app = express();
// // const server = http.createServer(app);

// // connectDB();
// // app.set('trust proxy', 1);

// // const io = new Server(server, {
// //     cors: {
// //         origin: 'http://localhost:5173',
// //         methods: ['GET', 'POST'],
// //         credentials: true
// //     }
// // });

// // const MongoDBStore = require('connect-mongodb-session')(session);

// // const store = new MongoDBStore({
// //     uri: process.env.MONGO_URL,
// //     collection: 'sessions',
// //     expires: 1000 * 60 * 60 * 24 * 7
// // });

// // store.on('error', (error) => {
// //     console.error("Session store error:", error);
// // });

// // const isProduction = process.env.NODE_ENV === 'production';

// // if (isProduction) {
// //     app.set('trust proxy', 1);
// //     console.log("Server running in production mode, trusting proxy.");
// // } else {
// //     console.log("Server running in development mode.");
// // }

// // app.use(cors({
// //     origin: "http://localhost:5173",
// //     credentials: true,
// // }));

// // app.use(cookieParser());

// // app.use(session({
// //     name: "session-id",
// //     secret: process.env.SESSION_SECRET || "a-very-strong-secret-key-please-change-me",
// //     resave: false,
// //     saveUninitialized: false,
// //     store: store,
// //     cookie: {
// //         maxAge: 7 * 24 * 60 * 60 * 1000,
// //         httpOnly: true,
// //         sameSite: 'lax',
// //         secure: isProduction
// //     }
// // }));

// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // const HistoryRouter = require("./Routes/History");
// // const LoginRouter = require("./Routes/User/Login");
// // const HospitalRouter = require("./Controllers/Hospitals/HospitalsSection");
// // const DoctorRouter = require("./Routes/Hospital/Doctor");
// // const BookingRouter = require("./Controllers/Hospitals/Booking/Bokking");
// // const MallRouter = require("./Routes/Malls/Malls");
// // const ProductRouter = require("./Routes/Malls/Product");
// // const CartRouter = require("./Routes/Malls/Cart");
// // const OrderRouter = require("./Routes/Malls/ORder/Order");
// // const RestaurantRouter = require("./Routes/Restaurant/Restaurant");
// // const MenuRouter = require("./Routes/Restaurant/Menu");
// // const SchoolRouter = require("./Routes/Schools/School");
// // const TeacherRouter = require("./Routes/Schools/Teacher");
// // const ReviewRouter = require("./Routes/Review");
// // const ArticleRouter = require("./Controllers/Hospitals/Articles");
// // const dashboardRoutes = require("./Routes/Restaurant/DashboardOverview");
// // const taxesAndCharges = require("./Routes/Restaurant/TaxesAndCarges");
// // const mallDashboardRoute = require("./Routes/Malls/OverView");
// // const MallOfferRouter = require("./Routes/Malls/Offers");
// // const MallTaxes = require("./Routes/Malls/Taxes");
// // const Search = require("./Controllers/SearchFuncationality/Search");
// // const Contact = require("./Routes/Contact.js/Contact");
// // const HospitalOverview = require("./Routes/Hospital/Overview");
// // const SchoolOverview = require("./Routes/Schools/OVerview");
// // const AdminOverview = require("./Routes/AdminDashboard/Overview");
// // const UserNotifications = require("./Routes/Notification");
// // const UserStatis = require("./Routes/User/ProfileData");
// // const platform = require("./Routes/PlatformOffersAndTaxes");
// // const TaxesPlatfrom = require("./Routes/PlatfromTaxes")

// // app.get("/", (req, res) => {
// //     res.send("Server is running");
// // });

// // app.use("/api", LoginRouter);
// // app.use("/api", AdminOverview);
// // app.use("/api", Search);
// // app.use("/api/hospitals", HospitalRouter);
// // app.use("/api", HistoryRouter);
// // app.use("/api/offers", platform);
// // app.use("/api/taxes", TaxesPlatfrom);
// // app.use("/api/doctor", DoctorRouter);
// // app.use("/api/booking", BookingRouter(io));
// // app.use("/api/malls", MallRouter);
// // app.use("/api", ArticleRouter);
// // app.use("/api/product", ProductRouter);
// // app.use("/api/cart", CartRouter);
// // app.use("/api/order", OrderRouter);
// // app.use("/api/restaurant", RestaurantRouter);
// // app.use("/api/menu", MenuRouter);
// // app.use("/api/school", SchoolRouter);
// // app.use("/api/teacher", TeacherRouter);
// // app.use("/api/review", ReviewRouter);
// // app.use('/api/dashboard', dashboardRoutes);
// // app.use("/api/mall", mallDashboardRoute);
// // app.use("/api/restaurants", taxesAndCharges);
// // app.use("/api/mall", MallTaxes);
// // app.use("/api/mall", MallOfferRouter);
// // app.use("/api/hospital", HospitalOverview);
// // app.use('/api/contact', Contact);
// // app.use("/api/schools", SchoolOverview);
// // app.use("/api/notifications", UserNotifications);
// // app.use("/api", UserStatis);

// // const connectedUsers = {}; 
// // const connectedDashboards = {};
// // io.on('connection', (socket) => {
// //     console.log(`New socket connected: ${socket.id}`);
// //     const token = socket.handshake.auth?.token;

// //     if (token) {
// //         try {
// //             const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
            
// //             socket.dashboardUserId = decoded.id; 
// //             socket.dashboardUserEmail = decoded.email;
// //             socket.userRole = decoded.role;
// //             console.log(decoded);
// //             let dashboardType = null;

// //             switch (socket.userRole) {
// //                 case 'hospital':
// //                     dashboardType = 'hospital';
// //                     break;
// //                 case 'restaurant':
// //                     dashboardType = 'restaurant';
// //                     break;
// //                 case 'mall':
// //                     dashboardType = 'mall';
// //                     break;
// //                 case 'school':
// //                     dashboardType = 'school';
// //                     break;
// //                 case 'admin':
// //                     dashboardType = 'admin';
// //                     break;
// //                 default:
// //                     throw new Error(`Role '${socket.userRole}' does not correspond to a known dashboard type.`);
// //             }

// //             if (!dashboardType) {
// //                 throw new Error('Could not determine dashboard type from user role.');
// //             }

// //             socket.dashboardType = dashboardType;

// //             console.log(`Dashboard connected with ID: ${socket.id} (Authenticated as User: ${socket.dashboardUserId}, Email: ${socket.dashboardUserEmail}, Role: ${socket.userRole}, Dashboard Type: ${socket.dashboardType})`);

// //             socket.join(socket.dashboardUserId);
// //             console.log(`Dashboard socket ${socket.id} joined personal room: ${socket.dashboardUserId}`);

// //             const typeRoom = `dashboard_${socket.dashboardType}`;
// //             socket.join(typeRoom);
// //             console.log(`Dashboard socket ${socket.id} joined type room: ${typeRoom}`);

// //             if (!connectedDashboards[socket.dashboardType]) {
// //                 connectedDashboards[socket.dashboardType] = {};
// //             }
// //             connectedDashboards[socket.dashboardType][socket.dashboardUserId] = socket.id;

// //             socket.emit('dashboardConnected', { 
// //                 message: `Welcome ${socket.dashboardUserEmail} to your ${socket.dashboardType} dashboard!`,
// //                 type: socket.dashboardType,
// //                 userId: socket.dashboardUserId
// //             });

// //         } catch (err) {
// //             console.error(`Dashboard authentication failed for socket ${socket.id}:`, err.message);
// //             socket.emit('authError', 'Authentication failed: Invalid token or insufficient role for dashboard.');
// //             socket.disconnect();
// //             return; 
// //         }
// //     } else {
// //         console.log(`Regular user socket connected: ${socket.id} (awaiting 'joinUser' event)`);
// //         socket.on('joinUser', (userId) => {
// //             if (userId) {
// //                 console.log(`Regular user ${userId} joined via socket ${socket.id}.`);
// //                 connectedUsers[userId] = socket.id;
// //                 socket.join(userId);
// //                 socket.emit('joinedRoom', `Successfully joined room: ${userId}`);
// //             } else {
// //                 console.log(`joinUser event received, but userId was null or undefined for socket ${socket.id}.`);
// //             }
// //         });
// //     }


// //     socket.on('disconnect', () => {
// //         console.log(`Socket disconnected: ${socket.id}`);

// //         for (const userId in connectedUsers) {
// //             if (connectedUsers[userId] === socket.id) {
// //                 delete connectedUsers[userId];
// //                 console.log(`Removed regular user ${userId} from connectedUsers map.`);
// //                 break;
// //             }
// //         }
        
// //         if (socket.dashboardUserId && socket.dashboardType) {
// //             if (connectedDashboards[socket.dashboardType] && connectedDashboards[socket.dashboardType][socket.dashboardUserId] === socket.id) {
// //                 delete connectedDashboards[socket.dashboardType][socket.dashboardUserId];
// //                 if (Object.keys(connectedDashboards[socket.dashboardType]).length === 0) {
// //                     delete connectedDashboards[socket.dashboardType]; 
// //                 }
// //                 console.log(`Removed dashboard user ${socket.dashboardUserId} of type ${socket.dashboardType} from connectedDashboards map.`);
// //             }
// //         }
// //     });
// // });

// // const PORT = process.env.PORT || 4000;
// // server.listen(PORT, () => {
// //     console.log(`Server listening on port ${PORT}`);
// // });



// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const connectDB = require("./connect/ConnDB");
// const { Server } = require("socket.io");
// const http = require("http");
// const jwt = require("jsonwebtoken");
// dotenv.config({ path: ".env.development" });

// const User = require("./models/User/LoginModel");
// const Hospital = require("./models/Hospital/Hospital");
// const Restaurant = require("./models/Dining/Restaurant");
// const School = require("./models/Schools/School");
// const Mall = require("./models/Malls/Malls");
// const passport=require("passport")
// const authRouter=require("./Routes/User/auth")
// const app = express();
// const server = http.createServer(app);

// connectDB();
// app.set('trust proxy', 1);

// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:5173',
//         methods: ['GET', 'POST'],
//         credentials: true
//     }
// });

// const MongoDBStore = require('connect-mongodb-session')(session);

// const store = new MongoDBStore({
//     uri: process.env.MONGO_URL,
//     collection: 'sessions',
//     expires: 1000 * 60 * 60 * 24 * 7
// });

// store.on('error', (error) => {
//     console.error("Session store error:", error);
// });

// const isProduction = process.env.NODE_ENV === 'production';

// // if (isProduction) {
// //     app.set('trust proxy', 1);
// // } else {
// // }

// app.use(cors({
//     origin: "http://localhost:5173",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
// }));

// app.use(cookieParser());

// app.use(session({
//     name: "session-id",
//     secret: process.env.SESSION_SECRET || "a-very-strong-secret-key-please-change-me",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//     cookie: {
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//         sameSite: isProduction ? 'None' : 'None',
//         secure: isProduction
//     }
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const HistoryRouter = require("./Routes/History");
// const LoginRouter = require("./Routes/User/Login");
// const HospitalRouter = require("./Controllers/Hospitals/HospitalsSection");
// const DoctorRouter = require("./Routes/Hospital/Doctor");
// const BookingRouter = require("./Controllers/Hospitals/Booking/Bokking");
// const MallRouter = require("./Routes/Malls/Malls");
// const ProductRouter = require("./Routes/Malls/Product");
// const CartRouter = require("./Routes/Malls/Cart");
// const OrderRouter = require("./Routes/Malls/ORder/Order")(io);
// const RestaurantRouter = require("./Routes/Restaurant/Restaurant");
// const MenuRouter = require("./Routes/Restaurant/Menu");
// const SchoolRouter = require("./Routes/Schools/School");
// const TeacherRouter = require("./Routes/Schools/Teacher");
// const ReviewRouter = require("./Routes/Review");
// const ArticleRouter = require("./Controllers/Hospitals/Articles");
// const dashboardRoutes = require("./Routes/Restaurant/DashboardOverview");
// const taxesAndCharges = require("./Routes/Restaurant/TaxesAndCarges");
// const mallDashboardRoute = require("./Routes/Malls/OverView");
// const MallOfferRouter = require("./Routes/Malls/Offers");
// const MallTaxes = require("./Routes/Malls/Taxes");
// const Search = require("./Controllers/SearchFuncationality/Search");
// const Contact = require("./Routes/Contact.js/Contact");
// const HospitalOverview = require("./Routes/Hospital/Overview");
// const SchoolOverview = require("./Routes/Schools/OVerview");
// const AdminOverview = require("./Routes/AdminDashboard/Overview");
// const UserNotifications = require("./Routes/Notification");
// const UserStatis = require("./Routes/User/ProfileData");
// const platform = require("./Routes/PlatformOffersAndTaxes");
// const TaxesPlatfrom = require("./Routes/PlatfromTaxes")

// require('./Controllers/User/GoogleAuth');
// app.get("/", (req, res) => {
//     res.send("Server is running");
// });

// app.use("/api", LoginRouter);
// app.use("/api", AdminOverview);
// app.use("/api", Search);
// app.use("/api/hospitals", HospitalRouter);
// app.use("/api", HistoryRouter);
// app.use("/api/offers", platform);
// app.use("/api/taxes", TaxesPlatfrom);
// app.use("/api/doctor", DoctorRouter);
// app.use("/api/booking", BookingRouter(io));
// app.use("/api/malls", MallRouter);
// app.use("/auth",authRouter);
// app.use("/api", ArticleRouter);
// app.use("/api/product", ProductRouter);
// app.use("/api/cart", CartRouter);
// app.use("/api/order", OrderRouter);
// app.use("/api/restaurant", RestaurantRouter);
// app.use("/api/menu", MenuRouter);
// app.use("/api/school", SchoolRouter);
// app.use("/api/teacher", TeacherRouter);
// app.use("/api/review", ReviewRouter);
// app.use('/api/dashboard', dashboardRoutes);
// app.use("/api/mall", mallDashboardRoute);
// app.use("/api/restaurants", taxesAndCharges);
// app.use("/api/mall", MallTaxes);
// app.use("/api/mall", MallOfferRouter);
// app.use("/api/hospital", HospitalOverview);
// app.use('/api/contact', Contact);
// app.use("/api/schools", SchoolOverview);
// app.use("/api/notifications", UserNotifications);
// app.use("/api", UserStatis);

// const connectedUsers = {};
// const connectedDashboards = {};

// io.on('connection', async (socket) => {
//     console.log(`New socket connected: ${socket.id}`);
//     const token = socket.handshake.auth?.token;

//     if (token) {
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");

//             socket.dashboardUserId = decoded.id;
//             socket.dashboardUserEmail = decoded.email;
//             socket.userRole = decoded.role;
//             console.log("Decoded JWT for dashboard connection:", decoded);

//             let dashboardType = null;
//             let specificDashboardId = null;

//             switch (socket.userRole) {
//                 case 'hospital':
//                     dashboardType = 'hospital';
//                     const hospital = await Hospital.findOne({ ownerEmail: socket.dashboardUserEmail });
//                     if (hospital) {
//                         specificDashboardId = hospital._id.toString();
//                     } else {
//                         throw new Error('Hospital profile not found for this user.');
//                     }
//                     break;
//                 case 'restaurant':
//                     dashboardType = 'restaurant';
//                     const restaurant = await Restaurant.findOne({email:socket.dashboardUserEmail });
//                     if (restaurant) {
//                         specificDashboardId = restaurant._id.toString();
//                     } else {
//                         throw new Error('Restaurant profile not found for this user.');
//                     }
//                     break;
//                 case 'fashion':
//                     dashboardType = 'fashion';
//                     const mall = await Mall.findOne({email:socket.dashboardUserEmail });
//                     if (mall) {
//                         specificDashboardId = mall._id.toString();
//                     } else {
//                         throw new Error('Mall profile not found for this user.');
//                     }
//                     break;
//                 case 'school':
//                     dashboardType = 'school';
//                     const school = await School.findOne({ email:socket.dashboardUserEmail });
//                     if (school) {
//                         specificDashboardId = school._id.toString();
//                     } else {
//                         throw new Error('School profile not found for this user.');
//                     }
//                     break;
//                 case 'admin':
//                     dashboardType = 'admin';
//                     break;
//                 default:
//                     throw new Error(`Role '${socket.userRole}' does not correspond to a known dashboard type.`);
//             }

//             if (!dashboardType) {
//                 throw new Error('Could not determine dashboard type from user role.');
//             }

//             socket.dashboardType = dashboardType;
//             socket.specificDashboardId = specificDashboardId;

//             console.log(`Dashboard connected with ID: ${socket.id} (Auth as User: ${socket.dashboardUserId}, Role: ${socket.userRole}, Type: ${socket.dashboardType}, Specific ID: ${socket.specificDashboardId || 'N/A'})`);

//             socket.join(socket.dashboardUserId);

//             const typeRoom = `dashboard_${socket.dashboardType}`;
//             socket.join(typeRoom);

//             if (socket.specificDashboardId) {
//                 const specificIdRoom = `dashboard_${socket.dashboardType}_${socket.specificDashboardId}`;
//                 socket.join(specificIdRoom);
//             }

//             if (!connectedDashboards[socket.dashboardType]) {
//                 connectedDashboards[socket.dashboardType] = {};
//             }
//             connectedDashboards[socket.dashboardType][socket.dashboardUserId] = socket.id;

//             if (socket.specificDashboardId) {
//                 if (!connectedDashboards[socket.dashboardType]['byEntityId']) {
//                     connectedDashboards[socket.dashboardType]['byEntityId'] = {};
//                 }
//                 connectedDashboards[socket.dashboardType]['byEntityId'][socket.specificDashboardId] = socket.id;
//             }

//             socket.emit('dashboardConnected', {
//                 message: `Welcome ${socket.dashboardUserEmail} to your ${socket.dashboardType} dashboard!`,
//                 type: socket.dashboardType,
//                 userId: socket.dashboardUserId,
//                 specificId: socket.specificDashboardId
//             });

//         } catch (err) {
//             console.error(`Dashboard authentication or data fetch failed for socket ${socket.id}:`, err.message);
//             socket.emit('authError', `Authentication failed: ${err.message}`);
//             socket.disconnect();
//             return;
//         }
//     } else {
//         console.log(`Regular user socket connected: ${socket.id} (awaiting 'joinUser' event)`);
//         socket.on('joinUser', (userId) => {
//             if (userId) {
//                 connectedUsers[userId] = socket.id;
//                 socket.join(userId);
//                 socket.emit('joinedRoom', `Successfully joined room: ${userId}`);
//             } else {
//             }
//         });
//     }

//     socket.on('disconnect', () => {
//         console.log(`Socket disconnected: ${socket.id}`);

//         for (const userId in connectedUsers) {
//             if (connectedUsers[userId] === socket.id) {
//                 delete connectedUsers[userId];
//                 break;
//             }
//         }

//         if (socket.dashboardUserId && socket.dashboardType) {
//             if (connectedDashboards[socket.dashboardType] && connectedDashboards[socket.dashboardType][socket.dashboardUserId] === socket.id) {
//                 delete connectedDashboards[socket.dashboardType][socket.dashboardUserId];
//                 if (Object.keys(connectedDashboards[socket.dashboardType]).length === 0) {
//                     delete connectedDashboards[socket.dashboardType];
//                 }
//             }
//             if (socket.specificDashboardId && connectedDashboards[socket.dashboardType]?.byEntityId) {
//                 if (connectedDashboards[socket.dashboardType]['byEntityId'][socket.specificDashboardId] === socket.id) {
//                     delete connectedDashboards[socket.dashboardType]['byEntityId'][socket.specificDashboardId];
//                 }
//             }
//         }
//     });
// });

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./connect/ConnDB");
const { Server } = require("socket.io");
const path=require("path");
const http = require("http");
const jwt = require("jsonwebtoken");
dotenv.config({ path: ".env.development" });

const User = require("./models/User/LoginModel");
const Hospital = require("./models/Hospital/Hospital");
const Restaurant = require("./models/Dining/Restaurant");
const School = require("./models/Schools/School");
const Mall = require("./models/Malls/Malls");
const passport=require("passport")
const authRouter=require("./Routes/User/auth")
const app = express();
const server = http.createServer(app);

connectDB();
app.set('trust proxy', 1);

const io = new Server(server, {
    cors: {
        origin: 'https://srecnandyalinfo.onrender.com',
        methods: ['GET', 'POST'],
        credentials: true
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

app.use(cors({
    origin: "https://srecnandyalinfo.onrender.com", // Ensure this matches your frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Crucial for sending cookies (sessions)
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
        secure: isProduction
    }
}));

// --- ENHANCED LOGGING START ---
app.use((req, res, next) => {
    console.log('\n--- Incoming Request ---');
    console.log(`Path: ${req.path}`);
    console.log(`Method: ${req.method}`);
    console.log('Request Headers (Cookie):', req.headers.cookie);
    console.log('Session ID (from cookie-parser):', req.cookies['session-id']); // Check raw cookie
    console.log('Session Object (before Passport):', req.session); // Check session object after express-session
    next();
});
// --- ENHANCED LOGGING END ---

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
    console.log('Session Object (after Passport.session):', req.session); // Check session object after Passport
    console.log('req.user (after Passport.session):', req.user ? req.user.username : 'Not populated'); // Check req.user
    console.log('--- End Incoming Request ---');
    next();
});
// --- ENHANCED LOGGING END ---

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
const OrderRouter = require("./Routes/Malls/ORder/Order")(io);
const RestaurantRouter = require("./Routes/Restaurant/Restaurant");
const MenuRouter = require("./Routes/Restaurant/Menu");
const SchoolRouter = require("./Routes/Schools/School");
const TeacherRouter = require("./Routes/Schools/Teacher");
const ReviewRouter = require("./Routes/Review");
const ArticleRouter = require("./Controllers/Hospitals/Articles");
const dashboardRoutes = require("./Routes/Restaurant/DashboardOverview");
const taxesAndCharges = require("./Routes/Restaurant/TaxesAndCarges");
const mallDashboardRoute = require("./Routes/Malls/OverView");
const MallOfferRouter = require("./Routes/Malls/Offers");
const MallTaxes = require("./Routes/Malls/Taxes");
const Search = require("./Controllers/SearchFuncationality/Search");
const Contact = require("./Routes/Contact.js/Contact");
const HospitalOverview = require("./Routes/Hospital/Overview");
const SchoolOverview = require("./Routes/Schools/OVerview");
const AdminOverview = require("./Routes/AdminDashboard/Overview");
const UserNotifications = require("./Routes/Notification");
const UserStatis = require("./Routes/User/ProfileData");
const platform = require("./Routes/PlatformOffersAndTaxes");
const TaxesPlatfrom = require("./Routes/PlatfromTaxes")

require('./Controllers/User/GoogleAuth');
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api", LoginRouter);
app.use("/api", AdminOverview);
app.use("/api", Search);
app.use("/api/hospitals", HospitalRouter);
app.use("/api", HistoryRouter);
app.use("/api/offers", platform);
app.use("/api/taxes", TaxesPlatfrom);
app.use("/api/doctor", DoctorRouter);
app.use("/api/booking", BookingRouter(io));
app.use("/api/malls", MallRouter);
app.use("/auth",authRouter);
app.use("/api", ArticleRouter);
app.use("/api/product", ProductRouter);
app.use("/api/cart", CartRouter);
app.use("/api/order", OrderRouter);
app.use("/api/restaurant", RestaurantRouter);
app.use("/api/menu", MenuRouter);
app.use("/api/school", SchoolRouter);
app.use("/api/teacher", TeacherRouter);
app.use("/api/review", ReviewRouter);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/mall", mallDashboardRoute);
app.use("/api/restaurants", taxesAndCharges);
app.use("/api/mall", MallTaxes);
app.use("/api/mall", MallOfferRouter);
app.use("/api/hospital", HospitalOverview);
app.use('/api/contact', Contact);
app.use("/api/schools", SchoolOverview);
app.use("/api/notifications", UserNotifications);
app.use("/api", UserStatis);

const connectedUsers = {};
const connectedDashboards = {};

io.on('connection', async (socket) => {
    console.log(`New socket connected: ${socket.id}`);
    const token = socket.handshake.auth?.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");

            socket.dashboardUserId = decoded.id;
            socket.dashboardUserEmail = decoded.email;
            socket.userRole = decoded.role;
            console.log("Decoded JWT for dashboard connection:", decoded);

            let dashboardType = null;
            let specificDashboardId = null;

            switch (socket.userRole) {
                case 'hospital':
                    dashboardType = 'hospital';
                    const hospital = await Hospital.findOne({ ownerEmail: socket.dashboardUserEmail });
                    if (hospital) {
                        specificDashboardId = hospital._id.toString();
                    } else {
                        throw new Error('Hospital profile not found for this user.');
                    }
                    break;
                case 'restaurant':
                    dashboardType = 'restaurant';
                    const restaurant = await Restaurant.findOne({email:socket.dashboardUserEmail });
                    if (restaurant) {
                        specificDashboardId = restaurant._id.toString();
                    } else {
                        throw new Error('Restaurant profile not found for this user.');
                    }
                    break;
                case 'fashion':
                    dashboardType = 'fashion';
                    const mall = await Mall.findOne({email:socket.dashboardUserEmail });
                    if (mall) {
                        specificDashboardId = mall._id.toString();
                    } else {
                        throw new Error('Mall profile not found for this user.');
                    }
                    break;
                case 'school':
                    dashboardType = 'school';
                    const school = await School.findOne({ email:socket.dashboardUserEmail });
                    if (school) {
                        specificDashboardId = school._id.toString();
                    } else {
                        throw new Error('School profile not found for this user.');
                    }
                    break;
                case 'admin':
                    dashboardType = 'admin';
                    break;
                default:
                    throw new Error(`Role '${socket.userRole}' does not correspond to a known dashboard type.`);
            }

            if (!dashboardType) {
                throw new Error('Could not determine dashboard type from user role.');
            }

            socket.dashboardType = dashboardType;
            socket.specificDashboardId = specificDashboardId;

            console.log(`Dashboard connected with ID: ${socket.id} (Auth as User: ${socket.dashboardUserId}, Role: ${socket.userRole}, Type: ${socket.dashboardType}, Specific ID: ${socket.specificDashboardId || 'N/A'})`);

            socket.join(socket.dashboardUserId);

            const typeRoom = `dashboard_${socket.dashboardType}`;
            socket.join(typeRoom);

            if (socket.specificDashboardId) {
                const specificIdRoom = `dashboard_${socket.dashboardType}_${socket.specificDashboardId}`;
                socket.join(specificIdRoom);
            }

            if (!connectedDashboards[socket.dashboardType]) {
                connectedDashboards[socket.dashboardType] = {};
            }
            connectedDashboards[socket.dashboardType][socket.dashboardUserId] = socket.id;

            if (socket.specificDashboardId) {
                if (!connectedDashboards[socket.dashboardType]['byEntityId']) {
                    connectedDashboards[socket.dashboardType]['byEntityId'] = {};
                }
                connectedDashboards[socket.dashboardType]['byEntityId'][socket.specificDashboardId] = socket.id;
            }

            socket.emit('dashboardConnected', {
                message: `Welcome ${socket.dashboardUserEmail} to your ${socket.dashboardType} dashboard!`,
                type: socket.dashboardType,
                userId: socket.dashboardUserId,
                specificId: socket.specificDashboardId
            });

        } catch (err) {
            console.error(`Dashboard authentication or data fetch failed for socket ${socket.id}:`, err.message);
            socket.emit('authError', `Authentication failed: ${err.message}`);
            socket.disconnect();
            return;
        }
    } else {
        console.log(`Regular user socket connected: ${socket.id} (awaiting 'joinUser' event)`);
        socket.on('joinUser', (userId) => {
            if (userId) {
                connectedUsers[userId] = socket.id;
                socket.join(userId);
                socket.emit('joinedRoom', `Successfully joined room: ${userId}`);
            } else {
            }
        });
    }

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);

        for (const userId in connectedUsers) {
            if (connectedUsers[userId] === socket.id) {
                delete connectedUsers[userId];
                break;
            }
        }

        if (socket.dashboardUserId && socket.dashboardType) {
            if (connectedDashboards[socket.dashboardType] && connectedDashboards[socket.dashboardType][socket.dashboardUserId] === socket.id) {
                delete connectedDashboards[socket.dashboardType][socket.dashboardUserId];
                if (Object.keys(connectedDashboards[socket.dashboardType]).length === 0) {
                    delete connectedDashboards[socket.dashboardType];
                }
            }
            if (socket.specificDashboardId && connectedDashboards[socket.dashboardType]?.byEntityId) {
                if (connectedDashboards[socket.dashboardType]['byEntityId'][socket.specificDashboardId] === socket.id) {
                    delete connectedDashboards[socket.dashboardType]['byEntityId'][socket.specificDashboardId];
                }
            }
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
