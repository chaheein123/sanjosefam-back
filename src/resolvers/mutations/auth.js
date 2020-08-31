const bcrypt = require("bcryptjs");
const { AuthError, createAccessToken } = require("../../utils");

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
    throw new AuthError(`No user found for email: ${email}`);
  }

  const { session } = context.req;
  let token;

  if (session && session.userId) {
    if (user.id !== session.userId) {
      throw new AuthError();
    }

    token = createAccessToken(user.id);
  } else {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthError("Invalid password");
    }

    token = createAccessToken(user.id);
    context.req.session.userId = user.id;
  }

  return {
    token,
    user,
  };
};

module.exports = { login, signup };
