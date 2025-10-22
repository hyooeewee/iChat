import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // hide password when returning JSON
      transform: function (doc, ret) {
        delete (ret as Partial<IUser>).password;
        return ret;
      },
    },
  }
);

const User = mongoose.model('User', userSchema);

export type IUser = InferSchemaType<typeof userSchema>;
export type IUserDocument = HydratedDocument<IUser>;

export default User;
