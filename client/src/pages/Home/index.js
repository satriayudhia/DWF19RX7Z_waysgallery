import { useEffect, useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { Formik, Form } from "formik";

//CSS
import "./Home.scss";

//Config
import { API, setAuthToken } from "../../config/API";
import { AppContext } from "../../config/Context";
import FormikControl from "../../config/FormikControl";

//Component
import Header from "../../components/molecules/Header";
import { ReactComponent as ComboBox } from "../../assets/logos/combo-box.svg";
import { ReactComponent as Search } from "../../assets/logos/search.svg";
import Content from "../../components/molecules/Content";
import Gap from "../../components/atoms/Gap";

const Home = () => {
  //Global State
  const [state, dispatch] = useContext(AppContext);
  //Get UserInfo
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  //State
  const [posts, setPosts] = useState([{}]);
  const [searchValue, setSearchValue] = useState("");

  //Initial State Formik
  const initialValues = {
    Search: "",
  };

  const getPosts = async () => {
    try {
      setAuthToken(token);
      const allPosts = await API.get("/posts");
      setPosts(allPosts.data.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleSearch = (e) => {
    setSearchValue(e.search);
  };

  return !posts ? (
    <h1>Loading...</h1>
  ) : (
    <Container fluid>
      <Header />
      <Row className="homepage-top-wrapper">
        <Col className="homepage-left">
          <Dropdown variant="secondary">
            <Dropdown.Toggle className="homepage-dropdown-container">
              Today
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>Following</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col className="homepage-right">
          <Formik
            initialValues={initialValues}
            onSubmit={(e) => handleSearch(e)}
          >
            {(formik) => {
              return (
                <Form>
                  <div className="homepage-search-container">
                    <FormikControl
                      className="search-input"
                      placeholder="Search"
                      control="input"
                      type="text"
                      name="search"
                    />
                    <Search className="search-logo" />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Col>
      </Row>
      <Row className="homepage-title">
        {searchValue === "" ? "Today's Post" : "Search Result"}
      </Row>
      <Row className="homepage-content-wrapper">
        <Content search={searchValue} />
      </Row>
    </Container>
  );
};

export default Home;
