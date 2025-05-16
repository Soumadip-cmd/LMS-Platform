import jwt from 'jsonwebtoken';

export const generateToken = (res, user, message, existingUser = false) => {
  // Generate JWT token with user ID and role
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
      uniqueSignature: Date.now().toString()
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d",
      algorithm: 'HS256'
    }
  );

  // Set cookie domain based on environment
  const cookieDomain = process.env.NODE_ENV === 'production'
    ? process.env.COOKIE_DOMAIN || '.preplings.com' // Use .preplings.com to work on both www and non-www
    : 'localhost';

  // Set cookie with token
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Less strict than 'strict'
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
    domain: cookieDomain
  });

  // Return response with token included for clients that can't access cookies
  return res.status(200).json({
    success: true,
    message,
    existingUser,
    token: token, // Include token in response
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl
    }
  });
};