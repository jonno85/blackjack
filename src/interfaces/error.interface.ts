export class GameError {
  private message: string;
  private status: number;

  constructor(message, status = 400) {
    this.message = message;
    this.status = status;
  }
}
