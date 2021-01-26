export class BaseResponse<T> {
  code: number;
  data: T;

  constructor(code: number, data: T) {
    this.code = code;
    this.data = data;
  }
}
