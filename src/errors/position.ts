export default class PositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PostiionError";
  }
}

