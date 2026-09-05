import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  forgotPasswordApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  if (!getCookie('accessToken')) return null;
  const response = await getUserApi();
  return response.user;
});

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  (email: string) => forgotPasswordApi({ email })
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, startRequest)
      .addCase(registerUser.fulfilled, finishAuthRequest)
      .addCase(registerUser.rejected, failRequest)
      .addCase(loginUser.pending, startRequest)
      .addCase(loginUser.fulfilled, finishAuthRequest)
      .addCase(loginUser.rejected, failRequest)
      .addCase(requestPasswordReset.pending, startRequest)
      .addCase(requestPasswordReset.fulfilled, finishRequest)
      .addCase(requestPasswordReset.rejected, failRequest)
      .addCase(resetPassword.pending, startRequest)
      .addCase(resetPassword.fulfilled, finishRequest)
      .addCase(resetPassword.rejected, failRequest)
      .addCase(updateUser.pending, startRequest)
      .addCase(updateUser.fulfilled, finishAuthRequest)
      .addCase(updateUser.rejected, failRequest)
      .addCase(logoutUser.pending, startRequest)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, failRequest);
  }
});

function startRequest(state: TAuthState) {
  state.isLoading = true;
  state.error = null;
}

function finishAuthRequest(state: TAuthState, action: { payload: TUser }) {
  state.isLoading = false;
  state.user = action.payload;
  state.isAuthChecked = true;
}

function finishRequest(state: TAuthState) {
  state.isLoading = false;
}

function failRequest(
  state: TAuthState,
  action: { error: { message?: string } }
) {
  state.isLoading = false;
  state.error = action.error.message || 'Ошибка авторизации';
  state.isAuthChecked = true;
}

export const authReducer = authSlice.reducer;
