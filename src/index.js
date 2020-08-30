const { PrismaClient } = require("@prisma/client");
const { ApolloServer } = require("apollo-server");

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const server = new ApolloServer({
  context: (request) => {
    return {
      ...request,
      prisma: new PrismaClient(),
    };
  },
  resolvers,
  typeDefs,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
