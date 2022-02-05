import React, { useState, useEffect } from "react";
import "./EditProfile.css";
import "../profile/Profile.css";
import noCover from "../../assets/appImages/noCover.jpg";
import sampleProPic from "../../assets/appImages/user.png";
import Topbar from "../timeline/topbar/Topbar";
import Sidebar from "../timeline/sidebar/Sidebar";
import { useParams } from "react-router-dom";
import useAuth from "../../context/auth/AuthContext";
import { BASE_URL } from "../../context/apiCall";
import axios from "axios";
import useProfile from "../../context/profile/ProfileContext";
import { Box, CircularProgress } from "@material-ui/core";
import toast, { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";
import useTheme from "../../context/ThemeContext";

const EditProfile = () => {
  // all states for user update fields
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [proPicUrl, setProPicUrl] = useState("");
  const [coverPicUrl, setCoverPicUrl] = useState("");
  const [picLoading, setPicLoading] = useState(false);

  const [user, setUser] = useState({});

  const params = useParams();

  // from context
  const { user: currentUser } = useAuth();
  const { editUser, loading } = useProfile();
  const { theme } = useTheme();

  // get user details
  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const res = await axios.get(
        `${BASE_URL}/user?userId=${params.userId}`,
        config
      );
      setUser(res.data);
    };
    fetchUsers();
  }, [params.userId, currentUser.token]);

  // upload user profile picture to cloudinary
  const postProPic = (pics) => {
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
          setProPicUrl(data.secure_url);
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

  // upload user cover picture to cloudinary
  const postCoverPic = (pics) => {
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
          setCoverPicUrl(data.secure_url);
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

  // update user profile
  const updateProfileHandler = (e) => {
    e.preventDefault();
    editUser(name, email, userDesc, city, from, proPicUrl, coverPicUrl);
  };

  // if user profile get's updated, push to home/ timeline screen
  // useEffect(() => {
  //   if (success) {
  //     history.push("/");
  //   }
  // }, [success, history]);

  return (
    <>
      <Helmet title="Edit profile | Splash Social" />
      <Toaster />
      <Topbar />
      <div
        className="profile"
        style={{ color: theme.foreground, background: theme.background }}>
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.coverPicture || noCover}
                alt="..."
              />
              <img
                className="profileUserImg"
                src={user.profilePicture || sampleProPic}
                alt="..."
              />
            </div>
            {loading && (
              <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
                <CircularProgress color="secondary" />
              </Box>
            )}
            <section className="editProfile-container">
              <div className="editProfile-box">
                <h3 className="editProfile-heading">Update Profile</h3>
                <form onSubmit={updateProfileHandler}>
                  <input
                    className="editProfile-input"
                    type="text"
                    placeholder={user?.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="editProfile-input"
                    type="email"
                    placeholder={user?.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="editProfile-input"
                    type="text"
                    placeholder={
                      user?.desc ? user?.desc : "Describe yourself...."
                    }
                    value={userDesc}
                    onChange={(e) => setUserDesc(e.target.value)}
                  />
                  <input
                    className="editProfile-input"
                    type="text"
                    placeholder={user?.city ? user?.city : "Which city...."}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <input
                    className="editProfile-input"
                    type="text"
                    placeholder={
                      user?.from ? user?.from : "Where are you from...."
                    }
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                  {picLoading && (
                    <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
                      <CircularProgress color="secondary" />
                    </Box>
                  )}
                  <div>
                    <label htmlFor="proPic" className="editProfile-label">
                      Upload Profile Picture
                    </label>
                    <input
                      id="proPic"
                      className="editProfileFile-input"
                      type="file"
                      accept=".png, .jpeg, .jpg"
                      onChange={(e) => postProPic(e.target.files[0])}
                    />
                    {proPicUrl && (
                      <div className="profilePicPreview">
                        <a href={proPicUrl} target="_blank" rel="noreferrer">
                          {proPicUrl}
                        </a>
                      </div>
                    )}
                  </div>
                  <label htmlFor="coverPic" className="editProfile-label">
                    Upload Cover Picture
                  </label>
                  <input
                    className="editProfileFile-input"
                    id="coverPic"
                    type="file"
                    accept=".png, .jpeg, .jpg"
                    onChange={(e) => postCoverPic(e.target.files[0])}
                  />
                  {coverPicUrl && (
                    <div className="profilePicPreview">
                      <a href={coverPicUrl} target="_blank" rel="noreferrer">
                        {coverPicUrl}
                      </a>
                    </div>
                  )}
                  <div className="editProfile-btnBox">
                    <button type="submit" className="editProfile-btn">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
