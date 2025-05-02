import { ReactElement } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./useAuth";

type PrivateRouteProps = {
  element: ReactElement;
};

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default PrivateRoute;
