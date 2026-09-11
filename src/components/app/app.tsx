import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import {
  Location,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients, fetchUser } from '../../services/slices';
import {
  selectIsAuthChecked,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
  selectUser
} from '../../services/selectors';
import { Preloader } from '@ui';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: Location })?.background;
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  const closeModal = () => navigate(-1);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading && !ingredients.length ? (
        <Preloader />
      ) : ingredientsError ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {ingredientsError}
        </div>
      ) : (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/feed/:number'
              element={
                <main className={styles.detailPageWrap}>
                  <OrderInfo />
                </main>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <main className={styles.detailPageWrap}>
                  <h1
                    className={`${styles.detailHeader} text text_type_main-large`}
                  >
                    Детали ингредиента
                  </h1>
                  <IngredientDetails />
                </main>
              }
            />
            <Route
              path='/login'
              element={
                <ProtectedRoute
                  onlyUnAuth
                  user={user}
                  isAuthChecked={isAuthChecked}
                >
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute
                  onlyUnAuth
                  user={user}
                  isAuthChecked={isAuthChecked}
                >
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute
                  onlyUnAuth
                  user={user}
                  isAuthChecked={isAuthChecked}
                >
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute
                  onlyUnAuth
                  user={user}
                  isAuthChecked={isAuthChecked}
                >
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute user={user} isAuthChecked={isAuthChecked}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute user={user} isAuthChecked={isAuthChecked}>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute user={user} isAuthChecked={isAuthChecked}>
                  <main className={styles.detailPageWrap}>
                    <OrderInfo />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {background && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={closeModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/feed/:number'
                element={
                  <Modal title='' onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute user={user} isAuthChecked={isAuthChecked}>
                    <Modal title='' onClose={closeModal}>
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
