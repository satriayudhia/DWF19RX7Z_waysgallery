import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";

//CSS
import "./Header.scss";

//Components
import Logo from "../../../assets/logos/logo.png";
import { ReactComponent as ProfileButton } from "../../../assets/logos/profile-btn.svg";
import { ReactComponent as OrderButton } from "../../../assets/logos/order-btn.svg";
import { ReactComponent as LogoutButton } from "../../../assets/logos/logout-btn.svg";

//Config
import { API, setAuthToken } from "../../../config/API";

const Header = () => {
  const router = useHistory();
  //Get UserInfo
  const [userData, setUserData] = useState({});
  const [img, setImg] = useState("");

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  const getUser = async () => {
    try {
      setAuthToken(token);

      const userInfo = await API.get(`/user-profile/${user.id}`);
      console.log("user info", userInfo);
      setUserData(userInfo.data.user);
      setImg(userInfo.data.user.profpic);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const toHome = () => {
    router.push("/home");
  };

  const toProfile = () => {
    router.push(`/profile/${user.id}`);
    window.location.reload();
  };

  const toOrder = () => {
    router.push("/transaction");
  };

  const toLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("posts");
    router.push("/");
  };

  const toUpload = () => {
    router.push("/add-post");
  };

  return !userData ? (
    <p></p>
  ) : (
    <Container fluid>
      <Row className="header-container">
        <Col className="logo-header-login">
          <img
            src={Logo}
            alt="waysgallery"
            className="logo-header-cursor"
            onClick={toHome}
          />
        </Col>
        <Col className="profile-header">
          <Row>
            <Col className="profile-header-right">
              <Button
                variant="info"
                onClick={toUpload}
                className="btn-upload-header"
              >
                Upload
              </Button>
              <OverlayTrigger
                trigger="click"
                key="bottom"
                placement="bottom"
                overlay={
                  <Popover id={"popover-positioned-bottom"}>
                    <Popover.Content>
                      <ProfileButton
                        onClick={toProfile}
                        style={{ width: "60%", cursor: "pointer" }}
                      />
                    </Popover.Content>
                    <Popover.Content>
                      <OrderButton
                        onClick={toOrder}
                        style={{ width: "60%", cursor: "pointer" }}
                      />
                    </Popover.Content>
                    <Popover.Content>
                      <LogoutButton
                        onClick={toLogin}
                        style={{ width: "60%", cursor: "pointer" }}
                      />
                    </Popover.Content>
                  </Popover>
                }
              >
                <img src={img} className="avatar-header-login" />
                {/* <Avatar className="avatar-header" /> */}
              </OverlayTrigger>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
