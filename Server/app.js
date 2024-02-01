const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

let items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
];

app.get("/api/items", (res, rep) => {
  rep.json(items);
});

app.get("/api/items/:id", (req, res) => {
  const itemsid = parseInt(req.params.id);
  const data = items.findIndex((items) => items.id === itemsid);
  if (data !== -1) {
    res.json(items[data].name);
  } else {
    res.json({ Msessage: "NO Id" });
  }
});

app.post("/api/items", (req, res) => {
  const newItms = req.body;
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
