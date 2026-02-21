// Responsible for guarding admin routes and redirecting unauthenticated or unauthorized users.
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
}

function isPermissionAllowed(
  permission: string | undefined,
  requiredPermission?: string,
  requiredPermissions?: string[],
): boolean {
  if (requiredPermissions) {
    return requiredPermissions.includes(permission ?? "");
  }
  if (requiredPermission) {
    return permission === requiredPermission;
  }
  return true;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredPermissions,
}: Props) {
  const { isLoggedIn, isValidating, userInfo } = useAuth();

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  if (
    !isPermissionAllowed(
      userInfo?.permission,
      requiredPermission,
      requiredPermissions,
    )
  ) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
