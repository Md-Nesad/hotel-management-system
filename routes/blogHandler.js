const express = require("express");
const mongoose = require("mongoose")
const router = express.Router();
const blogSchema = require('../schemas/blogSchema')
const Blog = new mongoose.model("Blog",blogSchema)
const checkLogin = require("../middlewares/checkLogin")

router.post("/", async (req, res) => {
    try {
      const newBlog = new Blog(req.body);
      await newBlog.save();
      res.status(200).json({
        message: "Blog was inserted successfully!",
      });
    } catch (err) {
      console.error("Error inserting blog:", err);
      res.status(500).json({
        error: "There was a server side error!",
      });
    }
  });

module.exports = router;