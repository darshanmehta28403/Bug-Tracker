import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BugDocument = Bug & Document;

@Schema({
  timestamps: true, toJSON: {
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
    versionKey: false
  }
})
export class Bug {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  description: string;

  @Prop({ required: true, enum: ['low', 'mid', 'high', 'severe'], lowercase: true, default: 'low' })
  severity: string;

  @Prop({ required: true, enum: ['open', 'in-progress', 'resolved', 'postponed'], lowercase: true, default: 'open' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reportedBy: Types.ObjectId;
}

export const BugSchema = SchemaFactory.createForClass(Bug);

