import { Route } from "react-router-dom";
import Home from "./views/home";

const App = () => {
  return (
    <>
      <Route path="/" exact component={Home} />
    </>
  );
};

export default App;
