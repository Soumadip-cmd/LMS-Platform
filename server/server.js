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

// Configure CORS with multiple origins support
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',')
    : ['http://localhost:3000', 'http://localhost:5173', 'https://preplings.com', 'https://www.preplings.com'];

// Add development origins if in development mode
if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:5173');
}

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Log the origin for debugging
        console.log('Request origin:', origin);
        console.log('Allowed origins:', allowedOrigins);

        // Check if the origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            // Special case for preplings.com and www.preplings.com
            if (origin.includes('preplings.com')) {
                console.log('Allowing preplings.com domain:', origin);
                callback(null, true);
            } else {
                console.log('CORS blocked origin:', origin);
                // In development, allow all origins
                if (process.env.NODE_ENV !== 'production') {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept', 'Origin', 'X-Requested-With']
}));



app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Special CORS handling for file upload routes
app.use('/api/v1/auth/upload-resume', (req, res, next) => {
    console.log("Server.js CORS middleware for file upload triggered:", {
        method: req.method,
        origin: req.headers.origin,
        contentType: req.headers['content-type']
    });

    // Set CORS headers specifically for file uploads
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        console.log("Handling OPTIONS preflight request in server.js");
        return res.status(200).end();
    }

    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/lecture-videos', express.static(path.join(__dirname, 'uploads')));

// Serve static files for lecture videos and attachments
app.use('/lecture-videos', express.static(path.join(__dirname, 'public/lecture-videos')));
app.use('/lecture-attachments', express.static(path.join(__dirname, 'public/lecture-attachments')));


// Routes
app.use('/api/v1', mainRouter);

app.get('/', (req, res) => {
    res.send("API Working..");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler caught:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});


// Start server
server.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
    console.log(`CORS configuration:`, {
        allowedOrigins: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    });
    console.log(`Socket server running with configuration:`, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    console.log(`Socket.IO server is ready to accept connections`);
});