import React, { useState, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import { Image } from "cloudinary-react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

//CSS
import "./EditProfile.scss";

//Config
import { API, setAuthToken } from "../../config/API";
import FormikControl from "../../config/FormikControl";

//Components
import Header from "../../components/molecules/Header";
import Gap from "../../components/atoms/Gap";
import { ReactComponent as Camera } from "../../assets/logos/camera.svg";
import Loading from "../../components/atoms/Loading";

const EditProfile = () => {
  //Get UserInfo
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");
  //State
  const [profpic, setProfpic] = useState(undefined);
  const [art, setArt] = useState({});
  const [previewProfpic, setPreviewProfpic] = useState("");
  const [previewArt, setPreviewArt] = useState("");
  const [files, setFiles] = useState([]);
  const [cloudFiles, setCloudFiles] = useState([]);
  //Modal
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setLoading] = useState(false);

  //Initial State Formik
  const initialValues = {
    fullname: "",
    greeting: "",
  };

  //Schema validation form
  const validationSchema = Yup.object({
    fullname: Yup.string(),
    greeting: Yup.string(),
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    acceptedFiles.forEach(async (acceptedFile) => {
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
      const url = await data.secure_url;
      setCloudFiles((old) => [...old, data]);

      const arts = { photo: url };
      const saveToDb = await API.post(`/arts/${user.id}`, arts);

      console.log("saveToDb", saveToDb);
      console.log("Data", data);
      console.log("Cloudfiles", cloudFiles);
    });
  }, []);

  const handleFileUploadProfpic = async (e) => {
    setProfpic(e.target.files[0]);
    setPreviewProfpic(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    try {
      console.log("PROFPIC", profpic);

      if (profpic == undefined) {
        setLoading(true);
        const editUser = { greeting: e.greeting, fullname: e.fullname };
        await API.patch(`/user/${user.id}`, editUser);
        setStatus();
      } else if (profpic) {
        setLoading(true);
        const body = new FormData();
        body.append("file", profpic);
        body.append("upload_preset", "satriayud");
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/satria-img/image/upload",
          {
            method: "post",
            body,
          }
        );

        const data = await response.json();
        const url = await data.secure_url;

        const editUser = {
          greeting: e.greeting,
          fullname: e.fullname,
          profpic: url,
        };
        await API.patch(`/user/${user.id}`, editUser);
        setStatus();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setRefresh = () => {
    setModalShow(false);
    window.location.reload();
  };

  const setStatus = () => {
    setLoading(false);
    setModalShow(true);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accepts: "image/*",
  });

  return (
    <Container fluid>
      <Header />
      <Row className="edit-profile-container">
        <Col className="edit-profile-img-preview">
          <Row className="edit-profile-art-upload">
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "active" : null}`}
            >
              <input {...getInputProps()} />
              <p className="edit-best-upload">
                <strong className="edit-blue-upload">Upload</strong> Best Your
                Art
              </p>
            </div>
          </Row>
          <Row className="edit-profile-art-preview">
            {cloudFiles.map((file) => (
              <div className="edit-profile-preview-image" key={file.public_id}>
                <Image
                  className="edit-profile-preview-image-bottom"
                  cloudName="satria-img"
                  publicId={file.public_id}
                  width="150"
                  crop="scale"
                />
              </div>
            ))}
          </Row>
        </Col>
        <Col className="edit-profile-form-container">
          <Row className="edit-profile-upload-container">
            <label for="profpic" className="attach-profpic">
              {!previewProfpic ? (
                <div className="circle">
                  <Camera className="camera" />
                </div>
              ) : (
                <img
                  className="img-preview-profile"
                  src={previewProfpic}
                  alt="image preview"
                />
              )}
            </label>
          </Row>
          <Row className="edit-profile-input-container">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(e) => handleSubmit(e)}
            >
              {(formik) => {
                return (
                  <Form>
                    <Gap height={40} />
                    <FormikControl
                      className="form-input"
                      placeholder="Greeting"
                      control="input"
                      type="text"
                      name="greeting"
                    />
                    <Gap height={20} />
                    <FormikControl
                      className="form-input"
                      placeholder="Full Name"
                      control="input"
                      type="text"
                      name="fullname"
                    />
                    <Gap height={20} />
                    <input
                      id="profpic"
                      name="profpic"
                      accept="image/*"
                      type="file"
                      onChange={handleFileUploadProfpic}
                      style={{ display: "none" }}
                    />
                    <Gap height={20} />
                    <Button
                      block
                      variant="info"
                      className="btn-save"
                      disabled={isLoading || !formik.isValid}
                      onClick={!isLoading ? handleSubmit : null}
                    >
                      {isLoading ? "Loading…" : "Save"}
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </Row>
        </Col>
      </Row>

      <Modal
        size="sm"
        show={modalShow}
        onHide={() => setRefresh()}
        centered
        transparent={true}
      >
        <Modal.Body className="modal-body">
          <h2 className="modal-confirms">Successfully Changed</h2>
          <Button
            variant="info"
            onClick={() => setRefresh()}
            className="btn-modal-ok"
          >
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EditProfile;