import { Route } from "react-router-dom";
import MainLayout from "./layouts/main";
import Home from "./views/home";

const App = () => {
  return (
    <MainLayout>
      <Route path="/" exact component={Home} />
    </MainLayout>
  );
};

export default App;
