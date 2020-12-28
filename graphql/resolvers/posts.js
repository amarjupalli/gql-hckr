const { UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const { getAuthenticatedUser } = require("../../utils/validateAuth");
module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, args) {
      const { postId } = args;
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new UserInputError(`Post not found for post id: ${postId}`);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async addPost(_, args, context) {
      const user = getAuthenticatedUser(context);

      const { body } = args;

      if (body.trim() === "") {
        throw new Error("Post cannot be empty!");
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();
      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });
      return post;
    },
    async deletePost(_, args, context) {
      const user = getAuthenticatedUser(context);

      try {
        const { postId } = args;
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted.";
        } else {
          throw new Error("Unauthorized action.");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async addLike(_, args, context) {
      const user = getAuthenticatedUser(context);
      const { postId } = args;

      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError(`Post not found for post id: ${postId}`);
      }

      const { likes } = post;
      const existingLike = likes.find(
        ({ username }) => username === user.username
      );
      if (existingLike) {
        likes = likes.filter((like) => like.id !== existingLike.id);
      } else {
        const like = {
          username: user.username,
          createdAt: new Date().toISOString(),
        };
        likes.push(like);
      }

      await post.save();
      return post;
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator("NEW_POST");
      },
    },
  },
};
