/** @format */

import React, { useEffect, createContext, useReducer, useContext } from "react";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Createpost from "./components/screens/Createpost";
import UserProfile from "./components/screens/UserProfile";
import "./App.css";
import { reducer, initialState } from "./reducers/userReducer";
import FollowingPosts from "./components/screens/FollowingPosts";
import Reset from "./components/screens/Reset";
import Newpassword from "./components/screens/Newpassword";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      // history.push("/");
    } else {
      if (!history.location.pathname.startsWith("/reset"))
        history.push("/login");
    }
  }, []);
  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/login'>
        <Login />
      </Route>
      <Route path='/signup'>
        <Signup />
      </Route>
      <Route path='/createpost'>
        <Createpost />
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile />
      </Route>
      <Route path='/myfollowingsposts'>
        <FollowingPosts />
      </Route>
      <Route exact path='/reset'>
        <Reset />
      </Route>
      <Route path='/reset/:token'>
        <Newpassword />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
