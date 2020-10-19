const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");

function getAuthenticatedUser(context) {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (error) {
        throw new Error("Invalid token");
      }
    }
    throw new Error(
      "Invalid authentication token string. Please pass the token as: 'Bearer <token>'"
    );
  }
  throw new Error("Authorization header not found.");
}

module.exports = {
  getAuthenticatedUser,
};
