const { Todo } = require("../models/todo");
const auth = require("../middleware/auth.js");
const express = require("express");
const Joi = require("joi");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find().sort({ date: -1 });
    const filteredTodos = todos.filter((todo) => todo.uid === req.user._id);
    //console.log(req.user);
    res.send(filteredTodos);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.post("/", auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(200).required(),
    author: Joi.string().min(3).max(30),
    uid: Joi.string(),
    isComplete: Joi.boolean(),
    date: Joi.date(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, author, isComplete, date, uid } = req.body;
  // creating document .
  let todo = new Todo({
    name,
    author,
    isComplete,
    date,
    uid,
  });
  try {
    todo = await todo.save();
    res.send(todo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(200).required(),
    author: Joi.string().min(3).max(30),
    uid: Joi.string(),
    isComplete: Joi.boolean(),
    date: Joi.date(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(400).send("Todo not found...");

    if (todo.uid !== req.user._id)
      return res.status(401).send("Todo update failed.Not Authorized...");

    const { name, author, isComplete, date, uid } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        name,
        author,
        isComplete,
        date,
        uid,
      },
      { new: true }
    );
    res.send(updatedTodo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(400).send("Todo not found...");

    if (todo.uid !== req.user._id)
      return res
        .status(401)
        .send("Todo check/uncheck failed.Not Authorized...");

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        isComplete: !todo.isComplete,
      },
      { new: true }
    );
    res.send(updatedTodo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(400).send("Todo not found...");

    if (todo.uid !== req.user._id)
      return res.status(401).send("Todo deletion failed.Not Authorized...");

    const deletedtodo = await Todo.findByIdAndDelete(req.params.id);
    res.send(deletedtodo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

module.exports = router;
