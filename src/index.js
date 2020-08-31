const cookieParser = require("cookie-parser");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { ApolloServer } = require("apollo-server-express");
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const port = process.env.PORT || 4000;

const server = new ApolloServer({
  context: ({ req, res }) => {
    return {
      req,
      res,
      prisma: new PrismaClient(),
    };
  },
  resolvers,
  typeDefs,
});

const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    store: new RedisStore({ client: redisClient, ttl: 60 * 60 * 24 * 7 }), // One week
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // One week
      secure: process.env.NODE_ENV === "production",
    },
  })
);

server.applyMiddleware({ app });

app.listen(port, () => {
  console.log(`🚀  Server ready at port ${port}`);
});
