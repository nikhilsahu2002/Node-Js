const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const list = [{ name: "nikhil" }, { name: "rahul" }];

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.get("/", (req, res) => {
  res.json(list);
});

app.post("/", (req, res) => {
  const { name } = req.body;
  if (name) {
    list.push({ name });
    res.json({ message: "The data has been set", data: list });
  } else {
    res.status(400).json({ message: "Name is required" });
  }
});

app.put("/", (req, res) => {
  const { currentName, NewName } = req.body;

  const user = list.find((user) => user.name === currentName);

  if (user) {
    user.name = NewName;
    res.json({ message: " the name has Been Chagned" });
  } else {
    res.json({ message: "the user not found" });
  }
});

app.delete("/", (req, res) => {
  const { name } = req.body;
  index = list.findIndex((user) => user.name === name);

  if (index !== -1) {
    list.splice(index, 1);
    res.json({ message: "A Name Is Deleted", data: list });
  } else {
    res.status(404).json({ message: "The user is not there" });
  }
});
