import { enableMapSet } from "immer";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routes";

function App() {
  enableMapSet();

  return <RouterProvider router={router} />;
}

export default App;
