const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const { auth: authentication } = require("../middleware/auth");

// ================= //
// CONTROLLER IMPORT //
// ================= //

//AUTHORIZATION
const { register, login, checkAuth } = require("../controllers/auth");

//USERS
const { getUsers, getUser, updateUser } = require("../controllers/user");

//ARTS
const { addArts } = require("../controllers/art");

//POSTS
const { getPosts, getPost, addPost } = require("../controllers/post");

// ==== //
// PATH //
// ==== //

//AUTHORIZATION PATH
router.post("/register", register);
router.post("/login", login);

//USERS PATH
router.get("/users", authentication, getUsers);
router.get("/user/:id", authentication, getUser);
router.patch("/user/:id", authentication, updateUser);

//ARTS PATH
router.post("/arts/:id", authentication, addArts);

//POSTS PATH
router.get("/posts", authentication, getPosts);
router.get("/post/:id", authentication, getPost);
router.post("/add-post/:id", authentication, addPost);

module.exports = router;
