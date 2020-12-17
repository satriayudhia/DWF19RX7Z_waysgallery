const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  let header, token
  if (
    !(header = req.header("Authorization")) ||
    !(token = header.replace("Bearer ",""))
  ) {
    return res.status(400).send({
      status: "response fail",
      error: {
        message: "access denied"
      }
    })
  }

  try {
    const privateKey = "W4ysGallery"
    const verified = jwt.verify(token, privateKey)

    req.user = verified

    next()
  } catch (err) {
    return res.status(401).send({
      status: "response fail",
      error: {
        message: "invalid token",
      },
    });
  }
};
