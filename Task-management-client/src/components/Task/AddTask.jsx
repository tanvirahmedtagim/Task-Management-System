import React, { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../provider/AuthProvider";
import LoadingSpinner from "../LoadingSpinner";
import useGetAllUsers from "../../hooks/useGetAllUsers";
import { useNavigate } from "react-router";

const AddTask = () => {
  const navigate = useNavigate();
  const { dark, user } = useContext(AuthContext);
  const { users, refetch, isPending } = useGetAllUsers(user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To-Do");

  if (isPending) <LoadingSpinner></LoadingSpinner>;
  // console.log(users)
  const maxTitleLength = 50;
  const maxDescLength = 200;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const [date, time] = timestamp.split("T");

    const newTask = {
      title,
      description,
      category,
      date: date,
      time: time.split(".")[0],
      user: {
        id: users._id,
        name: users.name,
        email: users.email,
      },
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, newTask);
      Swal.fire("Task add successfully", "", "success");
      setTitle("");
      setDescription("");
      setCategory("To-Do");
      navigate("/");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <>
      <div
        className={`flex mt-9 flex-col lg:flex-row items-center lg:items-start p-6 ${
          dark ? "bg-gray-900 text-white" : "text-gray-900"
        }`}
      >
        {/* Image Section */}
        <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
          <img
            src="https://i.ibb.co/Jjpxh81Y/checklist-concept-illustration-114360-339.jpg"
            alt="Task Illustration"
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-2/3 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={maxTitleLength}
                className="w-full p-2 border rounded"
                required
              />
              <p className="text-xs text-error">
                {maxTitleLength - title.length} characters left
              </p>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={maxDescLength}
                className="w-full p-2 border rounded"
              ></textarea>
              <p className="text-xs text-error">
                {maxDescLength - description.length} characters left
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700"
            >
              Add Task
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTask;
