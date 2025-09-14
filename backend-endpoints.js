// Add this to your backend authRoutes.js file

// Step 5: Verify session endpoint - used by frontend to check if user is logged in
router.get("/verify-session", async (req, res) => {
  try {
    const authenticated = await isAuthenticated(req);
    
    if (authenticated) {
      logger.info("✅ User session verified");
      return res.status(200).json({ authenticated: true });
    } else {
      logger.info("❌ Invalid or expired session");
      return res.status(401).json({ authenticated: false });
    }
  } catch (error) {
    logger.error("❌ Session verification error", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      message: "Session verification failed",
    });
  }
});

// Update the /me endpoint to return user info
router.get("/me", async (req, res) => {
  try {
    if (!(await isAuthenticated(req))) {
      logger.warn("❌ Unauthorized access to /me endpoint");
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Get user from request (set by isAuthenticated middleware)
    const user = req.user;
    
    // Return only necessary user info
    return res.status(200).json({
      email: user.email,
      name: user.name,
      profileImage: user.profileImage || null,
      // Add any other user properties you want to expose to the frontend
    });
  } catch (error) {
    logger.error("❌ Error getting user data", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      message: "Failed to get user data",
    });
  }
});
