import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
// import sideLogo from "../../assets/register.jpg";
import { AuthContext } from "../provider/AuthProvider";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { dark } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const { handleRegister, manageProfile, loading, handleGoogleLogin } =
    useAuth();

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
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);

      // Show success alert using SweetAlert
      Swal.fire({
        title: "Success!",
        text: "Registered with Google!",
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (!data.file || data.file.length === 0) {
        console.error("No file selected!");
        return;
      }

      const formData = new FormData();
      formData.append("file", data.file[0]);
      formData.append("upload_preset", "life_camp");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_PRIVATE_KEY
        }/image/upload`,
        formData
      );

      const photo = response.data.url;
      const email = data.email;
      const password = data.password;

      await handleRegister(email, password);

      // create user entry in the database
      const userInfo = {
        name: data.name,
        email: email,
        photoURL: photo,
      };
      axios
        .post(`${import.meta.env.VITE_API_URL}/users`, userInfo)
        .then((res) => {
          if (res.data.insertedId) {
            reset();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "User created successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
            navigate("/");
          }
        });
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <div
      className={` relative w-full flex items-center justify-center bg-cover bg-center ${
        dark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`w-full  shadow-lg rounded-lg flex overflow-hidden ${
          dark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Left Side - Image */}
        <div
          className={`w-1/2 hidden md:flex items-center justify-center ${
            dark ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <img
            // src={sideLogo}
            alt="Side Illustration"
            className="w-full h-full"
          />
        </div>

        {/* Right Side - Form */}
        <div className={`w-full md:w-1/2 ${dark ? "bg-gray-800" : "bg-white"}`}>
          <form onSubmit={handleSubmit(onSubmit)} className="card-body pb-4">
            <h1
              className={`text-2xl font-bold text-center ${
                dark ? "text-white" : "text-gray-800"
              }`}
            >
              Register Your Account
            </h1>
            <div className="form-control">
              <label className="label">
                <span
                  className={`label-text ${
                    dark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Name
                </span>
              </label>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                placeholder="name"
                className={`input input-bordered ${
                  dark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                }`}
              />
              {errors.name && (
                <span className="text-red-500">Name is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span
                  className={`label-text ${
                    dark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Email
                </span>
              </label>
              <input
                name="email"
                type="email"
                autoComplete="new-email"
                {...register("email", { required: true })}
                placeholder="email"
                className={`input input-bordered ${
                  dark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                }`}
              />
              {errors.email && (
                <span className="text-red-500">Email is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span
                  className={`label-text ${
                    dark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Choose Photo
                </span>
              </label>
              <input
                type="file"
                name="photo"
                id="photo"
                {...register("file", { required: true })}
                className={`py-2${
                  dark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                }`}
              />
              {errors.photo && (
                <span className="text-red-500">Photo is required</span>
              )}
            </div>
            <div className="form-control relative">
              <label className="label">
                <span
                  className={`label-text ${
                    dark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Password
                </span>
              </label>
              <input
                name="password"
                {...register("password", {
                  required: true,
                  minLength: 8,
                  maxLength: 20,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                })}
                type={showPassword ? "text" : "password"}
                placeholder="password"
                autoComplete="new-password"
                className={`input input-bordered ${
                  dark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                }`}
              />
              {errors.password?.type === "required" && (
                <span className="text-red-500">Password is required</span>
              )}
              {errors.password?.type === "minLength" && (
                <span className="text-red-500">
                  Password must be more than 8 characters
                </span>
              )}
              {errors.password?.type === "maxLength" && (
                <span className="text-red-500">
                  Password must be less than 20 characters
                </span>
              )}
              {errors.password?.type === "pattern" && (
                <span className="text-red-500">
                  Password must have 1 uppercase, lowercase, number, and special
                  character
                </span>
              )}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute bottom-4 right-3 "
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <div className="form-control mt-6">
              <button className="btn text-white hover:bg-teal-600 bg-gradient-to-r from-teal-500 to-blue-700">
                Register
              </button>
            </div>
          </form>
          <div className="my-1 mx-8 text-center">
            <button
              onClick={handleGoogleSignIn}
              className="btn w-full bg-gradient-to-r from-teal-500 to-blue-700 text-white py-3 rounded-lg flex justify-center items-center hover:opacity-90 transition-all duration-300"
            >
              <FcGoogle className="mr-3" fontSize="24" />
              Register With Google
            </button>
          </div>
          <p className="text-center text-teal-500 pb-4">
            Already Have An Account?
            <Link className="font-bold text-teal-700" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
