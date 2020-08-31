const { authenticateUser } = require("../../utils");

const user = (parent, args, context) => {
  const id = authenticateUser(context);
  return context.prisma.user.findOne({
    where: {
      id,
    },
  });
};

module.exports = { user };
