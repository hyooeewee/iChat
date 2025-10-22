import mongoose, { HydratedDocument, InferSchemaType, Types } from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },

    receiverId: {
      type: Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export type IMessage = InferSchemaType<typeof messageSchema>;
export type IMessageDocument = HydratedDocument<IMessage>;

const Message = mongoose.model<IMessageDocument>('Message', messageSchema);
export default Message;
