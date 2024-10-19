import express from "express";
import dotenv from 'dotenv'
import path from "path";
import connectDb from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import solutionRoutes from './routes/solutionRoutes.js'
import complainRoutes from './routes/complainRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import codeRoutes from './routes/codeRoutes.js'
import jarvisRoutes from './routes/jarvisRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import statusRoutes from './routes/statusRoute.js'
import {v2 as cloudinary} from "cloudinary"
import { app,server } from "./socket/socket.js";
dotenv.config();


connectDb();

const PORT=process.env.PORT || 5000;
const __dirname = path.resolve();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/messages',messageRoutes)
app.use('/api/solutions',solutionRoutes)
app.use('/api/complain',complainRoutes)
app.use('/api/reports', reportRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/code',codeRoutes);
app.use('/api/jarvis',jarvisRoutes)
app.use('/api/notifications',notificationRoutes)
app.use('/api/status',statusRoutes)




if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

server.listen (PORT,()=>{
    console.log(`server started at ${PORT}`)
})