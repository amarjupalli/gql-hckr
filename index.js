const { ApolloServer } = require("apollo-server");

const gql = require("graphql-tag");

const typeDefs = gql`
  type Query {
    testStr: String!
  }
`;

const resolvers = {
  Query: {
    testStr() {
      return "testing string...";
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 5000 }).then((res) => {
  console.log(`Server running at ${res.url}`);
});
