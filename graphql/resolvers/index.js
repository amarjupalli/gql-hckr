const postResolvers = require("./posts");
const userResolvers = require("./users");
const commentsResolvers = require("./comments");

module.exports = {
  // FIXME: better comment - What's this called in gql terminology ? override? post processing?
  Post: {
    commentsCount: ({ comments }) => comments.length,
    likesCount: ({ likes }) => likes.length,
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};
