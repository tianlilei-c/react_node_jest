const mockMiddles = (req, res, next) => {
  try {
    next();
  } catch (error) {
    res.status(401).json({ error: 'something error' });
  }
};

module.exports = mockMiddles;
