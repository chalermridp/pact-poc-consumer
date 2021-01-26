export class ErrorResponse {
  code: number;
  error_name: string;
  error_message: string;

  constructor(code: number, error_name: string, error_message: string) {
    this.code = code;
    this.error_name = error_name;
    this.error_message = error_message;
  }
}
