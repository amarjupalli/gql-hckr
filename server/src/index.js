// import { GraphQLServer } from "graphql-yoga";
const { GraphQLServer } = require("graphql-yoga");

const typeDefs = `
    type Query {
      info: String!
      feed: [Link]!
    }

    type Link {
      id: ID!
      description: String!
      url: String!
    }
`;

const links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "graphql tutorial"
  }
];

const resolvers = {
  Query: {
    info: () => "API for hackernews clone",
    feed: () => links
  },
  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url
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
