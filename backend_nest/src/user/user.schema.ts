import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true, toJSON: {
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.plainPassword;
    },
    versionKey: false
  }
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  plainPassword: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true, enum: ['admin', 'developer', 'qa', 'intern'], lowercase: true })
  type: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

