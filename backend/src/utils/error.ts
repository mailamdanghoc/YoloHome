export class CustomError extends Error {
  constructor(
    public readonly message: string = "Server is broken! Please try again later!",
    public readonly status: number = 500
  ) {
    super(message);
  }
}
