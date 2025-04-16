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
/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - subject
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the contact
 *         firstName:
 *           type: string
 *           description: First name of the person
 *         lastName:
 *           type: string
 *           description: Last name of the person
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the person
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the person
 *         subject:
 *           type: string
 *           description: Subject of the contact request
 *         message:
 *           type: string
 *           description: Message content
 *         status:
 *           type: string
 *           enum: [pending, in-progress, resolved]
 *           default: pending
 *           description: Status of the contact request
 *         assignedTo:
 *           type: string
 *           description: ID of the admin assigned to this request
 *         response:
 *           type: string
 *           description: Admin's response to the contact request
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

// Public routes

/**
 * @swagger
 * /contact/create:
 *   post:
 *     summary: Submit a new contact request
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - subject
 *               - message
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 contact:
 *                   $ref: '#/components/schemas/Contact'
 *                 message:
 *                   type: string
 *                   example: Your message has been sent successfully. We'll get back to you soon.
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
contactRouter.post("/create", createContact);

// Protected routes (admin only)

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Get all contact requests (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, resolved]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of contact requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalDocuments:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
contactRouter.get("/", isAuthenticated, getAllContacts);

/**
 * @swagger
 * /contact/stats:
 *   get:
 *     summary: Get contact statistics (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contact statistics
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
contactRouter.get("/stats", isAuthenticated, getContactStats);

/**
 * @swagger
 * /contact/search:
 *   get:
 *     summary: Search contact requests (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Missing query
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
contactRouter.get("/search", isAuthenticated, searchContacts);

/**
 * @swagger
 * /contact/{contactId}:
 *   get:
 *     summary: Get a contact request by ID (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact request details
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
contactRouter.get("/:contactId", isAuthenticated, getContactById);


/**
 * @swagger
 * /contact/{contactId}:
 *   patch:
 *     summary: Update a contact request (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, resolved]
 *               assignedTo:
 *                 type: string
 *               response:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
contactRouter.patch("/:contactId", isAuthenticated, updateContact);

/**
 * @swagger
 * /contact/{contactId}:
 *   delete:
 *     summary: Delete a contact request (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
contactRouter.delete("/:contactId", isAuthenticated, deleteContact);

export default contactRouter;