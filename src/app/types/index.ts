import { Dislike, Like, User, Video } from "@prisma/client";

export interface VideoWithUser extends Video {
    user: User;
    likes: Like[];
    dislikes: Dislike[];
    comments: FullComment[];
    _count: {
      likes: number;
      dislikes: number;
      comments: number;
    };
  }
  

export interface Comment {
    id: string;
    content: string;
    videoId: string;
    userId: string;
    createdAt: string; // or Date if you're parsing it
    updatedAt: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }

  export interface FullComment {
    id: string;
    userId: string;
    videoId: string;
    content: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    user: {
      id: string;
      email: string;
      name: string | null;
      emailVerified: boolean;
      image: string | null;
      createdAt: string | Date;
      updatedAt: string | Date;
    };
    commentLikes: { userId: string }[];
    commentDislikes: { userId: string }[];
    _count: {
      commentLikes: number;
      commentDislikes: number;
    };
  }
  
//   export interface VideoWithUser {
//     id: string;
//     name: string;
//     description: string;
//     createdAt: Date;
//     updatedAt: Date;
//     userId: string;
//     user: {
//       id: string;
//       name: string | null;
//       email: string;
//       image: string | null;
//       createdAt: Date;
//       updatedAt: Date;
//     };
//     likes: { id: string; userId: string; videoId: string }[];
//     dislikes: { id: string; userId: string; videoId: string }[];
//     comments: {
//       id: string;
//       content: string;
//       createdAt: Date;
//       updatedAt: Date;
//       userId: string;
//       videoId: string;
//       user: {
//         id: string;
//         name: string | null;
//         email: string;
//         image: string | null;
//       };
//       commentLikes: { userId: string }[];
//       commentDislikes: { userId: string }[];
//       _count: {
//         commentLikes: number;
//         commentDislikes: number;
//       };
//     }[];
//     _count: {
//       likes: number;
//       dislikes: number;
//       comments: number;
//     };
//   }
  