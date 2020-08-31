const bcrypt = require("bcryptjs");
const { createAccessToken } = require("../../utils");

const signup = async (parent, args, context) => {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = createAccessToken(user.userId);
  context.req.session.userId = user.userId;

  return {
    token,
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

  const token = createAccessToken(user.id);
  context.req.session.userId = user.id;

  return {
    token,
    user,
  };
};

module.exports = { login, signup };
