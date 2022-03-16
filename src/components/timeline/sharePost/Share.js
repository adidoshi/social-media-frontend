import React, { useEffect, useState } from "react";
import "./Share.css";
import noAvatar from "../../../assets/appImages/user.png";
import { PermMedia, Room, Cancel } from "@material-ui/icons";
import useAuth from "../../../context/auth/AuthContext";
import usePost from "../../../context/post/PostContext";
import { Box, CircularProgress } from "@material-ui/core";
import toast, { Toaster } from "react-hot-toast";
import InputEmoji from "react-input-emoji";
import { Country } from "country-state-city";
import axios from "axios";
import { BASE_URL } from "../../../context/apiCall";

const Share = ({ fetchPosts }) => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [url, setUrl] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [liveUser, setLiveUser] = useState({});

  const { user } = useAuth();
  const { createPost, createLoading } = usePost();

  // upload post picture to cloudinary
  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast.error("Please Select an Image!");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "splash-social_media");
      data.append("cloud_name", "splashcloud");
      fetch("https://api.cloudinary.com/v1_1/splashcloud/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.secure_url);
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast.error("Please select an image with png/jpg type");
      setPicLoading(false);
      return;
    }
  };

  // share a post
  const postSubmitHandler = (e) => {
    e.preventDefault();
    if (url) {
      const newPost = {
        user: user._id,
        desc: description,
        location: location,
        pic: url,
      };
      createPost(newPost.user, newPost.desc, newPost.location, newPost.pic);
      setUrl(null);
      setDescription("");
      setLocation("");
      fetchPosts();
    }
  };

  // get user details
  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.get(
        `${BASE_URL}/user?userId=${user._id}`,
        config
      );
      setLiveUser(res.data);
    };
    fetchUsers();
  }, [user._id, user.token]);

  return (
    <>
      <Toaster />
      <div className="share">
        <form className="shareWrapper" onSubmit={postSubmitHandler}>
          <div className="shareTop">
            <img
              className="shareProfileImg"
              src={
                liveUser?.profilePicture ? liveUser?.profilePicture : noAvatar
              }
              alt="..."
            />
            <InputEmoji
              value={description}
              onChange={setDescription}
              placeholder={`What's on your mind ${liveUser?.name}?`}
            />
          </div>
          <hr className="shareHr" />
          {picLoading && (
            <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
              <CircularProgress color="secondary" />
            </Box>
          )}
          {url && (
            <div className="shareImgContainer">
              <img className="shareimg" src={url} alt="..." />
              <Cancel className="shareCancelImg" onClick={() => setUrl(null)} />
            </div>
          )}
          <div className="shareBottom">
            <div className="shareOptions">
              <label htmlFor="file" className="shareOption">
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Photo</span>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={(e) => postDetails(e.target.files[0])}
                />
              </label>
              <div className="shareOption">
                <label htmlFor="loc" className="shareOption">
                  <Room htmlColor="green" className="shareIcon" />
                  <select
                    id="loc"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}>
                    <option>Location</option>
                    {Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.name} id="loc">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <button
              className="shareButton"
              type="submit"
              disabled={createLoading ? true : false}>
              Share
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Share;
