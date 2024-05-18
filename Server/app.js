const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(cors());

let items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
];

let users = [{ id: 1, Username: "Nikhil", Password: "123" }];

app.get("/api/items", (res, rep) => {
  rep.json(items);
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users/login", (req, res) => {
  try {
    const { Username, password } = req.body;
    const user = users.find((e) => e.Username === Username);

    if (user) {
      const passwordMatch = bcrypt.compare(password, user.Password);

      if (passwordMatch) {
        res.json({ message: "Login successful" });
      } else {
        res.json({ message: "Incorrect password" });
      }
    } else {
      res.json({ message: "User does not exist" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const Cradiatiions = req.body;
    const userid = users.length + 1;
    const Hashpassword = await bcrypt.hash(Cradiatiions.Password, 10);
    Cradiatiions.id = userid;
    Cradiatiions.Password = Hashpassword;
    users.push(Cradiatiions);
    res.json({ message: "the Data is Set" });
  } catch (error) {
    res.json({ message: "Something Is Error Here" });
  }
});

app.get("/api/items/:id", (req, res) => {
  const itemId = parseInt(req.params.id);

  const dataIndex = items.findIndex((item) => item.id === itemId);

  if (dataIndex !== -1) {
    res.json(items[dataIndex]);
  } else {
    res.json({ message: "No item found with the specified ID" });
  }
});

app.post("/api/items", (req, res) => {
  const newItms = req.body;
  const newid = items.length + 1;
  newItms.id = newid;
  items.push(newItms);
  res.json(`itms added ${newItms.name}`);
});

app.put("/api/items/:id", (req, res) => {
  const itemid = parseInt(req.params.id);
  const updateditem = req.body;

  const index = items.findIndex((items) => items.id === itemid);
  if (index !== -1) {
    items[index] = { ...items[index], ...updateditem };
    res.json({
      data: items[index],
      message: `the data is being Updated ${itemid}`,
    });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});
app.delete("/api/items/:id", (req, res) => {
  const index = parseInt(req.params.id);
  const deletindex = items.findIndex((items) => items.id === index);
  if (deletindex !== -1) {
    items.splice(deletindex, 1);
    res.json({ message: "the Data is Deleted" });
  } else {
    res.json({ message: "The Data IS Not Find" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
