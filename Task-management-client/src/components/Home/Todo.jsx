import React, { useContext, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "hello-pangea/dnd";
import { AuthContext } from "../../provider/AuthProvider";

const initialTasks = [
  {
    id: "1",
    name: "Beltran",
    description: "Lorem ipsum dolor sit amet.",
    assignee: "Romona",
    priority: "Low",
    dueDate: "25-May-2020",
    qty: 7,
    notifications: 4,
  },
  {
    id: "2",
    name: "Bondon",
    description: "Proin",
    assignee: "Antoinette",
    priority: "Medium",
    dueDate: "05-Jan-2021",
    qty: 7,
    notifications: 4,
  },
];

const Todo = () => {
  const { dark } = useContext(AuthContext);
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(reorderedTasks);
  };

  return (
    <div
      className={`min-h-screen flex justify-center p-4 ${
        dark ? "text-white" : "text-gray-900"
      }`}
    >
      <div
        className={`w-80 p-4 rounded-lg border ${
          dark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl text-teal-500 font-bold">To Do</h2>
          <button className="text-gray-600 hover:text-gray-800">⚙</button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 rounded-lg shadow-lg border mb-3 ${
                          dark
                            ? "bg-gray-700 text-white"
                            : "bg-white text-gray-900"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                              {task.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <h3 className="text-md font-semibold">
                                {task.name}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {task.description}
                              </p>
                            </div>
                          </div>
                          <div className="relative">
                            {task.notifications > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {task.notifications}
                              </span>
                            )}
                            <button className="text-gray-500 hover:text-gray-300">
                              🔔
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          <p>
                            <strong>Assignee:</strong> {task.assignee}
                          </p>
                          <p>
                            <strong>Priority:</strong>
                            <span
                              className={
                                task.priority === "Low"
                                  ? "text-green-400"
                                  : "text-orange-400"
                              }
                            >
                              {task.priority}
                            </span>
                          </p>
                          <p>
                            <strong>Due Date:</strong> {task.dueDate}
                          </p>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              dark
                                ? "bg-green-800 text-green-300"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            Qty: {task.qty}
                          </span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Todo;
