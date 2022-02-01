import React, { useState, useEffect } from "react";
import "./Topbar.css";
import axios from "axios";
import { NightsStay, Notifications, Search, WbSunny } from "@material-ui/icons";
import { Link } from "react-router-dom";
import useAuth from "../../../context/auth/AuthContext";
import useTheme, { themes } from "../../../context/ThemeContext";
import noAvatar from "../../../assets/appImages/user.png";
import { BASE_URL } from "../../../context/apiCall";

const Topbar = ({ searchHandler, setSearchKey, searchKey }) => {
  const [user, setUser] = useState();
  const { user: currentUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const themeModeHandler = () => {
    setTheme(theme === themes.light ? themes.dark : themes.light);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const res = await axios.get(
        `${BASE_URL}/user?userId=${currentUser.id}`,
        config
      );
      setUser(res.data);
    };
    fetchUsers();
  }, [currentUser.id, currentUser.token]);
  return (
    <>
      <div
        className="topbarContainer"
        style={{
          color: theme.topbarColor,
          background: theme.topbarBackground,
        }}>
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="topbarLogo">Splash Social</span>
          </Link>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search for friend"
              className="searchInput"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
        </div>
        <Search
          className="searchIcon"
          style={{ cursor: "pointer" }}
          onClick={searchHandler}
        />
        <div className="topbarRight">
          <div className="topbarLinks">
            <span className="topbarLink">Welcome {user?.name}</span>
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <Notifications />
              <span className="topbarIconBadge">1</span>
            </div>
            <div className="topbarIconItem" onClick={themeModeHandler}>
              {theme.background === "#ffffff" ? <WbSunny /> : <NightsStay />}
            </div>
          </div>
          <Link to={`/profile/${currentUser.id}`}>
            <img
              src={user?.profilePicture ? user?.profilePicture : noAvatar}
              alt="..."
              className="topbarImg"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Topbar;
