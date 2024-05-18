export enum OrderStatus {
  PENDING = 'Pending',
  RECEIVED = 'Received',
  IN_PREPARATION = 'InPreparation',
  CONCLUDED = 'Concluded',
  FINISHED = 'Finished',
}

export const orderStatusNumber = {
  [0]: OrderStatus.PENDING,
  [1]: OrderStatus.RECEIVED,
  [2]: OrderStatus.IN_PREPARATION,
  [3]: OrderStatus.CONCLUDED,
  [4]: OrderStatus.FINISHED,
};
