export enum ErrorCodes {
  PAYMENT_NOT_PROCESSED = 100,
}

export abstract class Response {
  public Success: boolean;
  public Message: string;
  public ErrorCodes: ErrorCodes;
}
