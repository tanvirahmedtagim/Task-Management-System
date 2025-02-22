import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { GoSun } from "react-icons/go";
import {
  FaMoon,
  FaUserCircle,
  FaHome,
  FaVideo,
  FaBars,
  FaAddressBook,
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import auth from "../firebase/firebase.config";
import useGetAllUsers from "../hooks/useGetAllUsers";

const Header = () => {
  const { setdark, dark, user } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [visible, setVisible] = useState(true);
  const { users, refetch, isPending } = useGetAllUsers(user);

  useEffect(() => {
    const handleScroll = () => {
      let st = window.scrollY;
      if (st > lastScrollTop) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollTop(st);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const handleSignOut = () => {
    Swal.fire({
      title: "Do you want to Sign Out?",
      showDenyButton: true,
      confirmButtonText: "Sign Out",
      denyButtonText: `Cancel`,
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth)
          .then(() => {
            Swal.fire("Signed Out!", "", "success");
          })
          .catch((error) => {
            console.error("Sign-out error:", error);
          });
      }
    });
  };

  // menu
  const menu = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-2xl ${isActive ? "text-info" : "text-gray-600"} space-y-3`
        }
      >
        <FaHome />
      </NavLink>
      <NavLink
        to="/add-Task"
        className={({ isActive }) =>
          `text-2xl ${isActive ? "text-info" : "text-gray-600"} `
        }
      >
        <BiSolidMessageSquareAdd />
      </NavLink>
    </>
  );

  return (
    <div
      className={`fixed top-0 z-50 w-full bg-[#008080] dark:bg-teal-700 border-gray-200 transition-all py-3  ${
        dark ? "bg-gray-900 text-gray-50" : "bg-gray-100 text-gray-900"
      }`}
    >
      {" "}
      <div className="w-11/12 mx-auto">
        <div className="flex justify-between items-center">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <FaBars className="text-2xl" />
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-red-800">
            TaskStorm
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6">{menu}</div>

          {/* Theme Toggle & User Menu */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setdark(!dark)} className="btn btn-circle">
              {dark ? (
                <GoSun className="text-yellow-400 text-xl" />
              ) : (
                <FaMoon className="text-indigo-600 text-xl" />
              )}
            </button>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="btn btn-ghost btn-circle"
            >
              {user ? (
                <div
                  className="tooltip"
                  data-tip={users?.name || user?.displayName}
                >
                  <img
                    className="w-10 h-10 rounded-full shadow-lg"
                    src={
                      users?.photoUrl ||
                      user?.photoURL ||
                      "https://via.placeholder.com/40"
                    }
                    alt="User"
                  />
                </div>
              ) : (
                <FaUserCircle className="text-2xl" />
              )}
            </button>

            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg ${
                  dark ? "bg-gray-800 text-gray-50" : "bg-gray-50 text-gray-900"
                }`}
              >
                {!user ? (
                  <div className="p-2">
                    <Link
                      to="/auth/login"
                      className="block px-4 py-2 hover:bg-gray-200 rounded"
                    >
                      LogIn
                    </Link>
                    <Link
                      to="/auth/register"
                      className="block px-4 py-2 hover:bg-gray-200 rounded"
                    >
                      SignUp
                    </Link>
                  </div>
                ) : (
                  <div className="p-2">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden absolute left-0 top-full w-40 bg-gray-200 p-2 shadow-md rounded-md">
            {menu}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
