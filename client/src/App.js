import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Component
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import EditProfile from "./pages/EditProfile";
import ProfilePage from "./pages/ProfilePage";
import AddPostPage from "./pages/AddPostPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/edit-profile" component={EditProfile} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/add-post" component={AddPostPage} />
      </Switch>
    </Router>
  );
}

export default App;
