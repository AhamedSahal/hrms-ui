import { BrowserRouter } from "react-router-dom";
import App from "../initialpage/App";

const Main = () => {
  return (
    <BrowserRouter basename="/"> 
      <App />
    </BrowserRouter>
  );
};

export default Main;
