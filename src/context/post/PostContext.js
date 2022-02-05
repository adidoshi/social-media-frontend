import { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";
import useAuth from "../auth/AuthContext";
import postReducer, { initialPostState } from "./postReducer";
import axios from "axios";
import { BASE_URL } from "../apiCall";
import {
  errorOptions,
  successOptions,
} from "../../components/utils/toastStyle";

const PostContext = createContext(initialPostState);

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialPostState);

  const { user: loggedUser } = useAuth();
  // create post req
  const createPost = async (user, desc, location, pic) => {
    try {
      dispatch({
        type: "CREATE_POST_REQUEST",
      });
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/post/create`,
        { user, desc, location, pic },
        config
      );
      dispatch({
        type: "CREATE_POST_SUCCESS",
        payload: data,
      });
      toast.success("Post created successfully", successOptions);
    } catch (error) {
      dispatch({
        type: "CREATE_POST_FAIL",
        payload: error.response.data.message,
      });
      toast.error(error.response.data.message, errorOptions);
    }
  };

  // get timeline posts req
  const getTimelinePosts = async () => {
    try {
      dispatch({
        type: "FETCH_POSTS_REQUEST",
      });
      const config = {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      const url = `${BASE_URL}/post/timeline/${loggedUser._id}`;
      const { data } = await axios.get(url, config);
      dispatch({
        type: "FETCH_POSTS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_POSTS_FAIL",
        payload: error.response.data.message,
      });
      toast.error(error.response.data.message, errorOptions);
    }
  };

  const value = {
    post: state.post,
    timelinePosts: state.timelinePosts,
    loading: state.loading,
    createLoading: state.createLoading,
    error: state.error,
    createPost,
    getTimelinePosts,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

const usePost = () => {
  const context = useContext(PostContext);

  if (context === undefined) {
    throw new Error("usePost must be used within PostContext");
  }
  return context;
};

export default usePost;
