/** @format */

import React, { useState, useEffect, useContext } from "react";

import { UserContext } from "../../App";
import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);

  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: postId,
        text: text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletepost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "DELETE",
      headers: {
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div className='home'>
      {data.map((item) => {
        return (
          <div className='card home-card' key={item._id}>
            <div className='card-header'>
              <div className='user-picandname'>
                {item.postedBy._id === state._id && (
                  <img className='user-profilepic' src={state.pic} />
                )}
                <h5 className='user-title'>
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                  >
                    {item.postedBy.name}{" "}
                  </Link>
                </h5>
              </div>
              {item.postedBy._id === state._id && (
                <i
                  className='material-icons delete-icon'
                  onClick={() => {
                    deletepost(item._id);
                  }}
                >
                  delete
                </i>
              )}
            </div>

            <div className='card-image'>
              <img alt='' src={item.photo} />
            </div>
            <div className='card-content'>
              <div className='card-content-icons'>
                <i className='material-icons' style={{ color: "red" }}>
                  favorite
                </i>
                {item.likes.includes(state._id) ? (
                  <i
                    className='material-icons'
                    onClick={() => {
                      unlikePost(item._id);
                    }}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    className='material-icons'
                    onClick={() => {
                      likePost(item._id);
                    }}
                  >
                    thumb_up
                  </i>
                )}
              </div>

              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record, id) => {
                return (
                  <h6 key={id}>
                    <strong>{record.postedBy.name} </strong>
                    {record.text}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type='text' placeholder='add a comment' />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
