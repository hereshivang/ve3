import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import methodOverride from 'method-override';
import path from "path";
import Task from "./model/Task.model.js";
import { fileURLToPath } from "url";
import userRoutes from "./routes/User.route.js";
import taskRoutes from "./routes/Task.route.js";
import { authenticate } from "./Middleware/JWT.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB Connection
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set('views', path.join(path.resolve(), 'views'));
app.use(express.static(path.join(path.resolve(), 'public')));

app.use("/api", taskRoutes);
app.use("/api", userRoutes);

// User Routes
app.get("/", (req, res) => {
  res.render("user/Index");
});
app.get("/register", (req, res) => {
  res.render("user/Register");
});
app.get("/login", (req, res) => {
  res.render("user/Login");
});
app.get("/home", authenticate, (req, res) => {
  res.render("user/Home", { user: req.user });
});
app.post("/logout", (req, res) => {
  res.clearCookie("token"); 
  res.redirect("/");
});

// task routes
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('tasks/tasks', { tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching tasks');
  }
});

app.get('/tasks/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Task not found');
    res.render('tasks/task', { task });
  } catch (error) {
    res.status(500).send('Error fetching task');
  }
});

app.get('/tasks/create', authenticate, (req, res) => {
  res.render('tasks/create');
});

app.get('/tasks/:id/edit', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('Task not found');
    res.render('tasks/edit', { task });
  } catch (error) {
    res.status(500).send('Error fetching task');
  }
});


// Port Listening
app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port 8080");
});
