import React from "react";
import { Redirect, Route } from "react-router-dom";
import useAuth from "../context/auth/AuthContext";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={() => (user ? <Component {...rest} /> : <Redirect to="/login" />)}
    />
  );
};

export default ProtectedRoute;
