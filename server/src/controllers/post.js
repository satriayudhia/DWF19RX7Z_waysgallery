const { Post, User, Photo } = require("../../models");
const Joi = require("joi");

//GET ALL POSTS
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
      include: [
        {
          model: Photo,
          as: "photos",
          attributes: {
            exclude: ["createdAt", "updatedAt", "postId", "PostId"],
          },
        },
        {
          model: User,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "profpic",
              "greeting",
            ],
          },
        },
      ],
    });

    if (!posts) {
      return res.status(400).send({
        status: "post empty",
        data: [],
      });
    }

    res.send({
      status: "success",
      data: { posts: posts },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: {
        message: "server error",
      },
    });
  }
};

//GET SPECIFIC POST BY ID
exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "UserId"],
      },
      include: [
        {
          model: Photo,
          as: "photos",
          attributes: {
            exclude: ["createdAt", "updatedAt", "postId", "PostId"],
          },
        },
        {
          model: User,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "password",
              "profpic",
              "greeting",
            ],
          },
        },
      ],
    });

    if (!post) {
      return res.status(400).send({
        status: "post not found",
        data: [],
      });
    }

    res.send({
      status: "success",
      data: { post: post },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: {
        status: "server error",
      },
    });
  }
};

//ADD POST
exports.addPost = async (req, res) => {
  try {
    const { body } = req;
    // const fileName = files.photos[0].filename;
    const { id } = req.params;

    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      description: Joi.string().min(5).required(),
    });

    const { error } = schema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).send({
        status: "validation error",
        error: {
          message: error.details.map((error) => error.message),
        },
      });
    }

    const post = await Post.create({ ...body, userId: id });

    res.send({
      status: "success",
      data: {
        post: {
          id: post.id,
          title: post.title,
          description: post.description,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: {
        status: "server error",
      },
    });
  }
};

//DELETE USER BY ID
exports.deleteUser = async (req, res) => {
  try {
    // let users = await Users.findAll()
    const { id } = req.params;
    const checkUserById = await User.findOne({ where: { id } });

    if (!checkUserById) {
      res.send({
        status: "user data not found",
        data: [],
      });
    }

    await User.destroy({ where: { id } }).then((user) => {
      res.send({
        status: "success",
        data: {
          id,
        },
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};
