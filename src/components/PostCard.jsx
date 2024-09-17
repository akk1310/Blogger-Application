import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth"; // Import AuthService

const PostCard = ({ $id, title, featuredImage, initialLikes = [] }) => {
  const [likes, setLikes] = useState(initialLikes.length || 0);
  const [liked, setLiked] = useState(false); // Track if the user has liked the post
  const [currentUserId, setCurrentUserId] = useState(null); // Store current user ID

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUserId(user.$id);
  
          // Fetch updated post likes from the backend
          const updatedPost = await appwriteService.getPost($id);
          if (updatedPost) {
            setLikes(updatedPost.likes.length); // Set the correct number of likes
            const userLiked = updatedPost.likes.includes(user.$id); //true/false
            setLiked(userLiked); // Set whether the user has liked the post
          }
        }
      } catch (error) {
        console.error('Error fetching current user or post data:', error);
      }
    };
  
    fetchCurrentUser();
  }, [$id]);

  

  const handleLike = async () => {
    try {
      if (!currentUserId) return; // Ensure user is logged in

      let result;
      if (liked) {
        // Unlike the post
        result = await appwriteService.unlikePost($id, currentUserId);
        if (result) {
          setLikes(prevLikes => prevLikes - 1); // Update like count
          setLiked(false); // Set liked to false
        }
      } else {
        // Like the post
        result = await appwriteService.likePost($id, currentUserId);
        if (result) {
          setLikes(prevLikes => prevLikes + 1); // Update like count
          setLiked(true); // Set liked to true
        }
      }
    } catch (error) {
      console.error('Error handling like/unlike:', error);
    }
  };

  return (
    <div className="w-full  bg-[#eaeaea] rounded-xl p-4 min-h-[400px]">
        <Link to={`/post/${$id}`}>
      <div className="w-full border-2 border-black/20 rounded-xl p-1 px-2 min-h-64 flex justify-center mb-4 items-center">
          <img
            className="rounded-xl flex justify-center items-center"
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
          />
      </div>
        </Link>
      <Link to={`/post/${$id}`}>
        <h2 className="text-xl font-bold">{title}</h2>
      </Link>

      {/* Like Button and Like Count */}
      <div className="flex items-center  mt-4">
        <button
          onClick={handleLike}
          className="w-8 text-xl"
        >
          {liked ? '💖' : '🤍'}
        </button>
        <span>{likes}</span>
      </div>
    </div>
  );
};

export default PostCard;
