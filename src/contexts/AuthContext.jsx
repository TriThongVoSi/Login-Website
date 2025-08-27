/**
 * AuthContext - Quản lý trạng thái authentication trong ứng dụng
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getAuthToken, getMyInfo } from '../services/authService';

// Initial state
const initialState = {
  user: null,
  token: null,
  roles: [],
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS', 
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESTORE_SESSION: 'RESTORE_SESSION'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        roles: action.payload.roles || [],
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
      
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        roles: [],
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };
      
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        roles: action.payload.roles || [],
        isAuthenticated: true,
        isLoading: false
      };
      
    default:
      return state;
  }
};

// Context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session from localStorage on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = getAuthToken();
        if (savedToken) {
          const userInfo = await getMyInfo();
          const storedUser = localStorage.getItem('qlmv_user');
          const parsed = storedUser ? JSON.parse(storedUser) : { username: userInfo?.username, roles: userInfo?.roles || [] };
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: { user: { username: parsed.username }, token: savedToken, roles: parsed.roles }
          });
          return;
        }
      } catch (error) {
        // Token invalid, remove from storage
        localStorage.removeItem('qlmv_token');
        localStorage.removeItem('qlmv_user');
      }
      
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    };

    restoreSession();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await apiLogin(email, password);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: { username: response.username }, token: response.token, roles: response.roles || [] }
      });
      
      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('qlmv_token');
      localStorage.removeItem('qlmv_user');
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    if (!state.isAuthenticated) return false;
    const upperRoles = (state.roles || []).map(r => String(r).toUpperCase());
    return upperRoles.includes(String(requiredRole).toUpperCase());
  };

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    roles: state.roles,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    logout,
    clearError,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
