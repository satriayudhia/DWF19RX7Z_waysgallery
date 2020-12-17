import { useEffect, useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//CSS
import "./HomePage.scss";

//Config
import { API, setAuthToken } from "../../config/API";
import { AppContext } from "../../config/Context";

//Component
import Header from "../../components/molecules/Header";
import { ReactComponent as ComboBox } from "../../assets/logos/combo-box.svg";
import { ReactComponent as Search } from "../../assets/logos/search.svg";

const HomePage = () => {
  //Global State
  const [state, dispatch] = useContext(AppContext);
  //Get UserInfo
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  //State
  const [posts, setPosts] = useState([{}]);

  // const getPosts = async () => {
  //   try {
  //     setAuthToken(token);
  //     const allPosts = await API.get("/posts");
  //     localStorage.setItem("posts", JSON.stringify(allPosts));
  //     const postResult = JSON.parse(localStorage.getItem("posts"));
  //     console.log("posts", postResult);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    async function getAPI() {
      let allPosts = await API.get("/posts");
      setPosts(allPosts.data.data.posts);
      console.log("posts", allPosts.data.data.posts);
      // setPosts(response.data.data.products);
    }
    getAPI();
  }, []);

  return !posts ? (
    <h1>Loading...</h1>
  ) : (
    <Container fluid>
      <Header />
      <Row className="homepage-top-wrapper">
        <Col className="homepage-left">
          <ComboBox />
        </Col>
        <Col className="homepage-right">
          <Search />
        </Col>
      </Row>
      <Row className="homepage-title">today's post</Row>
      <Row className="homepage-content-wrapper">
        {!posts ? (
          <p>loading...</p>
        ) : (
          posts.map((post) => {
            return (
              <div className="img-content-post">
                {/* <img src="" alt="post" /> */}
                <p>{post.title}</p>;
              </div>
            );
          })
        )}
      </Row>
    </Container>
  );
};

export default HomePage;
