import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import Button from "react-bootstrap/Button";
import Grid from "@material-ui/core/Grid";
import { firebaseApp } from "./firebase";
import firebase from "@firebase/app";
import "./Settings.css";

export const Settings = () => {
  const [users, setUsers] = useState();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [bio, setBio] = useState();
  const [distance, setDistance] = useState();
  const [age, setAge] = useState([18, 100]);
  const [image, setImage] = useState();
  const [showSex, setSex] = useState();

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(async (user) => {
      if (user) {
        await fetch(
          "https://dateishapi.herokuapp.com/api/userData?uID=" + user.uid,
          {
            method: "GET",
          }
        )
          .then((resp) => resp.json())
          .then((data) => {
            const arr = [];
            Object.keys(data).forEach((attr) => {
              arr[attr] = data[attr];
              //console.log(attr, data[attr]);
            });
            setName(arr.name);
            setPhone(arr.phone);
            setBio(arr.bio);
            setDistance(arr.distance);
            setAge([arr.minAge, arr.maxAge]);
            setSex(arr.showSex);
            setImage(arr.profileImageUrl);
            setUsers(arr);
          })
          .catch((error) => console.log("failed", error.message));
      }
    });
  }, []);

  const handleSexChange = (event, newValue) => {
    setSex(newValue);
    
  };

  const handleNameChange = (event, newValue) => {
    setName(newValue);
  };

  const handlePhoneChange = (event, newValue) => {
    setPhone(newValue);
  };

  const handleBioChange = (event, newValue) => {
    setBio(newValue);
  };

  const handleDistanceChange = (event, newValue) => {
    setDistance(newValue);
  };

  const handleAgeChange = (event, newValue) => {
    setAge(newValue);
  };

  const submit = (event) => {
    
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      var storage = firebase.storage();
      let reader = new FileReader();
      reader.onload = (e) => {
        var filename = users.uId + ".jpg";
        var mountainImagesRef = storage.ref("profileImages/").child(filename);
        var message = e.target.result;
        console.log(filename);
        mountainImagesRef
          .putString(message, "data_url")
          .then(function (snapshot) {
            console.log("Uploaded a data_url string!");
            var profileImage;
            storage
              .ref("profileImages/" + filename)
              .getDownloadURL()
              .then(function onSuccess(url) {
                console.log(url);
                profileImage = url;
                var data = { profileImageUrl: profileImage };
                firebase
                  .database()
                  .ref("Users/" + users.uId + "/")
                  .update(data);
                setImage(profileImage);
              });
          });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div>
      {users ? (
        <div>
          <img src={image} id="profile-pic" alt="not found"></img>
          <input
            type="file"
            onChange={onImageChange}
            className="filetype"
            id="group_image"
          />
          <br></br>
          <input
            type="text"
            defaultValue={name}
            onChange={handleNameChange}
          ></input>
          <br></br>
          <input
            type="text"
            placeholder="Phone"
            defaultValue={phone}
            onChange={handlePhoneChange}
          ></input>
          <br></br>
          <input
            type="textarea"
            defaultValue={bio}
            onChange={handleBioChange}
          ></input>
          <br></br>
          <p>{users.dateOfBirth}</p>
          <p>Show me:</p>
          {showSex === "Male" ? (
            <div className="radio-buttons">
              Men
              <input
                id="Male"
                value="Male"
                name="gender"
                type="radio"
                checked={true}
                onChange={handleSexChange}
              />
              Women
              <input
                id="Female"
                value="Female"
                name="gender"
                type="radio"
                onChange={handleSexChange}
              />
            </div>
          ) : (
            <div className="radio-buttons">
              Men
              <input
                id="Male"
                value="Male"
                name="gender"
                type="radio"
                onChange={handleSexChange}
              />
              Women
              <input
                id="Female"
                value="Female"
                name="gender"
                type="radio"
                checked={true}
                onChange={handleSexChange}
              />
            </div>
          )}

          <p>
            Show distance: <b>{distance} km</b>
          </p>
          <div>
            <Grid>
              <Slider
                value={distance}
                max={142}
                onChange={handleDistanceChange}
                aria-labelledby="continuous-slider"
              />
            </Grid>
          </div>
          <p>
            Show age:{" "}
            <b>
              {age[0]} - {age[1]}
            </b>
          </p>
          <div>
            <Grid>
              <Slider
                value={age}
                min={18}
                max={100}
                onChange={handleAgeChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
              />
            </Grid>
          </div>
          <Button block size="lg" type="submit" onClick={submit}>
            Confirm
          </Button>
        </div>
      ) : (
        <div className="loading">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};
