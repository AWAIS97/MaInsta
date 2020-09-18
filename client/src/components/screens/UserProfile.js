/** @format */

import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowfollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowfollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowfollow(true);
      });
  };
  return (
    <>
      {profile ? (
        <div className='profile__home'>
          <div className='profile'>
            <div>
              <img className='profile__img' src={profile.user.pic} alt='' />
            </div>
            <div>
              <h4>{profile.user.name}</h4>
              <h5>{profile.user.email}</h5>
              <div className='profile__followinfo'>
                <h6>{profile.posts.length} posts</h6>
                <h6>{profile.user.followers.length} follower</h6>
                <h6>{profile.user.following.length} following</h6>
              </div>
              {showfollow ? (
                <button
                  style={{ margin: "10px" }}
                  className='btn waves-effect waves-light #0d47a1 blue darken-4'
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{ margin: "10px" }}
                  className='btn waves-effect waves-light #0d47a1 blue darken-4'
                  onClick={() => unfollowUser()}
                >
                  unFollow
                </button>
              )}
            </div>
          </div>
          <div className='profile__posts'>
            {profile.posts.map((item) => {
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
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  );
}

export default UserProfile;
