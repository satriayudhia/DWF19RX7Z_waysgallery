const {User} = require('../../models')
const Joi = require('joi')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {
        const {body} = req

        const schema = Joi.object({
            fullname: Joi.string().min(2).required(),
            email: Joi.string().email().min(10).required(),
            password: Joi.string().min(8).required(),
            profpic: Joi.string(),
        })

        const { error } = schema.validate(body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).send({
              status: "input validation error",
              error: {
                message: error.details.map((error) => error.message),
              },
            });
        }

        const {email} = req.body
        const userCheck = await User.findOne({where: {email}})

        if(userCheck) {
            return res.status(400).send({
                status: "email already registered",
                data: []
            })
        }

        const {fullname, password, status, profpic} = body
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            fullname,
            password: hashedPassword,
            email,
            profpic
        })

        const privateKey = "W4ysGallery"

        const token = jwt.sign({id: newUser.id}, privateKey)

        res.send({
            status: "success",
            data: {
                name: newUser.name,
                email: newUser.email,
                token
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            error: {
                message: "server error"
            }
        })
    }
}

exports.login = async (req, res) => {
    try {
      const { body } = req
  
      const schema = Joi.object({
        email: Joi.string().email().min(10).required(),
        password: Joi.string().min(8).required()
      })
  
      const { error } = schema.validate(body, {
        abortEarly: false
      })
  
      if (error) {
        return res.status(400).send({
          status: "input validation error",
          error: {
            message: error.details.map((error) => error.message)
          }
        })
      }
  
      const { email, password } = req.body;
  
      const user = await User.findOne({
        where: {
          email
        },
      })
  
      if (!user) {
        return res.status(400).send({
          status: "login failed",
          error: {
            message: "invalid login"
          }
        })
      }

      const validPass = await bcrypt.compare(password, user.password);
  
      if (!validPass) {
        return res.status(400).send({
          status: "login failed",
          error: {
            message: "invalid login"
          }
        })
      }
  
      const privateKey = "W4ysGallery"
      const token = jwt.sign(
        {
          id: user.id,
        },
        privateKey
      );
  
      res.send({
        status: "success",
        data: {
          id: user.id,
          fullname: user.name,
          email: user.email,
          token,
        }
      })
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        error: {
          message: "server error"
        }
      })
    }
  }
  

  exports.checkAuth = async (req, res) => {
    try {
      const userId = req.user.id
      const user = await User.findOne({
        where: {
          id: userId
        }
      })

      res.send({
        status: "success",
        message: "user valid",
        data: user
      })
      
    } catch (error) {
      console.log(err);
      return res.status(500).send({
        error: {
          message: "Server Error"
        }
      })
    }
  }