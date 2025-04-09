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
  