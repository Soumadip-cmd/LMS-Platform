import express from "express";
import { 
    createLanguage, 
    getAllLanguages, 
    getLanguageById, 
    updateLanguage, 
    deleteLanguage 
} from "../../controller/language/language.controller.js";
import { isAuthenticated, isAdmin } from "../../middlewares/isAuthenticated.js";
import multer from "multer";

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

const languageRouter = express.Router();

// Public routes
languageRouter.get('/all', getAllLanguages);
languageRouter.get('/:id', getLanguageById);

// Admin only routes
languageRouter.post('/create', 
    isAuthenticated, 
    isAdmin, 
    upload.single("icon"), 
    createLanguage
);

languageRouter.put('/update/:id', 
    isAuthenticated, 
    isAdmin, 
    upload.single("icon"), 
    updateLanguage
);

languageRouter.delete('/delete/:id', 
    isAuthenticated, 
    isAdmin, 
    deleteLanguage
);

export default languageRouter;