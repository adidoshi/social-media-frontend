import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./Register.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuth from "../../../context/auth/AuthContext";
import TextError from "../TextError";
import { CircularProgress } from "@material-ui/core";
import { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";

// Formik initial input values
const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// Validate using YUP
const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email format").required("Required"),
  password: Yup.string().required("Required").min(6),
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const Register = () => {
  const history = useHistory();
  const { user, loading, register } = useAuth();

  // register submit handler
  const onSubmit = async (values) => {
    register(values.name, values.email, values.password);
  };

  // if req is successfull, i.e. if user is found in local storage push to timeline screen.
  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);
  return (
    <>
      <Helmet title="Register | Splash Social" />
      <Toaster />
      <div className="register">
        <div className="registerWrapper">
          <div className="registerLeft">
            <h3 className="registerLogo">Splash Social</h3>
            <span className="registerDesc">
              Connect with your friends and the world around you on Splash
              Social
            </span>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            <div className="registerRight">
              <Form className="registerBox">
                <div className="register-title">Register</div>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="registerInput"
                />
                <ErrorMessage name="email" component={TextError} />
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Username"
                  className="registerInput"
                />
                <ErrorMessage name="name" component={TextError} />
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="registerInput"
                />
                <ErrorMessage name="password" component={TextError} />
                <Field
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="registerInput"
                />
                <ErrorMessage name="confirmPassword" component={TextError} />
                <button
                  type="submit"
                  className={loading ? "registerBtnDisabled" : "registerBtn"}
                  disabled={loading ? true : false}>
                  {loading ? (
                    <CircularProgress color="secondary" size="22px" />
                  ) : (
                    "Sign up"
                  )}
                </button>
                <span className="registerForgotPassword">
                  Already have an account?
                </span>
                <Link to="/login">
                  <button className="registerLoginBtn">Sign In</button>
                </Link>
              </Form>
            </div>
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Register;
