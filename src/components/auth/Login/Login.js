import React, { useEffect } from "react";
import "./Login.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import TextError from "../TextError";
import useAuth from "../../../context/auth/AuthContext";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { Toaster } from "react-hot-toast";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Required"),
  password: Yup.string().required("Required").min(6),
});

const Login = () => {
  const history = useHistory();
  const { user, loading, loginReq } = useAuth();

  const onSubmit = (values) => {
    loginReq(values.email, values.password);
  };

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  return (
    <>
      <Toaster />
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Splash Social</h3>
            <span className="loginDesc">
              Connect with your friends and the world around you on Splash
              Social
            </span>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            <div className="loginRight">
              <Form className="loginBox">
                <div className="login-title">Sign In</div>
                <Field
                  type="email"
                  placeholder="Email"
                  name="email"
                  id="email"
                  className="loginInput"
                />
                <ErrorMessage name="email" component={TextError} />
                <Field
                  type="password"
                  placeholder="Password"
                  className="loginInput"
                  name="password"
                  id="password"
                />
                <ErrorMessage name="password" component={TextError} />
                <button
                  className="loginBtn"
                  type="submit"
                  disabled={loading ? true : false}>
                  {loading ? (
                    <CircularProgress color="secondary" size="22px" />
                  ) : (
                    "Log in"
                  )}
                </button>

                <Link className="loginBtnCenter" to="/register">
                  <button className="loginregistrationButton">
                    Create a new account
                  </button>
                </Link>
              </Form>
            </div>
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Login;
