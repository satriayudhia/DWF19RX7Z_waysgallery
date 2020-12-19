import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

//CSS
import "./HeaderDetail.scss";

//Components
import Gap from "../../atoms/Gap";

const HeaderDetail = (props) => {
  const router = useHistory();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const toHiredPage = (userId) => {
    router.push(`/hired/${userId}`);
  };

  const toProfile = (userId) => {
    router.push(`/profile/${userId}`);
  };

  return (
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

        {props.User.id != user.id ? (
          <Col sm={2} className="header-detail-right">
            <Button className="btn-follow" variant="secondary">
              Follow
            </Button>
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
