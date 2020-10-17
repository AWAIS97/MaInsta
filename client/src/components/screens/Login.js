/** @format */

import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

export default function Login() {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Postdata = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid email", classes: "#b71c1c red darken-4" });
      return;
    }

    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });

          M.toast({
            html: "Signed in Successfully",
            classes: "##1b5e20 green darken-4",
          });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='card__login'>
      <div className='image_login'>
      <img src={require("./images/signin-image.jpg")} alt="sing up image"/>

      </div>
      <div className='card card__loginBody input-field'>
        <h2 className='card__title'>MaInsta</h2>
       

        <input
          className='card__loginInput-field'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      
        <input
          className='card__loginInput-field'
          type='password'
          placeholder='password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          className='btn waves-effect waves-light #0d47a1 blue darken-4'
          onClick={Postdata}
        >
          Login
        </button>
        <p>
          Don't have a{" "}
          <Link to='/signup'>
            <span className='card__account'>Account!</span>
          </Link>
        </p>
        <br />
        <p>
          <Link to='/reset'>
            <span className='card__account'>Forgot password..!</span>
          </Link>
        </p>
      </div>
    </div>
        
        
  );
}
