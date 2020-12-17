import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//CSS
import "./ProfilePage.scss";

//Config
import { API, setAuthToken } from "../../config/API";

//Components
import Header from "../../components/molecules/Header";
import Button from "../../components/atoms/Button";
import Jumbotron from "../../assets/images/jumbotron.png";

const ProfilePage = () => {
  const router = useHistory();
  //Get UserInfo
  const [userData, setUserData] = useState({});
  const [img, setImg] = useState("");
  const [arts, setArts] = useState([{}]);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  const getUser = async () => {
    try {
      setAuthToken(token);
      const userInfo = await API.get(`/user/${user.id}`);
      console.log("user Info", userInfo.data.user.arts);
      setUserData(userInfo.data.user);
      setImg(userInfo.data.user.profpic);
      setArts(userInfo.data.user.arts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const toEditProfile = () => {
    router.push("/edit-profile");
  };

  return !arts ? (
    <p>loading</p>
  ) : (
    <Container fluid>
      <Header />
      <Row className="profile-container">
        <Col className="profile-left-container">
          <img
            src={`http://localhost:5001/uploads/${img}`}
            className="profile-img-left"
          />
          <p className="profile-name-left">Satria Yudhia Putra</p>
          <p className="profile-greeting-left">Welcome To My Art</p>
          <Button
            onClick={toEditProfile}
            title="Edit Profile"
            className="btn-profile-left"
          />
        </Col>
        <Col className="profile-right-container">
          <img src={Jumbotron} alt="jumbotron" />
        </Col>
      </Row>
      <Row className="profile-mywork-container">
        {arts.map((art) => (
          <img
            key={art.id}
            src={`http://localhost:5001/uploads/${art.photo}`}
            alt="my-work"
            className="img-mywork"
          />
        ))}
      </Row>
    </Container>
  );
};

export default ProfilePage;
