import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../views/HomePage";
import ProductSearchPage from "../views/ProductSearchPage";

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
      }
    ]
  }
])

export default router