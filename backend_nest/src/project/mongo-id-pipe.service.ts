import { NotAcceptableException, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export class MongoIdPipeService implements PipeTransform {
  transform(value: any) {
    if (!isValidObjectId(value)) {
      throw new NotAcceptableException;
    }
    return value;
  }
}
