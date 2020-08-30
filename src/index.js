const { GraphQLServer } = require("graphql-yoga");
const { PrismaClient } = require("@prisma/client");

const resolvers = require("./resolvers");

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma: new PrismaClient(),
    };
  },
});

server.start(() =>
  console.log("🚀 Server is running on http://localhost:4000")
);
