// import { GraphQLServer } from "graphql-yoga";
const { GraphQLServer } = require("graphql-yoga");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "graphql tutorial"
  }
];

let idCount = links.length;

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
    feed: () => links
  },

  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    },
    deleteLink: (parent, args) => {
      const indexToDelete = links.findIndex(({ id }) => id === args.id);
      const deletedLink = links[indexToDelete];
      links.splice(indexToDelete, 1);
      return deletedLink;
    }
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
