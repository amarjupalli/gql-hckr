// import { GraphQLServer } from "graphql-yoga";
const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

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

  type Mutation {
    post(url: String!, description: String!): Link!
    deleteLink(id: ID!): Link
  }
`;

const resolvers = {
  Query: {
    info: () => "API for hackernews clone",
    feed: (root, args, context, info) => context.prisma.links()
  },

  Mutation: {
    post: (root, args, context) => {
      const {
        prisma: { createLink }
      } = context;
      return createLink({
        url: args.url,
        description: args.description
      });
    },
    deleteLink: (root, args, context) => {
      const {
        prisma: { links }
      } = context;
      const indexToDelete = links.findIndex(({ id }) => id === args.id);
      const deletedLink = links[indexToDelete];
      links.splice(indexToDelete, 1);
      return deletedLink;
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: { prisma }
});

const port = "4000";
server.start(() => {
  console.log(`Server is running on http://localhost:${port}`);
});
