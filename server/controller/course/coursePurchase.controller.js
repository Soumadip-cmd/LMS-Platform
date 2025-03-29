import Razorpay from "razorpay";
import mongoose from "mongoose";
import crypto from "crypto";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursepurchase.model.js";
import { User } from "../models/user.model.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create a Razorpay order for course purchase
 * @route POST /api/payments/create-order
 * @access Private
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    // Validate courseId
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false, 
        message: "Course not found!"
      });
    }

    // Check if user already purchased this course
    const existingPurchase = await CoursePurchase.findOne({
      courseId,
      userId,
      status: "completed"
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this course"
      });
    }

    // Create a Razorpay order
    const options = {
      amount: Math.round(course.price * 100), // amount in smallest currency unit (paise for INR)
      currency: course.currency || "INR", // default to INR if not specified
      receipt: `receipt_order_${courseId}_${userId}_${Date.now()}`,
      notes: {
        courseId: courseId,
        userId: userId,
        courseTitle: course.title
      }
    };

    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      return res.status(400).json({
        success: false,
        message: "Error while creating payment order"
      });
    }

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.price,
      status: "pending",
      paymentId: order.id
    });

    await newPurchase.save();

    return res.status(200).json({
      success: true,
      order,
      course: {
        id: course._id,
        title: course.title,
        price: course.price,
        thumbnailUrl: course.thumbnailUrl
      },
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order"
    });
  }
};

/**
 * Verify Razorpay payment and update purchase status
 * @route POST /api/payments/verify
 * @access Private
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Find the purchase record
    const purchase = await CoursePurchase.findOne({
      paymentId: razorpay_order_id,
    }).populate("courseId");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase record not found"
      });
    }

    // Update purchase status
    purchase.status = "completed";
    await purchase.save();

    // Update user's enrolledCourses
    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } },
      { new: true }
    );

    // Update course to add user to enrolledStudents
    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudents: purchase.userId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      courseId: purchase.courseId._id
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment"
    });
  }
};

/**
 * Webhook handler for Razorpay events
 * @route POST /api/payments/webhook
 * @access Public
 */
export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    
    if (digest !== req.headers['x-razorpay-signature']) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature"
      });
    }
    
    // Handle webhook event
    const event = req.body;
    
    if (event.event === 'payment.authorized' || event.event === 'payment.captured') {
      const paymentId = event.payload.payment.entity.order_id;
      
      // Find the purchase record
      const purchase = await CoursePurchase.findOne({
        paymentId: paymentId
      }).populate("courseId");

      if (!purchase) {
        return res.status(200).send(); // Acknowledge receipt even if purchase not found
      }

      // Update purchase status if not already completed
      if (purchase.status !== "completed") {
        purchase.status = "completed";
        await purchase.save();
        
        // Update user's enrolledCourses
        await User.findByIdAndUpdate(
          purchase.userId,
          { $addToSet: { enrolledCourses: purchase.courseId._id } },
          { new: true }
        );

        // Update course to add user to enrolledStudents
        await Course.findByIdAndUpdate(
          purchase.courseId._id,
          { $addToSet: { enrolledStudents: purchase.userId } },
          { new: true }
        );
      }
    }
    
    // Always acknowledge receipt of webhook
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(200).send(); // Always acknowledge receipt, even on error
  }
};

/**
 * Get course details with purchase status
 * @route GET /api/payments/course/:courseId
 * @access Private
 */
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Validate courseId
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }

    const course = await Course.findById(courseId)
      .populate("instructor", "name photoUrl")
      .populate("lessons");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed"
    });

    return res.status(200).json({
      success: true,
      course,
      purchased: !!purchased // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details with purchase status"
    });
  }
};

/**
 * Get all user's purchased courses
 * @route GET /api/payments/my-courses
 * @access Private
 */
export const getUserPurchasedCourses = async (req, res) => {
  try {
    const userId = req.id;

    const purchases = await CoursePurchase.find({
      userId,
      status: "completed"
    }).populate({
      path: "courseId",
      select: "title level description thumbnailUrl instructor",
      populate: {
        path: "instructor",
        select: "name photoUrl"
      }
    });

    if (!purchases || purchases.length === 0) {
      return res.status(200).json({
        success: true,
        courses: []
      });
    }

    // Format the response
    const courses = purchases.map(purchase => purchase.courseId);

    return res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchased courses"
    });
  }
};

/**
 * Get all purchases (Admin only)
 * @route GET /api/payments/all-purchases
 * @access Admin
 */
export const getAllPurchases = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get purchases with pagination
    const purchases = await CoursePurchase.find(query)
      .populate("courseId", "title price")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const totalPurchases = await CoursePurchase.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      purchases,
      pagination: {
        totalPurchases,
        totalPages: Math.ceil(totalPurchases / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchases"
    });
  }
};