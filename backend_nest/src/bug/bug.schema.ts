import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Severity, Status } from './bugEnums';

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

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: Severity, default: Severity.LOW })
  severity: Severity;

  @Prop({ required: true, enum: Status, default: Status.OPEN })
  status: Status;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reportedBy: Types.ObjectId;
}

export const BugSchema = SchemaFactory.createForClass(Bug);

