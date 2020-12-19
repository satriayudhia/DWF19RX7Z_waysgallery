const { Photo } = require("../../models");

//ADD PHOTO
exports.addPhoto = async (req, res) => {
  try {
    const { body } = req;
    const { postId } = req.params;

    const photo = await Photo.create({ ...body, postId });

    res.send({
      status: "success",
      data: {
        photo: {
          id: photo.id,
          postId: photo.postId,
          photo: photo.photo,
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
