const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { UserInputError } = require("apollo-server");
const User = require("../../models/User");

const { SECRET_KEY } = require("../../config");

const validateRegisterInput = ({
  username,
  password,
  confirmPassword,
  email,
}) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username cannot be empty";
  }

  if (password.trim() === "") {
    errors.password = "Password cannot be empty";
  }

  if (confirmPassword.trim() === "") {
    errors.confirmPassword = "Confirm Password cannot be empty";
  }

  if (email.trim() === "") {
    // TODO: validate email with regex
    errors.email = "Email cannot be empty";
  }

  const valid = Object.keys(errors).length === 0;

  return { errors, valid };
};

module.exports = {
  Mutation: {
    async register(_, args) {
      const {
        registerInput: { username, password, confirmPassword, email },
      } = args;

      console.log("ob => ", { username, password, confirmPassword, email });
      const { errors, valid } = validateRegisterInput({
        username,
        password,
        confirmPassword,
        email,
      });

      if (!valid) {
        throw new UserInputError("Invalid stuff", { errors });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new UserInputError("Username already exists", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      const savedUser = await user.save();
      const token = jwt.sign(
        {
          id: user.id,
          email: user.emai,
          username: user.username,
        },
        SECRET_KEY,
        { expiresIn: "24h" }
      );

      return {
        ...savedUser._doc,
        id: savedUser._id,
        token,
      };
    },
  },
};
