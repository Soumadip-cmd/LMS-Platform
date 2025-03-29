import { User } from "../../models/user.model.js";
import { getOnlineUsers, isUserOnline } from "../../socket/socket.js";

/**
 * Get all online users
 * @route GET /api/users/online
 * @access Private
 */
export const getOnlineUsersList = async (req, res) => {
    try {
        const onlineUserIds = getOnlineUsers();
        
        // Fetch user details for online users
        const onlineUsers = await User.find({
            _id: { $in: onlineUserIds }
        }).select("name photoUrl role");
        
        return res.status(200).json({
            success: true,
            onlineUsers
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch online users"
        });
    }
};

/**
 * Check if a specific user is online
 * @route GET /api/users/:userId/online
 * @access Private
 */
export const checkUserOnlineStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const isOnline = isUserOnline(userId);
        
        return res.status(200).json({
            success: true,
            isOnline
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to check user status"
        });
    }
};