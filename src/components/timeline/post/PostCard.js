import React, { useState, useEffect } from "react";
import "./PostCard.css";
import post1 from "../../../assets/appImages/1.jpeg";
import sampleProPic from "../../../assets/appImages/user.png";
import likeImg from "../../../assets/appImages/heart.png";
import heart from "../../../assets/appImages/like.png";
import { MoreVert, Send } from "@material-ui/icons";
import axios from "axios";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import useAuth from "../../../context/auth/AuthContext";
import { BASE_URL } from "../../../context/apiCall";
import InputEmoji from "react-input-emoji";
import toast from "react-hot-toast";
import { errorOptions, successOptions } from "../../utils/toastStyle";
import { Box, CircularProgress } from "@material-ui/core";
import usePost from "../../../context/post/PostContext";

const PostCard = ({ post }) => {
  const [like, setLike] = useState(post.likes?.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useAuth();
  const { getTimelinePosts } = usePost();

  const [comm, setComm] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [showComment, setShowComment] = useState(false);

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
        { userId: currentUser.id },
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
    getTimelinePosts();
    setComm("");
  };

  useEffect(() => {
    getTimelinePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLiked(post.likes?.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const res = await axios.get(
        `${BASE_URL}/user?userId=${post.user}`,
        config
      );
      setUser(res.data);
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
            <span className="postLocation">• {post.location}</span>
            <span className="postDate">
              <Moment fromNow ago>
                {post.createdAt}
              </Moment>{" "}
              ago
            </span>
          </div>
          <div className="postTopRight">
            <MoreVert />
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
            <button className="postCommentBtn" onClick={postCommentHandler}>
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