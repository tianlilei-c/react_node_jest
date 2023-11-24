const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization');
    res.status(200).json({ message: 'verifyToken successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
