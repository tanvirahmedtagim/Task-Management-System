import React, { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import auth from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  //theme control
  // Initialize dark mode state with data from localStorage
  const [dark, setdark] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // active donation
  const [active, setActive] = useState(true);

  // Update the theme whenever `dark` changes
  useEffect(() => {
    const theme = dark ? "forest" : "light";
    document.getElementsByTagName("html")[0].setAttribute("data-theme", theme);

    // Save the preference to localStorage
    localStorage.setItem("darkMode", JSON.stringify(dark));
  }, [dark]);

  // user setup
  const [user, setUser] = useState(null);
  const [loadding, setLoadding] = useState(true);
  // console.log(user?.email);
  //Register by email and password
  const handleRegister = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleLogin = () => {
    return signInWithPopup(auth, googleProvider);
  };
  // logIn mail and password
  const handleLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // observerd
  useEffect(() => {
    setLoadding(true);
    const subscribe = onAuthStateChanged(auth, (Currentuser) => {
      setLoadding(true);
      setUser(Currentuser);
      // console.log(Currentuser)
      setTimeout(() => {
        setLoadding(false);
      }, 2000);

      if (Currentuser?.email) {
        const userToken = {
          email: Currentuser.email,
        };

        axios
          .post(`${import.meta.env.VITE_API_URL}/jwt`, userToken, {
            withCredentials: true,
          })
          .then((data) => {
            console.log(data.data);
          });
      } else {
        axios
          .post(
            `${import.meta.env.VITE_API_URL}/logout`,
            {},
            {
              withCredentials: true,
            }
          )
          .then((res) => console.log(res.data));
      }
    });

    return () => {
      subscribe();
    };
  }, []);

  // console.log(user);
  // loading
  if (loadding) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  // console.log(user);
  // singin popup

  const authInfo = {
    setdark,
    dark,
    setUser,
    user,
    handleRegister,
    handleLogin,
    handleGoogleLogin,
    loadding,
    setLoadding,
    setActive,
    active,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
