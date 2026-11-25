
const adminMiddleware = (req, res, next) => {
  // Check whether the user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Check whether the authenticated user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  next();
};

export default adminMiddleware;
