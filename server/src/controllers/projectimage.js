const { ProjectImage } = require("../../models");

//ADD PROJECT IMAGES
exports.addProjectImages = async (req, res) => {
  try {
    const { body } = req;

    const projectImage = await ProjectImage.create(body);

    res.send({
      status: "success",
      data: {
        projectImage: projectImage,
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
