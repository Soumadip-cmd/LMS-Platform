// routes/contact.routes.js
import express from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
    searchContacts,
    getContactStats
} from "../../controller/contact-us/contact.controller.js";

const contactRouter = express.Router();


// Public routes


contactRouter.post("/create", createContact);

// Protected routes (admin only)


contactRouter.get("/", isAuthenticated, getAllContacts);


contactRouter.get("/stats", isAuthenticated, getContactStats);


contactRouter.get("/search", isAuthenticated, searchContacts);


contactRouter.get("/:contactId", isAuthenticated, getContactById);


contactRouter.patch("/:contactId", isAuthenticated, updateContact);


contactRouter.delete("/:contactId", isAuthenticated, deleteContact);

export default contactRouter;