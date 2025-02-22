import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../provider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner";

const EditTask = () => {
  const location = useLocation();
  const { dark } = useContext(AuthContext);
  const taskId = location?.state?.taskId;
  const navigate = useNavigate();
  // State for task fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To-Do");

  // Fetch task data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tasks-edit", taskId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/edit-task/${taskId}`
      );
      return data;
    },
    enabled: !!taskId,
    refetchOnWindowFocus: false,
  });

  // Set initial state when data is available
  useEffect(() => {
    if (data) {
      setTitle(data.title || "");
      setDescription(data.description || "");
      setCategory(data.category || "To-Do");
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;

  // Handle task update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const [date, time] = timestamp.split("T");

    const updatedTask = {
      title,
      description,
      category,
      date: date,
      time: time.split(".")[0],
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/update-task/${taskId}`,
        updatedTask
      );
      Swal.fire("Task updated successfully", "", "success");
      refetch();
      navigate("/");
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire("Error updating task", "", "error");
    }
  };

  return (
    <>
      <div className="flex mt-9 flex-col lg:flex-row items-center lg:items-start p-6">
        <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
          <img
            src="https://i.ibb.co/Jjpxh81Y/checklist-concept-illustration-114360-339.jpg"
            alt="Task Illustration"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="w-full lg:w-2/3 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
              ></textarea>
            </div>

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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              Update Task
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditTask;
