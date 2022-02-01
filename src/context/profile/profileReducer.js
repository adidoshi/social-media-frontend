export const initialProfileState = {
  profile: {},
  loading: false,
  error: null,
  success: false,
};

const profileReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "UPDATE_USER_REQUEST":
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    case "UPDATE_USER_SUCCESS":
      return {
        profile: payload,
        loading: false,
        success: true,
        error: null,
      };
    case "UPDATE_USER_FAIL":
      return {
        ...state,
        loading: false,
        error: payload,
        success: false,
      };

    default:
      throw new Error(`No case for type ${type} found in profileReducer.`);
  }
};

export default profileReducer;
