class ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  success: boolean;
  constructor(statusCode: number, message: string, data: T | null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400 ? true : false;
  }
}
export default ApiResponse;
