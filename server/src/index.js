// import { GraphQLServer } from "graphql-yoga";
const { GraphQLServer } = require("graphql-yoga");

const typeDefs = `
    type Query {
      info: String!
    }
`;

const resolvers = {
  Query: {
    info: () => "API for hackernews clone"
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

const port = "4000";
server.start(() => {
  console.log(`Server is running on http://localhost:${port}`);
});
