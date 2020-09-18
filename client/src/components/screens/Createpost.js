/** @format */

import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

function Createpost() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
          } else {
            M.toast({
              html: "Uploaded in Successfully",
              classes: "##1b5e20 green darken-4",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const postDetails = () => {
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

  return (
    <div className='card__createpost'>
      <div className='card input-field'>
        <input
          type='text'
          placeholder='title'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          type='text'
          placeholder='body'
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        <div className='file-field input-field'>
          <div className='btn  #0d47a1 blue darken-4'>
            <span>Upload Image</span>
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
          onClick={postDetails}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Createpost;
