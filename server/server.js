import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import connectDB from "./database/db.js";
import mainRouter from "./routes/index.js";
import { initializeSocket } from "./socket/socket.js"; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = initializeSocket(server);
console.log("Socket.IO initialized successfully");

// Set port
const PORT = process.env.PORT || 8000;

// Apply middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  }));
  

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/lecture-videos', express.static(path.join(__dirname, 'uploads')));

// Serve static files for lecture videos and attachments
app.use('/lecture-videos', express.static(path.join(__dirname, 'public/lecture-videos')));
app.use('/lecture-attachments', express.static(path.join(__dirname, 'public/lecture-attachments')));
// Routes
app.use('/api/v1', mainRouter);

// Start server
server.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
    console.log(`Socket server running with configuration:`, {
        cors: {
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    console.log(`Socket.IO server is ready to accept connections`);
});