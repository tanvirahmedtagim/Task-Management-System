import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import Register from "../components/Register";
import AddTask from "../components/Task/AddTask";
import EditTask from "../components/Task/EditTask";
import Home from "../pages/Home";
import Private from "./Private";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    // errorElement: <Fourzero></Fourzero>,
    children: [
      {
        path: "/",
        element: (
          <Private>
            <Home></Home>
          </Private>
        ),
      },
      {
        path: "/add-Task",
        element: (
          <Private>
            <AddTask></AddTask>
          </Private>
        ),
      },
      {
        path: "/edit-Task",
        element: (
          <Private>
            <EditTask></EditTask>
          </Private>
        ),
      },
    ],
  },

  // credentials work
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
]);

export default router;
