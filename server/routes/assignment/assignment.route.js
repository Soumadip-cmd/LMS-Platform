import express from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  addAssignmentAttachment,
  removeAssignmentAttachment
} from '../../controller/assignment/assignment.controller.js';
import { isAuthenticated, isInstructorOrAdmin } from '../../middlewares/isAuthenticated.js';
import { upload } from '../../middlewares/multer.js';

const assignmentRouter = express.Router();

// Apply authentication to all routes
assignmentRouter.use(isAuthenticated);

// GET all assignments (with filters)
assignmentRouter.get('/', getAssignments);

// GET assignment by ID
assignmentRouter.get('/:id', getAssignmentById);

// POST create a new assignment
assignmentRouter.post('/create', isInstructorOrAdmin, upload.single('file'), createAssignment);

// PUT update assignment
assignmentRouter.put('/:id', isInstructorOrAdmin, upload.single('file'), updateAssignment);

// DELETE assignment
assignmentRouter.delete('/:id', isInstructorOrAdmin, deleteAssignment);

// POST add attachment to assignment
assignmentRouter.post('/:id/attachments', isInstructorOrAdmin, upload.single('file'), addAssignmentAttachment);

// DELETE remove attachment from assignment
assignmentRouter.delete('/:id/attachments/:attachmentId', isInstructorOrAdmin, removeAssignmentAttachment);

export default assignmentRouter;
