import { Static, Type } from "@sinclair/typebox";

export const CartRequestSchema = Type.Object({
  productId: Type.Integer(),
  qty: Type.Integer(),
});

export type CartRequestInput = Static<typeof CartRequestSchema>;

export const CartEditRequestSchema = Type.Object({
  id: Type.Integer(),
  qty: Type.Integer(),
});

export type CartEditRequestInput = Static<typeof CartEditRequestSchema>;

// Вспомогательный тип
type CartLineItem = {
  id: number;
  productId: number;
  itemName: string;
  price: string;
  qty: number;
  variant: string | null;
  createdAt: Date;
  updatedAt: Date;
  availability?: number;
};

//Экспортируемый интерфейс
export interface CartWithLineItems {
  id: number;
  customerId: number;
  lineItems: CartLineItem[];
  createdAt: Date;
  updatedAt: Date;
}
