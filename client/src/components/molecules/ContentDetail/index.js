import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//CSS
import "./ContentDetail.scss";

//Components
import Gap from "../../atoms/Gap";

const ContentDetail = (props) => {
  const [listPhotos, setListPhotos] = useState([]);
  const [selectedImg, setSelectedImg] = useState(props.photo[0].photo);

  const getListPhotos = () => {
    const get = props.photo.map((photo) =>
      setListPhotos((old) => [...old, photo.photo])
    );
  };

  useEffect(() => {
    getListPhotos();
  }, []);

  return (
    <Container fluid>
      <Row className="content-detail-top-container">
        <div className="img-big-container">
          <img
            className="content-detail-img-selected"
            src={selectedImg}
            alt="selected-picture"
          />
        </div>
      </Row>
      <Row className="content-detail-list-container">
        {listPhotos.map((photo, index) => (
          <div key={index} className="content-detail-list-img">
            <img
              onClick={() => setSelectedImg(photo)}
              className="content-detail-img"
              src={photo}
              alt="img-post"
              style={{
                border: selectedImg === photo ? "4px solid #15a3b9" : "",
              }}
            />
          </div>
        ))}
      </Row>
      <Gap height={28} />
      <Row className="content-detail-title-container">
        Say Hello &nbsp; <span className="email-blue">{props.User.email}</span>
      </Row>
      <Gap height={18} />
      <Row className="content-detail-desc-container">{props.description}</Row>
    </Container>
  );
};

export default ContentDetail;
