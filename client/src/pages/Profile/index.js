import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";

//CSS
import "./Profile.scss";

//Config
import { API, setAuthToken } from "../../config/API";

//Components
import Header from "../../components/molecules/Header";
import Jumbotron from "../../assets/images/jumbotron.png";
import Gap from "../../components/atoms/Gap";
import { ReactComponent as VectorRightProfile } from "../../assets/images/vector-right-profile.svg";

const Profile = (props) => {
  const router = useHistory();
  //Get UserInfo
  const [userData, setUserData] = useState(undefined);
  const [length, setLength] = useState(0);

  const userLogin = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  const getUser = async (userId) => {
    try {
      setAuthToken(token);
      const userInfo = await API.get(`/user-profile/${userId}`);
      setLength(userInfo.data.user.post.length - 1);
      setUserData(userInfo.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser(props.match.params.id);
  }, []);

  const handleFollow = async () => {
    try {
      const body = { following: userData.id, follower: userLogin.id };
      const config = { headers: { "Content-Type": "application/json" } };
      await API.post("/follow", body, config);
      getUser(props.match.params.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnFollow = async () => {
    try {
      const body = { following: userData.id, follower: userLogin.id };
      const config = { headers: { "Content-Type": "application/json" } };
      await API.delete("/delete-follow", { data: body }, config);
      getUser(props.match.params.id);
    } catch (error) {
      console.log(error);
    }
  };

  const toEditProfile = () => {
    router.push("/edit-profile");
  };

  const toPost = (postId) => {
    router.push(`/detail-post/${postId}`);
  };

  const toHire = (userId) => {
    router.push(`/hired/${userId}`);
  };

  return userData == undefined ? (
    <p></p>
  ) : (
    <Container fluid>
      <Header />
      <Row className="profile-container">
        <Col className="profile-left-container">
          <img src={userData.profpic} className="profile-img-left" />
          <Gap height={23} />
          <p className="profile-name-left">{userData.fullname}</p>
          {userData.greeting == null ? (
            <p className="no-greeting-yet">This user not set greeting yet</p>
          ) : (
            <p className="profile-greeting-left">{userData.greeting}</p>
          )}

          {userData.id == userLogin.id ? (
            <Button
              variant="info"
              onClick={toEditProfile}
              title="Edit Profile"
              className="btn-profile-left"
            >
              Edit Profile
            </Button>
          ) : (
            <div>
              {userData.following.find(
                (follow) => follow.following === userData.id
              ) ? (
                <Button
                  onClick={() => handleUnFollow()}
                  variant="secondary"
                  className="btn-profile-left"
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  onClick={() => handleFollow()}
                  variant="secondary"
                  className="btn-profile-left"
                >
                  Follow
                </Button>
              )}

              <Button
                onClick={() => toHire(userData.id)}
                variant="info"
                className="btn-profile-left"
              >
                Hire
              </Button>
            </div>
          )}
        </Col>
        <Col className="profile-right-container">
          <VectorRightProfile className="vector-right-profile" />
          {userData.post.length == 0 ? (
            <p className="latest-post-container">No Post Yet</p>
          ) : (
            <img
              className="latest-post-container"
              onClick={() => toPost(userData.post[length].id)}
              src={userData.post[length].photos[0].photo}
              alt="jumbotron"
            />
          )}
        </Col>
      </Row>
      <Row className="profile-mywork-head">My Work</Row>
      <Row className="profile-mywork-container">
        {userData.arts.length == 0 ? (
          <p className="no-greeting-yet">This user has no art uploaded yet</p>
        ) : (
          userData.arts.map((art) => (
            <img
              key={art.id}
              src={art.photo}
              alt="my-work"
              className="img-mywork"
            />
          ))
        )}
      </Row>
    </Container>
  );
};

export default Profile;
