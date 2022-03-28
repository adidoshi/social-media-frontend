import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { BASE_URL } from "../../context/apiCall";
import useAuth from "../../context/auth/AuthContext";
import Feed from "./feed/Feed";
import Rightbar from "./rightbar/Rightbar";
import SearchUser from "./searchUser/SearchUser";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";

const Timeline = () => {
  const [searchFriends, setSearchFriends] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const { user: currentUser } = useAuth();
  const [toggle, setToggle] = useState(false);

  const history = useHistory();

  // logout user and redirect to login page
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.go("/login");
  };

  // Toggle menu
  const menuHandler = () => {
    setToggle(!toggle);
  };

  // search user request
  const searchHandler = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
    const res = await axios.get(
      `${BASE_URL}/user/all?keyword=${searchKey}}`,
      config
    );
    setSearchFriends(res.data);
    setSearchKey("");
  };
  return (
    <>
      <Helmet title="Timeline | Splash Social" />
      <Toaster />
      <Topbar
        searchHandler={searchHandler}
        setSearchKey={setSearchKey}
        searchKey={searchKey}
        menuHandler={menuHandler}
      />
      {toggle && (
        <div className="sidebar-resp">
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search for friend...example - 'aditya'"
              className="searchInput "
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
          <button
            style={{ margin: "0.6rem" }}
            className="shareButton"
            onClick={searchHandler}>
            Search
          </button>
          <h4 className="rightbarTitle sb">Search Friends Results</h4>
          <ul className="rightbarFriendList">
            {searchFriends &&
              searchFriends.map((u) => <SearchUser key={u._id} user={u} />)}
          </ul>
          <button className="sidebarButton" onClick={logoutHandler}>
            Logout
          </button>
          <hr className="sidebarHr" />
        </div>
      )}
      <div className="homeContainer">
        <Sidebar searchFriends={searchFriends} toggle={toggle} />
        <Feed />
        <Rightbar />
      </div>
    </>
  );
};

export default Timeline;
