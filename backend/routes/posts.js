const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create Post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Post creation attempt by user ID:', req.userId);
    const { text } = req.body;
    
    // Find user and handle case where user might not exist in DB anymore
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in again.' });
    }
    
    if (!text && !req.file) {
      return res.status(400).json({ message: 'Post must have text or an image' });
    }

    const newPost = new Post({
      user: req.userId,
      username: user.username, // Safe now because we checked if user exists
      text,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error('CRITICAL POST ERROR:', {
      message: err.message,
      stack: err.stack,
      body: req.body,
      file: req.file ? req.file.filename : 'none'
    });
    res.status(500).json({ 
      message: 'Server error while creating post',
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Get all posts with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Post.countDocuments();
    
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike Post
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(req.userId)) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== req.userId);
    } else {
      // Like
      post.likes.push(req.userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Comment on Post
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const user = await User.findById(req.userId);
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      user: req.userId,
      username: user.username,
      text
    };

    post.comments.push(newComment);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
