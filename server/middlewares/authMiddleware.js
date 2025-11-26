// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // 1. Get the token from the browser cookies
  const token = req.cookies.access_token;

  // 2. If no token, kick them out
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Access Denied: You are not logged in." 
    });
  }

  try {
    // 3. Verify the token using your Secret Key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach the user info to the request object
    // Now any controller after this can access req.user.id
    req.user = decoded; 
    
    // 5. Allow the request to proceed to the Controller
    next(); 

  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: "Invalid Token: Please login again." 
    });
  }
};