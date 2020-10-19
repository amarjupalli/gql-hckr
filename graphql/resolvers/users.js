const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { UserInputError } = require("apollo-server");

const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const { validateInput } = require("../../utils/inputValidators");

const generateToken = ({ id, email, username }) => {
  return jwt.sign(
    {
      id,
      email,
      username,
    },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
};

module.exports = {
  Mutation: {
    async register(_, args) {
      const {
        registerInput: { username, password, confirmPassword, email },
      } = args;

      const { errors, valid } = validateInput({
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
      const token = generateToken(user);

      return {
        ...savedUser._doc,
        id: savedUser._id,
        token,
      };
    },
    async login(_, args) {
      const { username, password } = args;

      const { errors, valid } = validateInput({ username, password });

      if (!valid) {
        throw new UserInputError("Invalid stuff", { errors });
      }

      const existingUser = await User.findOne({ username });
      if (!existingUser) {
        errors.general = `Username ${username} does not exist`;
        throw new UserInputError(`User not found: ${username}`, { errors });
      }

      const matches = await bcrypt.compare(password, existingUser.password);

      if (!matches) {
        errors.general = `Incorrect password for ${username}. Try again.`;
        throw new UserInputError(
          `Incorrect password entered by user: ${username}`,
          { errors }
        );
      }

      const token = generateToken(existingUser);

      return {
        ...existingUser._doc,
        id: existingUser._id,
        token,
      };
    },
  },
};
