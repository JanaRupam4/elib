import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/RegisterPage";
import { Homepage } from "@/pages/HomePage";
import AuthLayout from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import BookPage from "@/pages/BookPage";

export const router = createBrowserRouter([
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "home",
        element: <Homepage />,
      },
      {
        path: "books",
        element: <BookPage />,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
