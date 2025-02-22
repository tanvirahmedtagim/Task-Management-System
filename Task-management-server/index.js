require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
//

//middleware
app.use(
  cors({
    origin: ["http://localhost:5173"], // Replace with your React app's URL
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// mongoDB server cannected

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez7m5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // database filed create
    const ToDoAppsUsers = client.db("taskDB").collection("users");
    const ToDoAppsTask = client.db("taskDB").collection("tasks");

    // user related query
    // get users
    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;

        const result = await ToDoAppsUsers.findOne({ email });

        if (!result) {
          return res.status(404).send({ message: "User not found" });
        }

        res.send(result);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // auth related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
        expiresIn: "365d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    app.post("/logout", (req, res) => {
      try {
        res
          .clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send({ success: true });
      } catch (error) {
        console.log(error);
      }
    });
    // user added in database
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const query = { email: newUser.email };
      try {
        const existingUser = await ToDoAppsUsers.findOne(query);

        if (existingUser) {
          // If user already exists, return a message
          return res
            .status(400)
            .send({ message: "User with this email already exists." });
        }

        const result = await ToDoAppsUsers.insertOne(newUser);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // all users
    app.get("/users", async (req, res) => {
      try {
        const result = await ToDoAppsUsers.find({}).toArray();

        if (!result || result.length === 0) {
          return res.status(404).send({ message: "No users found" });
        }

        res.send(result);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // add task related work
    app.post("/tasks", async (req, res) => {
      try {
        const newTask = req.body;

        // Input validation (Optional but Recommended)
        if (!newTask.title || !newTask.category) {
          return res
            .status(400)
            .json({ message: "Title and Category are required!" });
        }

        const result = await ToDoAppsTask.insertOne(newTask);

        if (result.acknowledged) {
          res.status(201).json({
            message: "Task Added Successfully",
            taskId: result.insertedId,
          });
        } else {
          res.status(500).json({ message: "Failed to add task!" });
        }
      } catch (error) {
        console.error("Error inserting task:", error);
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    });

    // task edit
    app.get("/edit-task/:id", async (req, res) => {
      try {
        const taskId = req.params.id;

        if (!taskId) {
          return res.status(400).json({ message: "Task ID is required!" });
        }

        const result = await ToDoAppsTask.findOne({
          _id: new ObjectId(taskId),
        });

        if (!result) {
          return res.status(404).json({ message: "Task not found!" });
        }

        res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching task:", error);
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    });

    // update task
    // Update a task
    app.put("/update-task/:id", async (req, res) => {
      try {
        const taskId = req.params.id;
        const { title, description, category } = req.body;

        if (!ObjectId.isValid(taskId)) {
          return res.status(400).json({ message: "Invalid Task ID" });
        }

        const timestamp = new Date().toISOString();
        const [date, time] = timestamp.split("T");

        const updatedTask = {
          title,
          description,
          category,
          date: date,
          time: time.split(".")[0],
        };

        const result = await ToDoAppsTask.updateOne(
          { _id: new ObjectId(taskId) },
          { $set: updatedTask }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully" });
      } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // get To-Do task
    app.get("/add-task/getTodoTask/:email", async (req, res) => {
      try {
        const userEmail = req.params.email;

        if (!userEmail) {
          return res.status(400).json({ message: "User email is required!" });
        }

        // user.email
        const result = await ToDoAppsTask.find({
          "user.email": userEmail,
          category: "To-Do",
        }).toArray();

        if (!result || result.length === 0) {
          return res.status(404).json({
            message: "No tasks found in 'In Progress' category for this user.",
          });
        }

        res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    });

    // get In-Progress task
    app.get("/add-task/getInProgressTask/:email", async (req, res) => {
      try {
        const userEmail = req.params.email;

        if (!userEmail) {
          return res.status(400).json({ message: "User email is required!" });
        }

        // user.email
        const result = await ToDoAppsTask.find({
          "user.email": userEmail,
          category: "In Progress",
        }).toArray();

        if (!result || result.length === 0) {
          return res.status(404).json({
            message: "No tasks found in 'In Progress' category for this user.",
          });
        }

        res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    });

    // get Completed task
    app.get("/add-task/getDoneTask/:email", async (req, res) => {
      try {
        const userEmail = req.params.email;

        if (!userEmail) {
          return res.status(400).json({ message: "User email is required!" });
        }

        // user.email
        const result = await ToDoAppsTask.find({
          "user.email": userEmail,
          category: "Done",
        }).toArray();

        if (!result || result.length === 0) {
          return res.status(404).json({
            message: "No tasks found in 'In Progress' category for this user.",
          });
        }

        res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    });

    // update task status  /add-task/updateCategory/${id}
    app.patch("/add-task/updateCategory/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { category } = req.body;
        // console.log({id, category});
        if (!category) {
          return res.status(400).json({ message: "Category is required!" });
        }

        const result = await ToDoAppsTask.updateOne(
          { _id: new ObjectId(id) },
          { $set: { category } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({
            message: "Task not found or category is already the same.",
          });
        }

        res.status(200).json({ message: "Task status updated successfully" });
      } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({
          message: "Failed to update task status",
          error: error.message,
        });
      }
    });

    // delete task
    app.delete("/add-task/deleteTask/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await ToDoAppsTask.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete task" });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//server run or not
app.get("/", (req, res) => {
  res.send("Task Management Apps server is running");
});

app.listen(port, () => {
  console.log(`Task Management Apps is running on port ${port}`);
});
