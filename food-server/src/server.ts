import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/userRoute";
// import restaurantRoute from "../routes/restaurantRoute";
// import menuRoute from "../routes/menuRoute";
// import orderRoute from "../routes/orderRoute";
import connectDB from "./db/db";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;



// Middleware
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : "http://localhost:5173",
    credentials: true
};
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API!');
  });

// API routes
app.use("/api/user", userRoute);
// app.use("/api/restaurant", restaurantRoute);
// app.use("/api/menu", menuRoute);
// app.use("/api/order", orderRoute);


// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
};

startServer();