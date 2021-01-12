import React from "react";
import "./Header.css";
import PersonIcon from "@material-ui/icons/Person";
import ForumIcon from "@material-ui/icons/Forum";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Link, useHistory } from "react-router-dom";
import { firebaseApp } from "./firebase";

function Header({ backButton }) {
  const history = useHistory();
  return (
    <div className="headerr">
      {backButton ? (
        <IconButton onClick={() => history.replace(backButton)}>
          <ArrowBackIosIcon fontSize="large" className="header__icon" />
        </IconButton>
      ) : (
        <Link to="/settings">
          <IconButton>
            <PersonIcon className="header__icon" fontSize="large" />
          </IconButton>
        </Link>
      )}

      <Link to="/chat">
        <IconButton>
          <ForumIcon className="header__icon" fontSize="large" />
        </IconButton>
      </Link>

      <Link to="/">
        <img
          className="header__logo"
          src="https://firebasestorage.googleapis.com/v0/b/dateish-5d381.appspot.com/o/logo.png?alt=media&token=0bc84514-df61-4045-8737-a17ff18ae3c6"
          alt="tinder logo"
        />
      </Link>

      <Link to="/">
        <IconButton
          onClick={() => {
            firebaseApp
              .auth()
              .signOut()
              .then(() => {
                window.location.href = "/";
                // Sign-out successful.
              })
              .catch((error) => {
                // An error happened.
              });
          }}
        >
          <ExitToAppIcon className="header__icon" fontSize="large" />
        </IconButton>
      </Link>
    </div>
  );
}

export default Header;
