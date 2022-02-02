import { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";
import useAuth from "../auth/AuthContext";
import axios from "axios";
import { BASE_URL } from "../apiCall";
import profileReducer, { initialProfileState } from "./profileReducer";
import {
  errorOptions,
  successOptions,
} from "../../components/utils/toastStyle";

const ProfileContext = createContext(initialProfileState);

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialProfileState);

  const { user: loggedUser } = useAuth();

  // update user req
  const editUser = async (
    name,
    email,
    desc,
    city,
    from,
    profilePicture,
    coverPicture
  ) => {
    try {
      dispatch({
        type: "UPDATE_USER_REQUEST",
      });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      const { data } = await axios.put(
        `${BASE_URL}/user/profile/update`,
        { name, email, desc, city, from, profilePicture, coverPicture },
        config
      );
      dispatch({
        type: "UPDATE_USER_SUCCESS",
        payload: data,
      });
      toast.success("Profile updated successfully", successOptions);
    } catch (error) {
      console.log(error.response.data.message);
      dispatch({
        type: "UPDATE_USER_FAIL",
        payload: error.response.data.message,
      });
      toast.error(error.response.data.message, errorOptions);
    }
  };

  // follow user req
  const followUser = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      await axios.put(`${BASE_URL}/user/follow`, { userId }, config);
      toast.success("You followed the user", successOptions);
    } catch (error) {
      toast.error(error.response.data.message, errorOptions);
    }
  };

  // unfollow user req
  const unfollowUser = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      await axios.put(`${BASE_URL}/user/unfollow`, { userId }, config);
      toast.success("You unfollowed the user", successOptions);
    } catch (error) {
      toast.error(error.response.data.message, errorOptions);
    }
  };

  const value = {
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    success: state.success,
    editUser,
    followUser,
    unfollowUser,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

const useProfile = () => {
  const context = useContext(ProfileContext);

  if (context === undefined) {
    throw new Error("useProfile must be used within ProfileContext");
  }
  return context;
};

export default useProfile;
