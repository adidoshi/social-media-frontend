import React, { useState, useEffect } from "react";
import "./Profile.css";
import noCover from "../../assets/appImages/noCover.jpg";
import sampleProPic from "../../assets/appImages/user.png";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../context/apiCall";
import Feed from "../timeline/feed/Feed";
import Rightbar from "../timeline/rightbar/Rightbar";
import Sidebar from "../timeline/sidebar/Sidebar";
import Topbar from "../timeline/topbar/Topbar";
import useAuth from "../../context/auth/AuthContext";
import Moment from "react-moment";
import { Avatar } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import useTheme from "../../context/ThemeContext";

const Profile = () => {
  const [user, setUser] = useState({});
  const params = useParams();

  const { user: currentUser } = useAuth();
  const { theme } = useTheme();

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
  return (
    <>
      <Helmet title={`${user.name} Profile | Splash Social`} />
      <Toaster />
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div
              className="profileCover"
              style={{ color: theme.foreground, background: theme.background }}>
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
              {params.userId === currentUser.id && (
                <Link to={`/editProfile/${currentUser.id}`}>
                  <div className="profile-edit-icon">
                    <Avatar
                      style={{ cursor: "pointer", backgroundColor: "blue" }}>
                      <Edit />
                    </Avatar>
                  </div>
                </Link>
              )}
            </div>
            <div
              className="profileInfo"
              style={{ color: theme.foreground, background: theme.background }}>
              <h4 className="profileInfoName">{user.name}</h4>
              <span className="profileInfoDesc">
                About me: {user.desc || "----"}
              </span>
              <small className="profileInfoDesc">
                Joined on:{" "}
                {(
                  <em>
                    <Moment format="YYYY/MM/DD">{user?.createdAt}</Moment>
                  </em>
                ) || "----"}
              </small>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed userId={params.userId} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
