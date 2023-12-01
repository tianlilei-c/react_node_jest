const express = require('express');
const router = express.Router();
const Articles = require('../../models/articles');
const User = require('../../models/user');
const Followers = require('../../models/followerlist');

router.post('/', async (req, res) => {
  try {
    const { userId, title, body, image } = req.body;
    const user = await User.findOne({ _id: userId });
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

router.put('/', async (req, res) => {
  try {
    const { title, body, image, articleId } = req.body;
    const article = await Articles.findById(articleId);
    let userId = req.user._id
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    if (article.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to update this article' });
    }
    if (title != null && title.trim() !== '') {
      article.title = title;
    }
    if (body != null && body.trim() !== '') {
      article.body = body;
    }
    if (image != null && image.trim() !== '') {
      article.image = image;
    }

    await article.save();
    res.status(200).json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the article' });
  }
});


router.get('/', async (req, res) => {
  try {
    let userIds = [];
    userIds.push(req.user._id);
    const followers = await Followers.findOne({ username: req.user.username });
    if (followers && followers.followers.length > 0) {
      const followerUsers = await User.find({ username: { $in: followers.followers } });
      userIds = userIds.concat(followerUsers.map(user => user._id));
    }
    const articles = await Articles.find({ userId: { $in: userIds } });
    res.status(200).json(articles);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving articles' });
  }
});

router.post('/:articleId/comments', async (req, res) => {
  try {
    const { commenterId, commenterName, comment } = req.body;
    const articleId = req.params.articleId;
    const article = await Articles.findById(articleId);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    const newComment = {
      commenterId,
      commenterName,
      comment
    };

    article.comments.push(newComment);
    await article.save();
    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding a comment' });
  }
});

router.delete('/:articleId/comments/:commentId', async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const commentId = req.params.commentId;

    const article = await Articles.findById(articleId);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Find the index of the comment in the article's comments array
    const commentIndex = article.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Remove the comment from the article's comments array
    article.comments.splice(commentIndex, 1);

    // Save the updated article
    await article.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the comment' });
  }
});




module.exports = router;
