import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//CSS
import "./DetailPost.scss";

//Config
import { API, setAuthToken } from "../../config/API";

//Components
import Header from "../../components/molecules/Header";
import HeaderDetail from "../../components/molecules/HeaderDetail";
import ContentDetail from "../../components/molecules/ContentDetail";

const DetailPost = (props) => {
  //Get UserInfo
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  //State
  const [post, setPost] = useState(undefined);
  const [avatar, setAvatar] = useState("");

  const getDetailPost = async () => {
    const id = props.match.params.id;

    try {
      setAuthToken(token);
      const detailPost = await API.get(`/post/${id}`);
      setPost(detailPost.data.data.post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetailPost();
  }, []);

  return post == undefined ? (
    <h1></h1>
  ) : (
    <Container fluid>
      <Header />
      <Row>
        {post && (
          <HeaderDetail
            key={post.id}
            id={post.id}
            User={post.User}
            title={post.title}
          />
        )}
      </Row>
      <Row>
        {post && (
          <ContentDetail
            key={post.id}
            id={post.id}
            User={post.User}
            title={post.title}
            description={post.description}
            photo={post.photos}
          />
        )}
      </Row>
    </Container>
  );
};

export default DetailPost;
