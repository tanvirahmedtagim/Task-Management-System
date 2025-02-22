import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
// import sideLogo from "../../assets/login.jpg";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, handleGoogleLogin } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { dark } = useContext(AuthContext);
  // Admin Credentials
  const adminCredentials = {
    email: "tanvir@gmail.com",
    password: "@@Tanvir@@007@@",
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleGoogleSignIn = async () => {
    try {
      const result = await handleGoogleLogin();

      // Extract user info from the result
      const userInfo = {
        email: result.user?.email,
        name: result.user?.displayName,
        photoURL: result.user?.photoURL,
      };

      // Send user info to the backend
      await axiosPublic.post("/users", userInfo);

      // Show success alert using SweetAlert
      Swal.fire({
        title: "Success!",
        text: "Logged in with Google!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        showConfirmButton: false,
      });

      // Navigate to the home page
      navigate("/");
    } catch (err) {
      // Show error alert using SweetAlert
      Swal.fire({
        title: "Error!",
        text: err.message || "Google sign-in failed.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      await handleLogin(email, password).then((res) => {
        Swal.fire({
          title: "Success!",
          text: "Logged in Successfully!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Open & Close Modal
  const openAdminModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Login as Admin
  const loginAsAdmin = async () => {
    setValue("email", adminCredentials.email);
    setValue("password", adminCredentials.password);
    setIsModalOpen(false);

    try {
      // Trigger the login as admin
      await handleLogin(adminCredentials.email, adminCredentials.password);

      // Show success alert using SweetAlert
      Swal.fire({
        title: "Success!",
        text: "Logged in as Admin!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        showConfirmButton: false,
      });

      // Navigate to the dashboard or home page
      navigate("/");
    } catch (error) {
      // Handle error in case login fails
      Swal.fire({
        title: "Error!",
        text: error.message || "Admin login failed.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div
      className={`mt-16 w-full flex items-center justify-center ${
        dark ? "bg-gray-900 text-teal-400" : "text-teal-700"
      }`}
    >
      <div
        className={`w-full md:flex-row flex-col bg-white shadow-lg rounded-lg flex overflow-hidden ${
          dark ? "bg-gray-900 text-teal-400" : "text-teal-700"
        }`}
      >
        {/* Left Side - Image */}
        <div className="md:w-1/2 w-full mb-6 md:mb-0 md:flex items-center justify-center bg-gray-100">
          <img
            // src={sideLogo}
            alt="Side Illustration"
            className="w-full h-full"
          />
        </div>
        <div
          className={`w-full md:w-1/2 px-8 md:px-16 ${
            dark ? "text-white bg-gray-900" : "text-gray-900"
          }`}
        >
          <h1
            className={`text-3xl font-semibold pt-5 text-center ${
              dark ? "text-white bg-gray-900" : "text-gray-900"
            } md:mb-8`}
          >
            Login to Your Account
          </h1>
          {/* Admin Login Button */}
          <button
            onClick={openAdminModal}
            className="w-full mb-4 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition"
          >
            Credential Login
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <label
                className={`label ${
                  dark ? "text-teal-400 bg-gray-900" : "text-teal-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                autoComplete="current-email"
                placeholder="Enter your email"
                className={`input input-bordered w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  dark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                }`}
                {...register("email", { required: "Email required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="form-control">
              <label
                className={`label ${dark ? "text-gray-400" : "text-gray-600"}`}
              >
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`input input-bordered w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  dark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                }`}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                className={`btn w-full py-3 rounded-lg hover:opacity-90 focus:outline-none transform hover:scale-105 transition-all duration-300 ease-in-out ${
                  dark
                    ? "bg-teal-600"
                    : "bg-gradient-to-r from-teal-500 to-[#04d6d6] text-white"
                }`}
              >
                Login
              </button>
            </div>
          </form>

          <div className="my-4 text-center">
            <button
              onClick={handleGoogleSignIn}
              className={`btn w-full py-3 rounded-lg flex justify-center items-center hover:opacity-90 transition-all duration-300 ${
                dark
                  ? "bg-teal-600"
                  : "bg-gradient-to-r from-teal-500 to-[#04d6d6] text-white"
              }`}
            >
              <FcGoogle className="mr-3" fontSize="24" />
              Login With Google
            </button>
          </div>

          <p
            className={`text-center ${
              dark ? "text-teal-400" : "text-teal-700"
            }`}
          >
            Don't have an account?
            <Link
              to="/register"
              className={`font-semibold ${
                dark ? "text-teal-400" : "text-blue-500"
              } hover:underline`}
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Admin Login Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className={` p-6 rounded-lg shadow-lg w-80 ${
              dark ? "text-teal-400 bg-gray-900" : "text-teal-700 bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Admin Credentials</h2>
            <p className="mb-2">
              <strong>Email:</strong> {adminCredentials.email}
            </p>
            <p className="mb-4">
              <strong>Password:</strong> {adminCredentials.password}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={loginAsAdmin}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Login as Admin
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Login;
