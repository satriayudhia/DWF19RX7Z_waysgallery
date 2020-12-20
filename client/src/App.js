import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Component
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
import AddPost from "./pages/AddPost";
import DetailPost from "./pages/DetailPost";
import Hired from "./pages/Hired";
import Transaction from "./pages/Transaction";
import AddProject from "./pages/AddProject";
import ViewProject from "./pages/ViewProject";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/edit-profile" component={EditProfile} />
        <Route exact path="/profile/:id" component={Profile} />
        <Route exact path="/add-post" component={AddPost} />
        <Route exact path="/detail-post/:id" component={DetailPost} />
        <Route exact path="/hired/:userId" component={Hired} />
        <Route exact path="/transaction" component={Transaction} />
        <Route exact path="/add-project/:id" component={AddProject} />
        <Route exact path="/view-project/:id" component={ViewProject} />
      </Switch>
    </Router>
  );
}

export default App;
