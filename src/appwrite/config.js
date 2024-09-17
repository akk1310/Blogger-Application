// import conf from '../conf.js'
import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";
import authService from "./auth.js";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
    authorName,
    postDate,
    likes,
    comments = []
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
          authorName,
          postDate,
          likes: [],
          comments,
        }
      );
    } catch (error) {
      console.log("Appwrite Service::createPost::error", error);
    }
  }

  async updatePost(
    slug,
    { title, content, featuredImage, status, authorName, postDate, likes,comments }
  ) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          authorName,
          postDate,
          likes,
          comments,
        }
      );
    } catch (error) {
      console.log("Appwrite Service::updatePostUser::error", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite Service::deletepost::error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite Service::getpost::error", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwrite Service::getposts::error", error);
      return false;
    }
  }

  //file upload service
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite Service::uploadFile::error", error);
      return false;
    }
  }
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite Service::deleteFile::error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
  }
  async likePost(slug, userId) {
    try {
      // Retrieve the current post
      const post = await this.getPost(slug);
      if (!post) return false;
  
      // Check if the user has already liked the post
      if (!post.likes.includes(userId)) {
        // Add the userId to the likes array if it's not already there
        const updatedLikes = [...(post.likes || []), userId];
  
        // Update the post with the new likes array
        return await this.updatePost(slug, { 
          ...post, 
          likes: updatedLikes 
        });
      }
  
      // If the user already liked the post, return without making changes
      return false;
    } catch (error) {
      console.log("Appwrite Service::likePost::error", error);
      return false;
    }
  }
  
  async unlikePost(slug, userId) {
    try {
      // Retrieve the current post
      const post = await this.getPost(slug);
      if (!post) return false;
  
      // Remove the userId from the likes array
      const updatedLikes = (post.likes || []).filter(id => id !== userId);
  
      // Update the post with the new likes array
      return await this.updatePost(slug, {
        ...post,
        likes: updatedLikes,
      });
    } catch (error) {
      console.log("Appwrite Service::unlikePost::error", error);
      return false;
    }
  }

  async checkUserLikeStatus(postId) {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return false;

      // Fetch all likes for the post
      const post = await this.getPost(postId);
      if (!post || !post.likes || !Array.isArray(post.likes)) return false;

      // Check if the user has already liked the post
      const userId = user.$id;
      return post.likes.includes(userId);
    } catch (error) {
      console.log('Appwrite Service::checkUserLikeStatus::error', error);
      return false;
    }
  }
  
}

const service = new Service();
export default service;
