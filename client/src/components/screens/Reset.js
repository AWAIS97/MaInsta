/** @format */

import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

export default function Reset() {
  const history = useHistory();
  const [email, setEmail] = useState("");

  const Postdata = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid email", classes: "#b71c1c red darken-4" });
      return;
    }

    fetch("/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({
            html: data.message,
            classes: "##1b5e20 green darken-4",
          });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='card__login'>
      <div className='card card__loginBody input-field'>
        <h2 className='card__title'>MaInsta</h2>
        <input
          className='card__loginInput-field'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <button
          className='btn waves-effect waves-light #0d47a1 blue darken-4'
          onClick={Postdata}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
