import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { BASE_URL } from "../../context/apiCall";
import useAuth from "../../context/auth/AuthContext";
import Feed from "./feed/Feed";
import Rightbar from "./rightbar/Rightbar";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";

const Timeline = () => {
  const [searchFriends, setSearchFriends] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const { user: currentUser } = useAuth();

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
  };
  return (
    <>
      <Helmet title="Timeline | Splash Social" />
      <Toaster />
      <Topbar
        searchHandler={searchHandler}
        setSearchKey={setSearchKey}
        searchKey={searchKey}
      />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        <Rightbar searchFriends={searchFriends} />
      </div>
    </>
  );
};

export default Timeline;
