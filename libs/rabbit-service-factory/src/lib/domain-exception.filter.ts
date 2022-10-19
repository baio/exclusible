import {
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { throwError } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

// Demonstrates how to handle domain errors with global filter
// In your case consider typeorm errors also as domain errors
// https://docs.nestjs.com/microservices/exception-filters
// All microservices should map domain errors and return ones in HttpException format

const mapException = (exception: unknown) => {
  switch (exception.constructor) {
    case EntityNotFoundError:
      return new NotFoundException(exception);
    default:
      if (exception instanceof HttpException) {
        return exception;
      } else {
        return new InternalServerErrorException(exception);
      }
  }
};

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown) {
    return throwError(() => mapException(exception));
  }
}
