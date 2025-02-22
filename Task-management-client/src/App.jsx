import React, { useContext } from "react";
import Header from "./components/Header";
import { Outlet } from "react-router";
import { AuthContext } from "./provider/AuthProvider";

const App = () => {
  const { user, dark } = useContext(AuthContext);

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-[#008080] dark:bg-teal-700 border-gray-200 transition-all">
        <Header></Header>
      </header>
      <div
        className={dark ? "bg-gray-900 text-white  " : "bg-white text-black  "}
      >
        <main className="w-11/12 mx-auto min-h-screen">
          <Outlet></Outlet>
        </main>
      </div>
    </>
  );
};

export default App;
