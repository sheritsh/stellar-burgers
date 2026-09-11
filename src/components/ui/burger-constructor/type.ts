import { TBurgerConstructorState } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: TBurgerConstructorState;
  orderRequest: boolean;
  price: number;
  orderModalData: { number: number } | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
