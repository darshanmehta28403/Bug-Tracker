import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({
  timestamps: true, toJSON: {
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
    versionKey: false
  }
})
export class Comment {
  @Prop({ required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: string;

  @Prop({ type: Types.ObjectId, ref: 'Bug', required: true })
  bug: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

