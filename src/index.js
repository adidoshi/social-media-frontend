import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./context/auth/AuthContext";
import { PostProvider } from "./context/post/PostContext";
import { ProfileProvider } from "./context/profile/ProfileContext";
import { ThemeProvider } from "./context/ThemeContext";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <ThemeProvider>
    <AuthProvider>
      <PostProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </PostProvider>
    </AuthProvider>
  </ThemeProvider>,
  document.getElementById("root")
);

reportWebVitals();
