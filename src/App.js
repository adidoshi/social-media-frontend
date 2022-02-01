import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/register/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Timeline from "./components/timeline/Timeline";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/editProfile/EditProfile";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route excat path="/login">
            <Login />
          </Route>
          <Route excat path="/register">
            <Register />
          </Route>
          <ProtectedRoute
            excat
            path="/profile/:userId"
            component={Profile}></ProtectedRoute>
          <ProtectedRoute
            excat
            path="/editProfile/:userId"
            component={EditProfile}></ProtectedRoute>
          <ProtectedRoute excat path="/" component={Timeline}></ProtectedRoute>
        </Switch>
      </Router>
    </>
  );
}

export default App;
