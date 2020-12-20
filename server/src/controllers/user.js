const { User, Art, Post, Photo, Follow } = require("../../models");

//GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!users) {
      return res.status(400).send({
        status: "user data empty",
        data: [],
      });
    }

    res.send({
      status: "success",
      data: { users: users },
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

//GET SPECIFIC User BY ID
exports.getUserForProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // const latestId = await Post.max("id", { where: { userId: id } });

    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
      include: [
        {
          model: Post,
          as: "post",
          // where: { id: latestId },
          attributes: {
            exclude: ["createdAt", "updatedAt", "UserId", "userId"],
          },
          include: [
            {
              model: Photo,
              as: "photos",
            },
          ],
        },
        {
          model: Art,
          as: "arts",
          attributes: {
            exclude: ["createdAt", "updatedAt", "UserId", "userId"],
          },
        },
        {
          model: Follow,
          as: "following",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id"],
          },
        },
        {
          model: Follow,
          as: "follower",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id"],
          },
        },
      ],
    });

    if (!user) {
      return res.status(400).send({
        status: "data user not found",
        data: [],
      });
    }

    res.send({
      status: "success",
      user,
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

//EDIT USER
exports.updateUser = async (req, res) => {
  try {
    const { body } = req;
    console.log("BODY", body);
    const { id } = req.params;

    const checkUser = await User.findOne({ where: { id } });

    if (!checkUser) {
      return res.status(400).send({
        status: "data user not found",
        data: [],
      });
    }

    await User.update(body, { where: { id } });

    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.send({
      status: "success",
      data: {
        user,
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
