const express = require('express');
const router = express.Router();
const Articles = require('../../models/articles');
const User = require('../../models/user');

router.post('/', async (req, res) => {
  try {
    const { userId, title, body, image } = req.body;
    const user = await User.findOne({ _id:userId });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const article = new Articles({
      userId,
      title,
      body,
      image
    });
    await article.save();
    res.status(201).json({ message: 'Article created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the article' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // const { userId, title, body, image } = req.body;
    // const user = await User.findOne({ _id: userId });
    // if (!user) {
    //   return res.status(400).json({ error: 'User not found' });
    // }
    // const article = await Articles.findById(req.params.id);
    // if (!article) {
    //   return res.status(404).json({ error: 'Article not found' });
    // }
    // article.userId = userId;
    // article.title = title;
    // article.body = body;
    // article.image = image;
    // await article.save();
    res.status(200).json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the article' });
  }
});

router.get('/', async (req, res) => {
  try {
    if (req.query.userId) {
      const article = await Articles.find({userId:req.query.userId});
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.status(200).json(article);
    } else {
      const articles = await Articles.find();
      res.status(200).json(articles);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving articles' });
  }
});



module.exports = router;
