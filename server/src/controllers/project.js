const { Project, ProjectImage } = require("../../models");
const Joi = require("joi");

//GET ALL PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
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

    if (!projects) {
      return res.status(400).send({
        status: "post empty",
        data: [],
      });
    }

    res.send({
      status: "success",
      data: { projects: projects },
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
