import React, { useEffect, useState } from "react";
import UserHome from "./userHome";

export default function UserDetails() {
  const [userData, setUserData] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setUserData(data.data);
       
        if (data.data === "token expired") {
          alert("Token expired, please log in again");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }
      });
  }, []);

  console.log(window.localStorage.getItem("token"));

  return <UserHome userData={userData} />;
}
