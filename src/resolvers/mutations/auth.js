const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (parent, args, context) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  return {
    token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
    user,
  };
};

const login = async (parent, { email, password }, context) => {
  const user = await context.prisma.user.findOne({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error(`No user found for email: ${email}`);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  return {
    token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
    user,
  };
};

module.exports = { login, signup };
