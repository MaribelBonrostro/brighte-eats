export enum Service {
  Delivery = 'delivery',
  PickUp = 'pick_up',
  Payment = 'payment',
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: Service[];
  createdAt?: string;
}
