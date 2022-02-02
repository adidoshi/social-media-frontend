import React from "react";
import "./SearchUser.css";
import { Link } from "react-router-dom";
import noAvatar from "../../../assets/appImages/user.png";

const SearchUser = ({ user }) => {
  //  search users result component
  return (
    <>
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          <Link to={`/profile/${user._id}`}>
            <img
              className="rightbarProfileImg"
              src={user.profilePicture || noAvatar}
              alt="avatar"
            />
          </Link>
        </div>
        <span className="rightbarUsername">{user.name}</span>
      </li>
    </>
  );
};

export default SearchUser;
