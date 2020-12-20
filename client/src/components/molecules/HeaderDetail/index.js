import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

//CSS
import "./HeaderDetail.scss";

//Config
import { API, setAuthToken } from "../../../config/API";

//Components
import Gap from "../../atoms/Gap";

const HeaderDetail = (props) => {
  console.log("nilai props", props);

  const [userData, setUserData] = useState(undefined);

  const router = useHistory();
  const userLogin = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  const toHiredPage = (userId) => {
    router.push(`/hired/${userId}`);
  };

  const toProfile = (userId) => {
    router.push(`/profile/${userId}`);
  };

  useEffect(() => {
    getUser(props.User.id);
  }, []);

  const getUser = async (userId) => {
    try {
      setAuthToken(token);
      const userInfo = await API.get(`/user-profile/${userId}`);
      setUserData(userInfo.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async () => {
    try {
      setAuthToken(token);
      const body = { following: props.User.id, follower: userLogin.id };
      const config = { headers: { "Content-Type": "application/json" } };
      await API.post("/follow", body, config);
      getUser(props.User.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnFollow = async () => {
    try {
      const body = { following: userData.id, follower: userLogin.id };
      const config = { headers: { "Content-Type": "application/json" } };
      await API.delete("/delete-follow", { data: body }, config);
      getUser(props.User.id);
    } catch (error) {
      console.log(error);
    }
  };

  return userData == undefined ? (
    <p>loading</p>
  ) : (
    <Container fluid>
      <Row className="header-detail-container">
        <Col sm={5} className="header-detail-left">
          <div className="header-detail-avatar-container">
            <img
              onClick={() => toProfile(props.User.id)}
              className="header-detail-avatar"
              src={props.User.profpic}
              alt="avatar"
            />
          </div>
          <div className="header-detail-title">
            <p className="header-detail-top-title">{props.title}</p>
            <p className="header-detail-name">{props.User.fullname}</p>
          </div>
        </Col>

        {props.User.id != userLogin.id ? (
          <Col sm={2} className="header-detail-right">
            {userData.following.find(
              (follow) => follow.following === userData.id
            ) ? (
              <Button
                onClick={() => handleUnFollow()}
                className="btn-follow"
                variant="secondary"
              >
                Unfollow
              </Button>
            ) : (
              <Button
                onClick={() => handleFollow()}
                className="btn-follow"
                variant="secondary"
              >
                Follow
              </Button>
            )}
            <Gap width={24} />
            <Button
              onClick={() => toHiredPage(props.User.id)}
              className="btn-hire"
              variant="info"
            >
              Hire
            </Button>
          </Col>
        ) : null}
      </Row>
      <Gap height={24} />
    </Container>
  );
};

export default HeaderDetail;
