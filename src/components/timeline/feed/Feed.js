import React, { useEffect, useState } from "react";
import "./Feed.css";
import { useParams } from "react-router-dom";
import PostCard from "../post/PostCard";
import Share from "../sharePost/Share";
import { Box, CircularProgress } from "@material-ui/core";
import useAuth from "../../../context/auth/AuthContext";
import useTheme from "../../../context/ThemeContext";
import axios from "axios";
import { BASE_URL } from "../../../context/apiCall";

const Feed = ({ userId }) => {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        };
        setLoading(true);
        const res = userId
          ? await axios.get(`${BASE_URL}/post/profile/${params.userId}`, config)
          : await axios.get(
              `${BASE_URL}/post/timeline/${currentUser.id}`,
              config
            );
        setLoading(false);
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [currentUser.id, params.userId, userId, currentUser.token]);

  return (
    <div
      className="feed"
      style={{ color: theme.foreground, background: theme.background }}>
      <div className="feedWrapper">
        {(!userId || userId === currentUser.id) && <Share />}
        {loading && (
          <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {posts && posts.map((p) => <PostCard post={p} key={p._id} />)}
      </div>
    </div>
  );
};

export default Feed;
