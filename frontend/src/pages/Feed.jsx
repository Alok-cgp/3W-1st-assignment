import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Avatar, TextField, Button, IconButton, Divider, Card, CardHeader, CardContent, CardActions, CardMedia, Fab } from '@mui/material';
import {
  PhotoCamera,
  Favorite,
  FavoriteBorder,
  Comment,
  Send,
  Search,
  Add,
  Share,
  EmojiEmotions as EmojiEmotionsIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Campaign as CampaignIcon,
  PushPin as PushPinIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Language as LanguageIcon,
  Leaderboard as LeaderboardIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Stars as StarsIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const { user } = useAuth();

  // Fetch all posts from the backend with pagination
  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts?page=${pageNum}&limit=5`);
      const { posts: newPosts, totalPages } = res.data;
      
      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      setHasMore(pageNum < totalPages);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to fetch posts');
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    if (hasMore) {
      fetchPosts(page + 1, true);
    }
  };

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Create a new post with optional text and image
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!text && !image) return toast.error('Post cannot be empty');

    const formData = new FormData();
    formData.append('text', text);
    if (image) formData.append('image', image);

    try {
      // Axios defaults include the Auth token set in AuthContext
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setText('');
      setImage(null);
      setImagePreview('');
      fetchPosts();
      toast.success('Post created!');
    } catch (err) {
      toast.error('Failed to create post');
    }
  };

  // Handle like/unlike functionality
  const handleLike = async (postId) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/like/${postId}`);
      fetchPosts();
    } catch (err) {
      toast.error('Failed to like post');
    }
  };

  // Handle adding a comment
  const handleComment = async (postId, commentText) => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/posts/comment/${postId}`, { text: commentText });
      fetchPosts();
    } catch (err) {
      toast.error('Failed to comment');
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 2, pb: 4, px: { xs: 2, md: 4 } }}>
      {/* Top Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Social</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff', borderRadius: 5, px: 1, py: 0.2, border: '1px solid #ddd' }}>
            <StarsIcon sx={{ color: 'orange', fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2" fontWeight="bold">107</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff', borderRadius: 5, px: 1, py: 0.2, border: '1px solid #ddd' }}>
            <AccountBalanceWalletIcon sx={{ color: 'green', fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2" fontWeight="bold">₹0.00</Typography>
          </Box>
          <IconButton size="small" onClick={() => toast.info('Notifications coming soon!')}><NotificationsIcon /></IconButton>
          <Avatar 
            sx={{ width: 32, height: 32, bgcolor: 'orange', cursor: 'pointer' }}
            onClick={() => toast.info(`Profile: ${user?.username}`)}
          >
            {user?.username?.[0]}
          </Avatar>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, bgcolor: '#fff', p: 1, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f0f2f5', borderRadius: 20, px: 2, py: 0.5, width: '100%' }}>
          <Search sx={{ color: 'gray', mr: 1 }} />
          <TextField 
            variant="standard" 
            placeholder="Search promotions, users, posts..." 
            fullWidth 
            InputProps={{ disableUnderline: true }}
          />
          <IconButton 
            size="small" 
            onClick={() => toast.info('Search functionality coming soon!')}
            sx={{ bgcolor: '#1976d2', color: '#fff', '&:hover': { bgcolor: '#1565c0' }, ml: 1 }}
          >
            <Search fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 2 }}>Create Post</Typography>
        <Box sx={{ display: 'flex', bgcolor: '#e0e0e0', borderRadius: 20, p: 0.5 }}>
          <Button variant="contained" size="small" sx={{ borderRadius: 20, bgcolor: '#1976d2', textTransform: 'none', px: 2 }}>All Posts</Button>
          <Button variant="text" size="small" sx={{ borderRadius: 20, color: 'gray', textTransform: 'none', px: 2 }}>Promotions</Button>
        </Box>
      </Box>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto', pb: 1 }}>
        <Button variant="contained" size="small" sx={{ borderRadius: 20, bgcolor: '#1976d2', textTransform: 'none', minWidth: 'fit-content' }}>All Post</Button>
        <Button variant="outlined" size="small" sx={{ borderRadius: 20, color: 'gray', borderColor: '#ddd', textTransform: 'none', minWidth: 'fit-content' }}>Most Liked</Button>
        <Button variant="outlined" size="small" sx={{ borderRadius: 20, color: 'gray', borderColor: '#ddd', textTransform: 'none', minWidth: 'fit-content' }}>Most Commented</Button>
        <Button variant="outlined" size="small" sx={{ borderRadius: 20, color: 'gray', borderColor: '#ddd', textTransform: 'none', minWidth: 'fit-content' }}>Most Shared</Button>
      </Box>

      {/* Create Post */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="What's on your mind?"
            variant="standard"
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
        </Box>
        <Divider sx={{ mb: 2 }} />
        {imagePreview && (
          <Box sx={{ mb: 2, position: 'relative' }}>
            <img src={imagePreview} alt="Preview" style={{ width: '100%', borderRadius: 8 }} />
            <Button 
              size="small" 
              onClick={() => { setImage(null); setImagePreview(''); }}
              sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff' }}
            >
              X
            </Button>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="icon-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            <IconButton color="primary">
              <EmojiEmotionsIcon />
            </IconButton>
            <IconButton color="primary">
              <FormatListBulletedIcon />
            </IconButton>
            <Button startIcon={<CampaignIcon />} sx={{ textTransform: 'none', color: '#1976d2', fontWeight: 'bold' }}>
              Promote
            </Button>
          </Box>
          <Button 
            variant="contained" 
            endIcon={<Send />} 
            onClick={handleCreatePost}
            disabled={!text && !image}
            sx={{ borderRadius: 20, px: 3, bgcolor: (!text && !image) ? '#ccc' : '#1976d2' }}
          >
            Post
          </Button>
        </Box>
      </Paper>

      {/* Feed */}
      {posts.map((post) => (
         <Card key={post._id} sx={{ mb: 3, borderRadius: 3, position: 'relative' }}>
          <IconButton sx={{ position: 'absolute', top: 10, right: 10, color: '#ff4444' }}>
            <PushPinIcon sx={{ transform: 'rotate(45deg)' }} />
          </IconButton>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: '#1976d2' }}>{post.username[0].toUpperCase()}</Avatar>}
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">{post.username}</Typography>
                <Typography variant="body2" color="text.secondary">@{post.username.toLowerCase()}</Typography>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={() => toast.success(`Following ${post.username}`)}
                  sx={{ borderRadius: 20, py: 0, textTransform: 'none', height: 24, bgcolor: '#1976d2' }}
                >
                  Follow
                </Button>
              </Box>
            }
            subheader={new Date(post.createdAt).toLocaleString()}
          />
          {post.text && (
            <CardContent>
              <Typography variant="body1" color="text.primary">
                {post.text}
              </Typography>
            </CardContent>
          )}
          {post.image && (
            <CardMedia
              component="img"
              image={`http://localhost:5000${post.image}`}
              alt="Post image"
              sx={{ maxHeight: 400, objectFit: 'contain', bgcolor: '#f0f2f5' }}
            />
          )}
          <CardActions disableSpacing>
            <IconButton onClick={() => handleLike(post._id)}>
              {post.likes.includes(user?.id) ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2" sx={{ mr: 2 }}>{post.likes.length}</Typography>
            
            <IconButton>
              <Comment />
            </IconButton>
            <Typography variant="body2" sx={{ mr: 2 }}>{post.comments.length}</Typography>

            <IconButton>
               <Share />
             </IconButton>
           </CardActions>
          
          {/* Comments Section (Simplified) */}
          <Divider />
          <Box sx={{ p: 2 }}>
            {post.comments.slice(-2).map((comment, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">{comment.username}</Typography>
                <Typography variant="body2">{comment.text}</Typography>
              </Box>
            ))}
            <Box sx={{ display: 'flex', mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleComment(post._id, e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </Box>
          </Box>
        </Card>
      ))}

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button 
            variant="outlined" 
            onClick={handleLoadMore}
            sx={{ borderRadius: 20, textTransform: 'none' }}
          >
            Load More Posts
          </Button>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ position: 'fixed', bottom: 20, right: 20, bgcolor: '#1976d2' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default Feed;
