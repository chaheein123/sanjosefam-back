const { getUserId } = require("../../utils");

const user = (parent, args, context) => {
  const id = getUserId(context);
  return context.prisma.user.findOne({
    where: {
      id,
    },
  });
};

module.exports = { user };
