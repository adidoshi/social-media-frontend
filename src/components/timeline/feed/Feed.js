import React, { useEffect } from "react";
import "./Feed.css";
import usePost from "../../../context/post/PostContext";
import PostCard from "../post/PostCard";
import Share from "../sharePost/Share";
import { Box, CircularProgress } from "@material-ui/core";
import useAuth from "../../../context/auth/AuthContext";
import useTheme from "../../../context/ThemeContext";

const Feed = ({ userId }) => {
  const { timelinePosts, getTimelinePosts, loading } = usePost();
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    getTimelinePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="feed"
      style={{ color: theme.foreground, background: theme.background }}>
      <div className="feedWrapper">
        {(!userId || userId === user.id) && <Share />}
        {loading && (
          <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {timelinePosts &&
          timelinePosts.map((p) => <PostCard post={p} key={p._id} />)}
      </div>
    </div>
  );
};

export default Feed;
