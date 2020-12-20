import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

//CSS
import "./ViewProject.scss";

//Config
import { API, setAuthToken } from "../../config/API";

//Components
import Header from "../../components/molecules/Header";

const ViewProject = (props) => {
  //State
  const [transactionData, setTransactionData] = useState(undefined);
  const [indexCarousel, setIndexCarousel] = useState(0);
  const [dataTransaction, setDataTransaction] = useState(undefined);
  const [selectImage, setSelectImage] = useState("");

  //Modal
  const [modalShow, setModalShow] = useState(false);

  const userLogin = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  const transactionId = props.match.params.id;

  const getProject = async () => {
    try {
      setAuthToken(token);
      const projectInfo = await API.get(`/project/${transactionId}`);
      setTransactionData(projectInfo.data.data.project);

      const transactionOrder = await API.get(
        `/transactions-order-project/${transactionId}`
      );
      setDataTransaction(transactionOrder.data.data.transactions[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProject();
  }, []);

  const handleSelect = (selectedIndex, e) => {
    setIndexCarousel(selectedIndex);
  };

  const handleAccept = async () => {
    const body = { status: "completed" };
    await API.patch(`/transaction/${transactionId}`, body);
    getProject();
  };

  const previewImage = (image) => {
    setModalShow(true);
    setSelectImage(image);
  };

  const download = () => {
    let element = document.createElement("a");
    let file = new Blob([selectImage], { type: "image/*" });
    element.href = URL.createObjectURL(file);
    element.download = "project.jpg";
    element.click();
  };

  return transactionData == undefined || dataTransaction == undefined ? (
    <p>Loading...</p>
  ) : (
    <Container fluid>
      <Header />
      <Row>
        <Col className="view-project-left-container">
          <Row className="view-project-carousel-container">
            <Carousel activeIndex={indexCarousel} onSelect={handleSelect}>
              {transactionData[0].images.map((image) => (
                <Carousel.Item>
                  <img
                    className="d-block"
                    src={image.photo}
                    alt="First slide"
                    onClick={() => previewImage(image.photo)}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Row>

          <Row>
            {transactionData[0].images.map((image, index) => (
              <img
                onClick={() => setIndexCarousel(index)}
                className="view-project-img-list"
                src={image.photo}
                alt="images-list"
                style={{
                  border: indexCarousel == index && "3px solid #15a3b9",
                }}
              />
            ))}
          </Row>
        </Col>
        <Col className="view-project-right-container">
          <Row>{transactionData[0].description}</Row>
          <Row>
            {dataTransaction.orderBy === userLogin.id &&
            dataTransaction.status === "waiting approved project" ? (
              <Button
                onClick={() => handleAccept()}
                className="view-project-btn-accept"
                variant="info"
              >
                Accept Project
              </Button>
            ) : null}
          </Row>
        </Col>
      </Row>

      <Modal
        size="lg"
        show={modalShow}
        onHide={() => setModalShow(false)}
        centered
        transparent={true}
        dialogClassName="transactions-modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img
            className="modal-preview-image"
            src={selectImage}
            alt="img-preview"
          />
        </Modal.Body>
        <Modal.Footer className="footer-view-project">
          <Button onClick={() => download()} variant="success">
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewProject;
