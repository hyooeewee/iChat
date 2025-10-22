type User = {
  _id: string;
  email: string;
  username: string;
  profilePic: string;
  bio: string;
};

type Message = {
  _id?: string;
  senderId: string;
  receiverId: string;
  content?: string;
  image?: string;
  seen?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type { Message, User };
