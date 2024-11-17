//types.tsx
export enum OrderType {
  Wonton = "wonton",
  Dip = "dip",
  Drink = "drink",
}

//types till mina objekt i wonton menyn
export type MenuItems = {
  id: number;
  type: string;
  name: string;
  description: string;
  price: number;
  ingredients: string[];
};

//types till mina objekt i dipsås menyn
export type Dip = {
  id: number;
  type: string;
  name: string;
  description: string;
  price: number;
};

//types till mina objekt i drick menyn
export type Drink = {
  id: number;
  type: OrderType.Drink;
  name: string;
  description: string;
  price: number;
};

export enum OrderState {
  Waiting = "waiting",
  Processing = "processing",
  Done = "done",
}

export type Order = {
  id: string;
  items: string[];
  orderValue: number;
  eta: number;
  timestamp: number;
  state: OrderState;
};

//types till mina objekt i varukorgen
export type CartItems = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type Receipt = {
  id: string;
  orderValue: number;
  timestamp: string;
  items: CartItems[];
};

export type OrderBody = {
  items: number[]; //
};
