import React, { useState, useEffect } from "react";
import "./PostCard.css";
import post1 from "../../../assets/appImages/1.jpeg";
import sampleProPic from "../../../assets/appImages/user.png";
import likeImg from "../../../assets/appImages/heart.png";
import heart from "../../../assets/appImages/like.png";
import { Send } from "@material-ui/icons";
import { Box, CircularProgress } from "@material-ui/core";
import axios from "axios";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../context/apiCall";
import InputEmoji from "react-input-emoji";
import toast from "react-hot-toast";
import { errorOptions, successOptions } from "../../utils/toastStyle";
import usePost from "../../../context/post/PostContext";
import useAuth from "../../../context/auth/AuthContext";

const PostCard = ({ post, fetchPosts }) => {
  const [like, setLike] = useState(post.likes?.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comm, setComm] = useState("");

  const { user: currentUser } = useAuth();
  const { getTimelinePosts } = usePost();

  // like a post (1 like per user)
  const likeHandler = () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      axios.put(
        `${BASE_URL}/post/${post._id}/like`,
        { userId: currentUser._id },
        config
      );
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const showCommentHandler = () => {
    setShowComment(!showComment);
  };

  // post a comment (1 comment by each user on a post, 2nd time get's edited)
  const postCommentHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      setCommentLoading(true);
      if (post._id) {
        await axios.put(
          `${BASE_URL}/post/comment/${post._id}`,
          { comment: comm },
          config
        );
      }
      setCommentLoading(false);
      toast.success("Comment posted successfully!", successOptions);
    } catch (error) {
      setCommentLoading(false);
      toast.error(error.response.data.message, errorOptions);
    }
    fetchPosts();
    setComm("");
  };

  // delete post
  const deleteHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      setCommentLoading(true);
      if (post._id) {
        await axios.delete(`${BASE_URL}/post/${post._id}`, config);
      }
      setCommentLoading(false);
      toast.success("Comment deleted successfully!", successOptions);
    } catch (error) {
      setCommentLoading(false);
      toast.error(error.response.data.message, errorOptions);
    }
    fetchPosts();
  };

  // get timeline posts
  useEffect(() => {
    getTimelinePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // see weather logged in user has liked the particular post if yes user can dislike else like
  useEffect(() => {
    setIsLiked(post.likes?.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  // get user details
  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      if (post.user) {
        const res = await axios.get(
          `${BASE_URL}/user?userId=${post.user}`,
          config
        );
        setUser(res.data);
      }
    };
    fetchUsers();
  }, [post.userId, currentUser.token, post.user]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user._id}`}>
              <img
                className="postProfileImg"
                src={user.profilePicture || sampleProPic}
                alt="..."
              />
            </Link>
            <span className="postUsername">{user.name}</span>
            <span className="postLocation">
              • {post.location || "Location"}
            </span>
            <span className="postDate">
              <Moment fromNow ago>
                {post.createdAt}
              </Moment>{" "}
              ago
            </span>
          </div>
          <div className="postTopRight">
            {currentUser._id === post.user ? (
              <>
                <button
                  style={{ backgroundColor: "#3b82f6" }}
                  className="shareButton"
                  onClick={deleteHandler}>
                  Delete
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.desc}</span>
          <img
            className="postImg"
            src={post.img ? post.img : post1}
            alt="..."
          />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              onClick={likeHandler}
              src={likeImg}
              alt="like"
            />
            <img
              className="likeIcon"
              onClick={likeHandler}
              src={heart}
              alt="heart"
            />
            <span className="postLikeCounter">{like} people liked it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={showCommentHandler}>
              {post?.comments.length} comments
            </span>
          </div>
        </div>
        {commentLoading && (
          <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}
        <div className="postCommentCont">
          <div className="postCommentCont-1">
            <InputEmoji
              value={comm}
              onChange={setComm}
              placeholder={`Post a comment....`}
            />
          </div>
          <div className="postCommentCont-2">
            <button
              className="postCommentBtn"
              onClick={postCommentHandler}
              disabled={commentLoading ? true : false}>
              <Send style={{ fontSize: "18px" }} />
            </button>
          </div>
        </div>

        {post?.comments.map((comment) => {
          return (
            <div
              className="postCommentsBox"
              style={{ display: showComment ? "" : "none" }}
              key={comment?._id}>
              <div className="postCommentUser">
                <img
                  className="postProfileImg"
                  src={comment.proPic || sampleProPic}
                  alt="..."
                />
                <span className="postCommentUserName">{comment.userName}</span>
              </div>
              <div className="postCommentContent">
                <span>{comment.comment}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostCard;
