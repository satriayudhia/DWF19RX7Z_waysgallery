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
const {
  getPosts,
  getPost,
  getPostByUserId,
  addPost,
} = require("../controllers/post");

//PHOTOS
const { addPhoto } = require("../controllers/photo");

//TRANSACTIONS
const {
  getTransactionsOffer,
  getTransactionsOrder,
  addTransactionHire,
  updateTransaction,
} = require("../controllers/transaction");

//PROJECTS
const { addProject } = require("../controllers/project");

//PROJECTIMAGES
const { addProjectImages } = require("../controllers/projectimage");

//FOLLOWINGS
const { addFollow, deleteFollow } = require("../controllers/follow");

// ==== //
// PATH //
// ==== //

//AUTHORIZATION PATH
router.post("/register", register);
router.post("/login", login);

//USERS PATH
router.get("/users", authentication, getUsers);
router.get("/user/:id", authentication, getUser);
router.get("/user/:id", authentication, getUser);
router.patch("/user/:id", authentication, updateUser);

//ARTS PATH
router.post("/arts/:id", authentication, addArts);

//POSTS PATH
router.get("/posts", authentication, getPosts);
router.get("/post/:id", authentication, getPost);
router.get("/post-user/:userId", authentication, getPostByUserId);
router.post("/add-post/:id", authentication, addPost);

//PHOTOS PATH
router.post("/photo/:postId", authentication, addPhoto);

//TRANSACTIONS PATH
router.get("/transactions-order/:userId", authentication, getTransactionsOrder);
router.get("/transactions-offer/:userId", authentication, getTransactionsOffer);
router.post("/transaction", authentication, addTransactionHire);
router.patch("/transaction/:id", authentication, updateTransaction);

//PROJECTS PATH
router.post("/add-project", authentication, addProject);

//PROJECTIMAGES PATH
router.post("/add-project-image", authentication, addProjectImages);

//FOLLOWINGS PATH
router.post("/follow", authentication, addFollow);
router.delete("/delete-follow", authentication, deleteFollow);

module.exports = router;
