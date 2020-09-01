const jwt = require("jsonwebtoken");

function authenticateUser(context) {
  const { session, headers } = context.req;

  if (!session || !session.userId || !headers.authorization) {
    throw new AuthError();
  }

  try {
    const token = headers.authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, process.env.APP_SECRET);

    if (userId !== context.req.session.userId) {
      throw new AuthError();
    }

    return userId;
  } catch (error) {
    throw new AuthError();
  }
}

function createAccessToken(userId) {
  return jwt.sign(
    {
      userId,
    },
    process.env.APP_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_DURATION || "8h",
    }
  );
}

class AuthError extends Error {
  constructor(message) {
    super(message || "Unauthorized");
  }
}

module.exports = {
  AuthError,
  authenticateUser,
  createAccessToken,
};
