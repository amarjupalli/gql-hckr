const gql = require("graphql-tag");

const typeDefs = gql`
  type Comment {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }

  type Post {
    id: ID!
    body: String!
    createdAt: String!
    user: String!
    username: String!
    comments: [Comment]!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type User {
    id: ID!
    token: String!
    username: String!
    email: String!
    createdAt: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: String!): Post!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    addPost(body: String!): Post!
    deletePost(postId: ID!): String!
    addComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
  }
`;

module.exports = typeDefs;
