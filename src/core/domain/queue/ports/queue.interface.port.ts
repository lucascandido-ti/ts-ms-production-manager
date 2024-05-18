export interface IQueueRepository {
  publish<T>(data: T, routingKey: string): void;
}
