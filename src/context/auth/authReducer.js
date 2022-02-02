export const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  loading: false,
  error: null,
};

const authReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "LOGIN_REQUEST":
    case "REGISTER_REQUEST":
      return {
        user: null,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        user: payload,
        loading: false,
        error: null,
      };

    case "LOGIN_FAIL":
    case "REGISTER_FAIL":
      return {
        user: null,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default authReducer;
