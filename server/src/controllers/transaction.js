const { Transaction, User, Project } = require("../../models");
const Joi = require("joi");

//GET MY ORDER TRANSACTIONS
exports.getTransactionsOrder = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.findAll({
      where: { orderBy: userId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: User,
          as: "orderedBy",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: User,
          as: "orderedTo",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: Project,
          as: "project",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    if (!transactions) {
      return res.status(400).send({
        status: "transaction empty",
        data: [],
      });
    }

    res.send({
      status: "success",
      data: { transactions: transactions },
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

//GET MY OFFER TRANSACTIONS
exports.getTransactionsOffer = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.findAll({
      where: { orderTo: userId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: User,
          as: "orderedBy",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: User,
          as: "orderedTo",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    if (!transactions) {
      return res.status(400).send({
        status: "transaction empty",
        data: [],
      });
    }

    res.send({
      status: "success",
      data: { transactions: transactions },
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

//ADD TRANSACTION HIRE
exports.addTransactionHire = async (req, res) => {
  try {
    const { body } = req;

    const transaction = await Transaction.create(body);

    res.send({
      status: "success",
      data: {
        transaction: transaction,
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

//EDIT TRANSACTION STATUS
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const checkTransaction = await Transaction.findOne({ where: { id } });

    if (!checkTransaction) {
      return res.status(400).send({
        status: "data transaction not found",
        data: {
          post: null,
        },
      });
    }

    await Transaction.update(body, { where: { id } });

    const transaction = await Transaction.findOne({ where: { id } });

    res.send({
      status: "success",
      data: {
        transaction,
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
