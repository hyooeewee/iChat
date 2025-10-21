type User = {
  _id: string;
  email: string;
  username: string;
  profilePic: string;
  bio: string;
};

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  // more fields
};

export type { Message, User };
