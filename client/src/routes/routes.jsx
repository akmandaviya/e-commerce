import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../views/HomePage";
import ProductSearchPage from "../views/ProductSearchPage";
import Login from "../views/Login";
import UserRegister from "../views/UserRegister";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "",
        element: <HomePage/>
      },
      {
        path: "/product-search",
        element: <ProductSearchPage/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/register-user",
        element: <UserRegister/>
      }
    ]
  }
])

export default router