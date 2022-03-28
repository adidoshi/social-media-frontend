import React from "react";
import "./Sidebar.css";
import { RssFeed } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import useTheme from "../../../context/ThemeContext";
import { Link } from "react-router-dom";
import SearchUser from "../searchUser/SearchUser";

const Sidebar = ({ searchFriends, toggle }) => {
  const { theme } = useTheme();
  const history = useHistory();

  // logout user and redirect to login page
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.go("/login");
  };
  return (
    <>
      <div
        className="sidebar"
        style={{ color: theme.foreground, background: theme.background }}>
        <div className="sidebarWrapper">
          <ul className="sidebarList">
            <Link to="/" style={{ textDecoration: "none", color: "#1877f2" }}>
              <li className="sidebarListItem">
                <RssFeed className="sidebarIcon" />
                <span className="sidebarListItemText">Feed</span>
              </li>
            </Link>
          </ul>
          <hr className="sidebarHr" />
          <h4 className="rightbarTitle">Search Friends Results</h4>
          <ul className="rightbarFriendList">
            {searchFriends &&
              searchFriends.map((u) => <SearchUser key={u._id} user={u} />)}
          </ul>
          <hr className="sidebarHr" />
          <button className="sidebarButton" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
