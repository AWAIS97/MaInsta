/** @format */

import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

function Signup() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "MaInsta");
    data.append("cloud_name", "awais12");
    fetch("https://api.cloudinary.com/v1_1/awais12/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid email", classes: "#b71c1c red darken-4" });
      return;
    }

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({ html: data.message, classes: "##1b5e20 green darken-4" });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Postdata = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };
  return (
    <div className='card__login'>
      <div className='card card__loginBody input-field'>
        <h2>MaInsta</h2>
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type='password'
          placeholder='password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className='file-field input-field'>
          <div className='btn  #0d47a1 blue darken-4'>
            <span>Upload Profile Image</span>
            <input
              type='file'
              onChange={(event) => setImage(event.target.files[0])}
            />
          </div>
          <div className='file-path-wrapper'>
            <input className='file-path validate' type='text' />
          </div>
        </div>

        <button
          className='btn waves-effect waves-light #0d47a1 blue darken-4'
          onClick={Postdata}
        >
          Sign up
        </button>
        <p>
          Already have a{" "}
          <Link to='/login' className='card__account'>
            <span className='card__account'>Account?</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
