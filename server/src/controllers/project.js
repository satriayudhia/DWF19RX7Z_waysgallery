const { Project, ProjectImage } = require("../../models");
const Joi = require("joi");

//GET PROJECT BY TRANSACTION ID
exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findAll({
      where: { transactionId: id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "transactionId"],
      },
      include: [
        {
          model: ProjectImage,
          as: "images",
          attributes: {
            exclude: ["createdAt", "updatedAt", "projectId"],
          },
        },
      ],
    });

    if (!project) {
      return res.status(400).send({
        status: "project empty",
        data: [],
      });
    }

    res.send({
      status: "success",
      data: { project },
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

//ADD PROJECT
exports.addProject = async (req, res) => {
  try {
    const { body } = req;

    const schema = Joi.object({
      transactionId: Joi.number().required(),
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

    const project = await Project.create(body);

    res.send({
      status: "success",
      data: {
        project: project,
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
