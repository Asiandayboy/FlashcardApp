import React from 'react';
import { useState, useEffect } from 'react';
import styles from "../styles/Navbar.module.css";
import { Link } from 'react-router-dom';
import getCookie from '../utils/getCookie';
import { useNavigate } from 'react-router-dom';

type Props = {
  isLoggedIn: boolean,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
}


export default function Navbar({ isLoggedIn, setIsLoggedIn }: Props) {

  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = getCookie("sessionId");

    if (sessionId && sessionId != -1) {
      setIsLoggedIn(true);
    } else
      setIsLoggedIn(false)
      
  }, [])


  function onLogOut() {
    document.cookie = "sessionId=-1"
    setIsLoggedIn(false);
    navigate("/");
    alert("You have logged out");
  }

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/workspace">Create</Link>
        </li>
        {
          (isLoggedIn == true) && 
          <>
            <li>
              <Link to="/mydecks">My Decks</Link>
            </li>
            <li>
              <button onClick={() => onLogOut()}>Log out</button>
            </li>
          </>
        }
        {
          (isLoggedIn == false) &&
          <>
            <li>
              <Link to="/login">Log in</Link>
            </li>
            <li>
              <Link to="/signup">Sign up</Link>
            </li>
          </> 
        }
      </ul>
    </nav>
  )
}
