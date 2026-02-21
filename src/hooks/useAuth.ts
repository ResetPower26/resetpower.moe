// Responsible for managing authentication state across the app.
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  authenticate,
  getToken,
  removeToken,
  saveToken,
  type UserInfo,
  validateToken,
} from "../services/auth";

interface AuthState {
  isLoggedIn: boolean;
  isValidating: boolean;
  userInfo: UserInfo | null;
}

export function useAuth() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    isValidating: true,
    userInfo: null,
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setState({ isLoggedIn: false, isValidating: false, userInfo: null });
      return;
    }
    validateToken(token).then((result) => {
      if (result.valid) {
        setState({
          isLoggedIn: true,
          isValidating: false,
          userInfo: {
            username: result.username,
            permission: result.permission,
          },
        });
      } else {
        removeToken();
        setState({ isLoggedIn: false, isValidating: false, userInfo: null });
      }
    });
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<string | null> => {
      const result = await authenticate(username, password);
      if ("error" in result) return result.error;

      saveToken(result.token);
      const validation = await validateToken(result.token);
      if (!validation.valid) return "登录验证失败";

      setState({
        isLoggedIn: true,
        isValidating: false,
        userInfo: {
          username: validation.username,
          permission: validation.permission,
        },
      });
      navigate("/admin");
      return null;
    },
    [navigate],
  );

  const logout = useCallback(() => {
    removeToken();
    setState({ isLoggedIn: false, isValidating: false, userInfo: null });
    navigate("/admin/login");
  }, [navigate]);

  return { ...state, login, logout };
}
