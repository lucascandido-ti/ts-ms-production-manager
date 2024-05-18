export enum PaymentMethodIdx {
  QRCode,
}

export enum PaymentMethod {
  QRCode = 'QRCode',
}

export const paymentMethodNumber = {
  [0]: PaymentMethod.QRCode,
};

export const paymentMethodDict = {
  [PaymentMethod.QRCode]: 'QRCode',
};
