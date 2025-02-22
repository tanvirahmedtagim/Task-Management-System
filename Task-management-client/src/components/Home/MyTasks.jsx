import { useQuery } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TaskCard from "./TaskCard";
import { useContext, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { AuthContext } from "../../provider/AuthProvider";
import useGetAllUsers from "../../hooks/useGetAllUsers";

const MyTasks = () => {
  const { user, dark } = useContext(AuthContext);
  const { users, isPending } = useGetAllUsers(user);
  const queryClient = useQueryClient();

  const [isUpdating, setIsUpdating] = useState(false);
  if (isUpdating) {
    <LoadingSpinner></LoadingSpinner>;
  }
  // Fetch Tasks for different categories
  const { data: todoTask = [], refetch: refetchTodo } = useQuery({
    queryKey: ["todo-tasks", user?.email],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/add-task/getTodoTask/${users?.email}`
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: inProgressTask = [], refetch: refetchInProgress } = useQuery({
    queryKey: ["in-progress-tasks", user?.email],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/add-task/getInProgressTask/${
          users?.email
        }`
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: doneTask = [], refetch: refetchDone } = useQuery({
    queryKey: ["done-tasks", user?.email],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/add-task/getDoneTask/${users?.email}`
      );
      return data;
    },
    refetchOnWindowFocus: false,
  });

  // API call to update task category
  const { mutateAsync: updateTaskCategory } = useMutation({
    mutationFn: async ({ id, category }) => {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/add-task/updateCategory/${id}`,
        {
          category,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todo-tasks"]);
      queryClient.invalidateQueries(["in-progress-tasks"]);
      queryClient.invalidateQueries(["done-tasks"]);
      setIsUpdating(false); // Set updating to false after mutation
    },
  });

  // Handle Drag & Drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    setIsUpdating(true); // Start updating

    const { destination, draggableId } = result;

    let newCategory = "";
    if (destination.droppableId === "todo") newCategory = "To-Do";
    if (destination.droppableId === "inProgress") newCategory = "In Progress";
    if (destination.droppableId === "done") newCategory = "Done";

    // Update Task Category
    await updateTaskCategory({ id: draggableId, category: newCategory });

    // After updating, fetch the data again
    refetchTodo();
    refetchInProgress();
    refetchDone();
  };

  return (
    <section
      className={
        dark
          ? "bg-gray-900 text-white min-h-screen "
          : "bg-white text-black min-h-screen "
      }
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* To-Do Section */}
          <Droppable droppableId="todo">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={
                  dark
                    ? "bg-gray-800 p-4 rounded-lg min-h-screen"
                    : "bg-gray-300 p-4 rounded-lg min-h-screen"
                }
              >
                <h1 className="text-center font-bold text-2xl mb-3">To Do</h1>
                <div className="flex flex-col gap-5">
                  {todoTask?.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} refetchTodo={refetchTodo} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {/* In Progress Section */}
          <Droppable droppableId="inProgress">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={
                  dark
                    ? "bg-gray-800 p-4 rounded-lg min-h-screen"
                    : "bg-gray-300 p-4 rounded-lg min-h-screen"
                }
              >
                <h1 className="text-center font-bold text-2xl mb-3">
                  In Progress
                </h1>
                <div className="flex flex-col gap-5">
                  {inProgressTask?.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            refetchInProgress={refetchInProgress}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>

          {/* Done Section */}
          <Droppable droppableId="done">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={
                  dark
                    ? "bg-gray-800 p-4 rounded-lg min-h-screen"
                    : "bg-gray-300 p-4 rounded-lg min-h-screen"
                }
              >
                <h1 className="text-center font-bold text-2xl mb-3">Done</h1>
                <div className="flex flex-col gap-5">
                  {doneTask?.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} refetchDone={refetchDone} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </section>
  );
};

export default MyTasks;
