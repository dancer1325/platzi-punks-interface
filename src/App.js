import { Route } from "react-router-dom";
import MainLayout from "./layouts/main";
import Home from "./views/home";
import Punks from "./views/punks";

const App = () => {
  return (
    <MainLayout>
      <Route path="/" exact component={Home} />
      <Route path="/punks" exact component={Punks} />
    </MainLayout>
  );
};

export default App;
