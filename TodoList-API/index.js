const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI, {})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err));

//Import Routes
const authRoute = require("./routes/auth");
const todoRoutes = require("./routes/todos");

// Use Routes
app.use("/api/user", authRoute);
app.use("/api/todo", todoRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
