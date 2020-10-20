const { UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const { getAuthenticatedUser } = require("../../utils/validateAuth");

module.exports = {
  Mutation: {
    async addComment(_, args, context) {
      const user = getAuthenticatedUser(context);
      const { postId, body } = args;

      const post = await Post.findById(postId);
      console.log("addComment -> post", post);

      if (!post) {
        throw new UserInputError("No such post available");
      }

      const comment = {
        body,
        username: user.username,
        createdAt: new Date().toISOString(),
      };
      post.comments = [comment, ...post.comments];
      await post.save();

      return post;
    },
    async deleteComment(_, args, context) {
      const user = getAuthenticatedUser(context);
      const { postId, commentId } = args;

      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("No such post available");
      }

      const { comments } = post;

      const commentIndex = comments.findIndex(({ id }) => id === commentId);
      if (comments[commentIndex].username === user.username) {
        comments.splice(commentIndex, 1);
        await post.save();
        return post;
      } else {
        throw new Error("Unauthorized action");
      }
    },
  },
};
