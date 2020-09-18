/** @format */

import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

function Profile() {
  const [mypics, setMypics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  //const [url, setUrl] = useState(undefined);

  useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMypics(result.posts);
      });
  }, []);

  useEffect(() => {
    if (image) {
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
          fetch("/updatepic", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePic = (file) => {
    setImage(file);
  };
  return (
    <div className='profile__home'>
      <div className='profile'>
        <div className='profile-leftside'>
          <img className='profile__img' src={state ? state.pic : ""} alt='' />
          <div className='file-field input-field'>
            <div className='btn  #0d47a1 blue darken-4'>
              <span>Update Pic</span>
              <input
                type='file'
                onChange={(event) => updatePic(event.target.files[0])}
              />
            </div>
            <div className='file-path-wrapper'>
              <input className='file-path validate' type='text' />
            </div>
          </div>
        </div>

        <div>
          <h4>{state ? state.name : "loading"}</h4>
          <h5>{state ? state.email : "loading"}</h5>
          <div className='profile__followinfo'>
            <h6>{mypics.length} posts</h6>
            <h6>{state ? state.followers.length : "0"} follower</h6>
            <h6>{state ? state.following.length : "0"} following</h6>
          </div>
        </div>
      </div>
      <div className='profile__posts'>
        {mypics.map((item) => {
          return (
            <img
              className='profile__post'
              src={item.photo}
              alt=''
              key={item._id}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
