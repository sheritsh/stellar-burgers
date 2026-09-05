import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeed,
  selectIngredients,
  selectSelectedOrder,
  selectUserOrders
} from '../../services/selectors';
import { fetchOrderByNumber } from '../../services/slices';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeed).orders;
  const userOrders = useSelector(selectUserOrders);
  const selectedOrder = useSelector(selectSelectedOrder);
  const orderNumber = Number(number);
  const orderData =
    [...feedOrders, ...userOrders].find(
      (order) => order.number === orderNumber
    ) || (selectedOrder?.number === orderNumber ? selectedOrder : null);

  useEffect(() => {
    if (Number.isFinite(orderNumber) && !orderData) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
