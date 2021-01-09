import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import Button from "react-bootstrap/Button";
import Grid from "@material-ui/core/Grid";
import { firebaseApp } from "./firebase";
import firebase from "@firebase/app";
import "./Settings.css";

export const Settings = () => {
  const [uid, setUid] = useState();
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
            setUid(user.uid);
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

  const handleSexChange = (event) => {
    console.log(event.target.value);
    setSex(event.target.value);
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleDistanceChange = (event, newValue) => {
    setDistance(newValue);
  };

  const handleAgeChange = (event, newValue) => {
    setAge(newValue);
  };

  const submit = (event) => {
    fetch("https://dateishapi.herokuapp.com/api/saveData", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uId: uid,
        name: name,
        phone: phone,
        bio: bio,
        dateOfBirth: users.dateOfBirth,
        showSex: showSex,
        minAge: age[0],
        maxAge: age[1],
        distance: distance,
      }),
    })
      .then(() => {
        console.log("success");
      })
      .catch((error) => console.log("failed", error.message));
  };

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
          <div>
            <input type="radio" value="Male" name="gender" checked={showSex === "Male"} onChange={handleSexChange} /> Male
            <input type="radio" value="Female" name="gender" checked={showSex === "Female"} onChange={handleSexChange} /> Female
          </div>
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
