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
const prismaClient = new PrismaClient();

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const port = process.env.PORT || 4000;
const sessionDurationInSeconds =
  process.env.SESSION_DURATION_IN_SECONDS || 60 * 60 * 24 * 7; // One week

const server = new ApolloServer({
  context: ({ req, res }) => {
    return {
      req,
      res,
      prisma: prismaClient,
      redis: redisClient,
    };
  },
  resolvers,
  typeDefs,
});

const app = express();

app.set("trust proxy", 1); // trust first proxy
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      name: "userSessionId",
      ttl: sessionDurationInSeconds,
    }), // One week
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: process.env.DOMAIN,
      maxAge: 1000 * sessionDurationInSeconds, // One week
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

server.applyMiddleware({ app });

app.listen(port, () => {
  console.log(`🚀  Server ready at port ${port}`);
});
