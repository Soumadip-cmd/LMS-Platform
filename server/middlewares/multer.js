import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter function to validate file types
const fileFilter = (req, file, cb) => {
    // Accept images, videos, PDFs, and common document formats
    const allowedFileTypes = [
        // Images
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
        // Videos
        '.mp4', '.webm', '.mov', '.avi', '.mkv',
        // Documents
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
        // Audio
        '.mp3', '.wav', '.ogg',
        // Other
        '.zip', '.txt'
    ];
    
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedFileTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type. Allowed types: ${allowedFileTypes.join(', ')}`), false);
    }
};

// Configure multer with size limits
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max file size
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 100MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    } else if (err) {
        // An unknown error occurred
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

export { upload, handleMulterError };