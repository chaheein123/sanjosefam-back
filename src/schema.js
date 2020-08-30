const { gql } = require("apollo-server");

const typedefs = gql`
  type Mutation {
    signup(
      email: String!
      password: String!
      username: String!
      city: String
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    user: User
  }

  type User {
    id: ID!
    email: String!
    username: String!
    city: String
  }
`;

module.exports = typedefs;
