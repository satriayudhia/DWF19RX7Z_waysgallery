import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import { Image } from "cloudinary-react";
import Spinner from "react-bootstrap/Spinner";

//Config
import FormikControl from "../../config/FormikControl";
import { API, setAuthToken } from "../../config/API";

//CSS
import "./AddPost.scss";

//Components
import Header from "../../components/molecules/Header";
import Gap from "../../components/atoms/Gap";
import { ReactComponent as Cloud } from "../../assets/logos/cloud.svg";

const AddPost = () => {
  const router = useHistory();
  //Get UserInfo
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");
  //State
  const [cloudFiles, setCloudFiles] = useState([]);
  //Modal
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  //Alert
  const [alertShow, setAlertShow] = useState(false);
  //Initial State Formik
  const initialValues = {
    title: "",
    description: "",
  };

  //Schema validation form
  const validationSchema = Yup.object({
    title: Yup.string().min(3),
    description: Yup.string().min(5),
  });

  const handleSubmit = async (e) => {
    const body = { title: e.title, description: e.description };
    try {
      if (cloudFiles.length == 0) {
        setAlertShow(true);
      } else {
        setAuthToken(token);
        setAlertShow(false);
        setLoading(true);
        const resultPost = await API.post(`/add-post/${user.id}`, body);
        const postId = resultPost.data.data.post.id;

        cloudFiles.forEach(async (cloudFile) => {
          const url = await cloudFile.secure_url;

          const photos = { photo: url };
          const saveToDb = await API.post(`/photo/${postId}`, photos);

          console.log("saveToDb", saveToDb);
        });
        setLoading(false);
        setModalShow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    acceptedFiles.forEach(async (acceptedFile) => {
      setLoading(true);
      const body = new FormData();
      body.append("file", acceptedFile);
      body.append("upload_preset", "satriayud");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/satria-img/image/upload",
        {
          method: "post",
          body,
        }
      );
      const data = await response.json();

      setCloudFiles((old) => [...old, data]);
      setLoading(false);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accepts: "image/*",
    maxFiles: 5,
  });

  const setRefresh = () => {
    setModalShow(false);
    window.location.reload();
  };

  const toHomePage = () => {
    setModalShow(false);
    router.push("/home");
  };

  return (
    <Container fluid>
      <Header />
      <Row className="addpost-container">
        <Col className="addpost-left-container">
          <Row className="addpost-image-upload">
            {isLoading ? (
              <div className="dropzone">
                <Spinner animation="border" variant="info" />
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? "active" : null}`}
              >
                <input {...getInputProps()} />
                <div className="add-post-upload">
                  <Cloud />
                  <p className="add-post-browse">
                    <strong className="browse">Browse</strong>&nbsp; to choose
                    file
                  </p>
                </div>
              </div>
            )}
          </Row>
          <Gap height={20} />
          <Row className="add-post-bottom-container">
            {isLoading ? (
              <div className="add-post-preview-image">
                <Spinner animation="border" variant="info" />
              </div>
            ) : (
              <div className="add-post-preview-image">
                {cloudFiles.map((file) => (
                  <Image
                    key={file.public_id}
                    className="add-post-img"
                    cloudName="satria-img"
                    publicId={file.public_id}
                    width="150"
                    crop="scale"
                  />
                ))}
              </div>
            )}
          </Row>
        </Col>
        <Col className="addpost-right-container">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(e) => handleSubmit(e)}
          >
            {(formik) => {
              return (
                <Form>
                  <Gap height={30} />
                  <FormikControl
                    className="form-input"
                    placeholder="Title"
                    control="input"
                    type="text"
                    name="title"
                  />
                  <Gap height={20} />
                  <FormikControl
                    className="form-textarea"
                    placeholder="Description"
                    control="textarea"
                    type="text"
                    name="description"
                  />
                  <Gap height={20} />
                  {alertShow && (
                    <Alert
                      className="alert-add-post"
                      variant="warning"
                      onClose={() => setAlertShow(false)}
                    >
                      Please upload your post's photo
                    </Alert>
                  )}
                  <div className="button-addpost-container">
                    <Button block variant="secondary" disabled={isLoading}>
                      Cancel
                    </Button>
                    <Gap width={20} />
                    <Button
                      block
                      variant="info"
                      type="submit"
                      disabled={!formik.isValid || isLoading}
                    >
                      {isLoading ? "Loading…" : "Post"}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Col>
      </Row>

      <Modal
        show={modalShow}
        onHide={() => setRefresh()}
        centered
        transparent={true}
      >
        <Modal.Header closeButton>
          <Modal.Title className="title-dialog">
            Post Successfully Added
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="confirms">Go to Home Page ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setRefresh()}
            className="btn-modal-ok-tohomepage"
          >
            Cancel
          </Button>
          <Button
            variant="info"
            onClick={() => toHomePage()}
            className="btn-modal-ok-tohomepage"
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddPost;
