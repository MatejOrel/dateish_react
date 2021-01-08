import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import Button from "react-bootstrap/Button";
import Grid from "@material-ui/core/Grid";
import { firebaseApp } from "./firebase";
import firebase from "@firebase/app";
import "./Settings.css";

export const Settings = () => {
  const [users, setUsers] = useState();
  const [distance, setDistance] = useState();
  const [age, setAge] = useState([50, 100]);
  const [image, setImage] = useState();
 
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
            setDistance(arr.distance);
            setAge(arr.minAge, arr.maxAge);
            setUsers(arr);
            setImage(arr.profileImageUrl);
          })
          .catch((error) => console.log("failed", error.message));
      }
    });
  }, []);

  const handleDistanceChange = (event, newValue) => {
    setDistance(newValue);
  };

  const handleAgeChange = (event, newValue) => {
    setAge(newValue);
  };

  function submit() {}

  /*const saveImage = (event, files) => {
    if (files && files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            // e.target.result is a base64-encoded url that contains the image data
            this.setAttribute('src', e.target.result);
            var filename = users.uID + '.jpg';
            var storageRef = storage.ref('profileImages/');
            var mountainImagesRef = storageRef.child(filename);
            var message = e.target.result;
            mountainImagesRef.putString(message, 'data_url').then(function(snapshot) {
                console.log('Uploaded a data_url string!');
                var profileImage;
                var storageRef = storage.ref('profileImages/' + filename).getDownloadURL()
                        .then(function onSuccess(url){
                            console.log(url)
                            profileImage = url; 
                            $.ajax({
                                url: "/saveurl",
                                type: "get",
                                data: { 'url': url },
                                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
                                });
                        });
            });
        };
    reader.readAsDataURL(this.files[0]);
  }
}*/
const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        var storage = firebase.storage();
        let reader = new FileReader();
        reader.onload = (e) => {
            var filename = users.uId + '.jpg';
            var storageRef = storage.ref('profileImages/');
            var mountainImagesRef = storageRef.child(filename);
            var message = e.target.result;
            console.log(filename);
            mountainImagesRef.putString(message, 'data_url').then(function(snapshot) {
                console.log('Uploaded a data_url string!');
                var profileImage;
                var storageRef = storage.ref('profileImages/' + filename).getDownloadURL()
                        .then(function onSuccess(url){
                            console.log(url)
                            profileImage = url; 
                            var data = {profileImageUrl: profileImage}
                            firebase.database().ref('Users/' + users.uId + '/').update(data);         
                            setImage(profileImage)
                        });
        
            });   
    };
     reader.readAsDataURL(event.target.files[0]);
  }
}

  return (
    <div>
      {users ? (
        <div>
          <img
            src={image}
            id="profile-pic"
            alt="not found"
          ></img>
          <input type="file" onChange={onImageChange} className="filetype" id="group_image"/>
          <br></br>
          <input type="text" defaultValue={users.name}></input>
          <br></br>
          <input
            type="text"
            placeholder="Phone"
            defaultValue={users.phone}
          ></input>
          <br></br>
          <input type="textarea" defaultValue={users.bio}></input>
          <br></br>
          <p>{users.dateOfBirth}</p>
          <p>Show me:</p>
          <input type="radio" value="Male" name="gender" /> Male <br></br>
          <input type="radio" value="Female" name="gender" /> Female
          <p>
            Show distance: <b>{distance} km</b>
          </p>
          <div>
            <Grid item xs="4">
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
            <Grid item xs="4">
              <Slider
                value={age}
                min={18}
                max={100}
                onChange={handleAgeChange}
                aria-labelledby="range-slider"
              />
            </Grid>
          </div>
          <Button block size="lg" type="submit" onClick={submit()}>
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
