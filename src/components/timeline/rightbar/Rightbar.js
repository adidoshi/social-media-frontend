import React, { useEffect, useState } from "react";
import "./Rightbar.css";
import adverSymbol from "../../../assets/appImages/adverSym.jpg";
import adImg from "../../../assets/appImages/adver.jpg";
import adImg2 from "../../../assets/appImages/adver4.jpg";
import noAvatar from "../../../assets/appImages/user.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory, useParams } from "react-router-dom";
import { Add, Remove } from "@material-ui/icons";
import useAuth from "../../../context/auth/AuthContext";
import useProfile from "../../../context/profile/ProfileContext";
import { BASE_URL } from "../../../context/apiCall";
import useTheme from "../../../context/ThemeContext";
import SearchUser from "../searchUser/SearchUser";

const Rightbar = ({ user, searchFriends }) => {
  const params = useParams();
  const history = useHistory();
  const [friends, setFriends] = useState([]);
  const [liveUser, setLiveUser] = useState();
  const { user: currentUser } = useAuth();
  const { followUser, unfollowUser } = useProfile();
  const { theme } = useTheme();

  const [followed, setFollowed] = useState(
    liveUser?.followings.includes(params?._id)
  );

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
    setLiveUser(res.data);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFollowed(liveUser?.followings.includes(params.userId));
  }, [params.userId, liveUser?.followings]);

  useEffect(() => {
    const userFriends = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        };
        const { data } = await axios.get(
          `${BASE_URL}/user/friends/${params.userId}`,
          config
        );
        setFriends(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (params.userId) {
      userFriends();
    }
  }, [currentUser.token, params.userId]);

  const followHandler = () => {
    followUser(params.userId);
    fetchUsers();
  };

  const unfollowHandler = () => {
    unfollowUser(params.userId);
    fetchUsers();
    history.push("/");
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={adverSymbol} alt="..." />
          <span className="birthdayText">
            <strong>Ads...</strong>
          </span>
        </div>
        <a href="https://www.google.com/">
          <img className="rightbarAd" src={adImg} alt="..." />
        </a>
        <a href="https://dev.to/">
          <img className="rightbarAd2" src={adImg2} alt="..." />
        </a>
        <h4 className="rightbarTitle">Search Friends Results</h4>
        <ul className="rightbarFriendList">
          {searchFriends &&
            searchFriends.map((u) => <SearchUser key={u._id} user={u} />)}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user?.name !== currentUser.name && (
          <button
            className="rightbarFollowBtn"
            onClick={followed ? unfollowHandler : followHandler}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user?.city || "-"}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user?.from || "-"}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">single</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends &&
            friends.map((friend) => (
              <Link
                to={`/profile/${friend?._id}`}
                style={{ textDecoration: "none" }}
                key={friend._id}>
                <div className="rightbarFollowing" key={friend?._id}>
                  <img
                    src={
                      friend?.profilePicture ? friend?.profilePicture : noAvatar
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">{friend?.name}</span>
                </div>
              </Link>
            ))}
        </div>
      </>
    );
  };

  return (
    <div
      className="rightbar"
      style={{ color: theme.foreground, background: theme.background }}>
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default Rightbar;
