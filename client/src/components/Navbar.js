/** @format */

import React, { useContext, useRef, useEffect, useState } from "react";

import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

function Navbar() {
  const searchModal = useRef(null);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const renderList = () => {
    if (state) {
      return [
        <li>
          <i
            data-target='modal1'
            className='large material-icons modal-trigger'
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li>
          <Link to='/profile'>Profile</Link>
        </li>,
        <li>
          <Link to='/createpost'>Create Post</Link>
        </li>,
        <li>
          <Link to='/myfollowingsposts'>My Following Posts</Link>
        </li>,
        <li>
          <button
            className='btn #f44336 red'
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to='/login'>Login</Link>
        </li>,
        <li>
          <Link to='/signup'>Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUser = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };
  return (
    <nav>
      <div className='nav-wrapper white'>
        <Link to='/' className='brand-logo left'>
          MaIntsa
        </Link>
        <ul id='nav-mobile' className='right '>
          {renderList()}
        </ul>
      </div>
      <div id='modal1' className='modal' ref={searchModal}>
        <div className='modal-content'>
          <input
            className='card__loginInput-field'
            type='text'
            placeholder='Search User'
            value={search}
            onChange={(event) => fetchUser(event.target.value)}
          />

          <ul className='collection'>
            {userDetails.map((item, id) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => setSearch("")}
                >
                  <li key={id} className='collection-item modal-close'>
                    {item.email}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className='modal-footer'>
          <button
            className='modal-close waves-effect waves-green btn-flat'
            onClick={() => setSearch("")}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
