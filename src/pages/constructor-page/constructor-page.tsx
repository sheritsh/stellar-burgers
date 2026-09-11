import { useSelector } from '../../services/store';

import { ConstructorPageUI } from '@ui-pages';
import { FC } from 'react';
import { selectIngredientsLoading } from '../../services/selectors';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
