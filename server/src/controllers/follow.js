const { Follow } = require("../../models");

//ADD FOLLOWING
exports.addFollow = async (req, res) => {
  try {
    const { body } = req;

    const follow = await Follow.create(body);

    res.send({
      status: "success",
      data: {
        follow: follow,
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

//DELETE FOLLOWING
exports.deleteFollow = async (req, res) => {
  try {
    const { body } = req;

    console.log("BODY", body);

    const deleted = await Follow.destroy({
      where: { following: body.following, follower: body.follower },
    });

    res.send({
      status: "success",
      data: deleted,
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
