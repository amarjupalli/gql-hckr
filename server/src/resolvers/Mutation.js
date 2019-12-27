const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const {
    prisma: { createUser }
  } = context;
  const user = await createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

async function login(parent, args, context, info) {
  const {
    prisma: { user: prismaUser }
  } = context;

  const user = await prismaUser({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("invalid password");
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

function post(parent, args, context, info) {
  const userId = getUserId(context);
  const {
    prisma: { createLink }
  } = context;
  return createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
}

module.exports = { signup, login, post };
