const { Art } = require("../../models");
const Joi = require("joi");

//ADD ARTS
exports.addArts = async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;

    const art = await Art.create({ ...body, userId: id });

    res.send({
      status: "success",
      data: {
        art,
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
