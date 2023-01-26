export default class MovementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MovementError";
  }
}

