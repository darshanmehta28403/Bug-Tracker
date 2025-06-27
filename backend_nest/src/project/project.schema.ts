import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({
  timestamps: true, toJSON: {
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
    versionKey: false
  }
})
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  members: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

