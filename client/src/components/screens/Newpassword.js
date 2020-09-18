/** @format */

import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from "materialize-css";

export default function Newpassword() {
  const history = useHistory();
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const Postdata = () => {
    fetch("/new-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
          type='password'
          placeholder='Enter new password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          className='btn waves-effect waves-light #0d47a1 blue darken-4'
          onClick={Postdata}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
