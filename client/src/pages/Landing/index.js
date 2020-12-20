import { useState } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";

//CSS
import "./Landing.scss";

//Components
import Gap from "../../components/atoms/Gap";
import LandingBg from "../../assets/images/home.png";
import LandingLogo from "../../assets/images/landing-logo.png";
import { ReactComponent as VectorLeftTop } from "../../assets/images/vector-left-top.svg";
import { ReactComponent as VectorLeftBot } from "../../assets/images/vector-left-bot.svg";
import { ReactComponent as VectorRightBot } from "../../assets/images/vector-right-bot.svg";

//Config
import FormikControl from "../../config/FormikControl";
import { API, setAuthToken } from "../../config/API";

const Landing = (props) => {
  const router = useHistory();
  //Modal
  const [registerModal, setRegisterModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  //Alert
  const [alertRegister, setAlertRegister] = useState(false);
  const [alertLogin, setAlertLogin] = useState(false);
  const [successShow, setSuccessShow] = useState(false);

  //Initial State Register Formik
  const initialValuesRegister = {
    email: "",
    password: "",
    fullname: "",
  };

  //Initial State Login Formik
  const initialValuesLogin = {
    email: "",
    password: "",
  };

  //Schema validation form for register
  const validationSchemaRegister = Yup.object({
    email: Yup.string().email("Invalid email format").required("required"),
    password: Yup.string()
      .min(8, "Minimum password is 8 characters")
      .required("required"),
    fullname: Yup.string()
      .min(3, "Minimum fullname is 3 characters")
      .required("required"),
  });

  //Schema validation form for login
  const validationSchemaLogin = Yup.object({
    email: Yup.string().email("Invalid email format").required("required"),
    password: Yup.string().required("required"),
  });

  const handleSubmitRegister = async (values) => {
    try {
      const data = JSON.stringify({
        email: values.email,
        password: values.password,
        fullname: values.fullname,
        profpic:
          "https://res.cloudinary.com/satria-img/image/upload/v1606645803/satriayud/no-person-profile-pic_k3ijd5.png",
      });
      const config = { headers: { "Content-Type": "application/json" } };
      const response = await API.post("/register", data, config);
      if (response.status === 200) {
        setAlertRegister(false);
        setSuccessShow(true);
      }
    } catch (error) {
      console.log("Error Result :", error);
      setAlertRegister(true);
    }
  };

  const handleSubmitLogin = async (values) => {
    try {
      const data = JSON.stringify({
        email: values.email,
        password: values.password,
      });
      const config = { headers: { "Content-Type": "application/json" } };
      const response = await API.post("/login", data, config);

      if (response.status == 200) {
        setAlertLogin(false);
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data.data));
        console.log("login success");
        setAuthToken(response.data.data.token);
        router.push("/home");
      }
    } catch (error) {
      console.log("Error Result :", error);
      setAlertLogin(true);
    }
  };

  const toLoginShow = () => {
    setRegisterModal(false);
    setLoginModal(true);
    setAlertRegister(false);
    setSuccessShow(false);
  };

  const toRegisterShow = () => {
    setLoginModal(false);
    setRegisterModal(true);
    setAlertRegister(false);
    setSuccessShow(false);
  };

  return (
    <Container fluid>
      <Row className="btn-landing-container">
        <VectorLeftTop className="vector-left-top" />
        <VectorLeftBot className="vector-left-bot" />
        <VectorRightBot className="vector-right-bot" />
        <Col className="landing-left-container">
          <Row className="logo-left-landing">
            <img
              className="logo-left-landing-img"
              src={LandingLogo}
              alt="landing-logo"
            />
          </Row>
          <Row className="title-left-landing">
            show your work to inspire everyone
          </Row>
          <Row className="subtitle-left-landing">
            Ways Exhibition is a website design creators gather to share their
            work with other creators
          </Row>
          <Row className="btn-left-landing">
            <Button
              className="btn-reg-landing"
              variant="info"
              onClick={() => setRegisterModal(true)}
            >
              Join Now
            </Button>
            <Gap width={20} />

            <Button
              className="btn-log-landing"
              variant="light"
              onClick={() => setLoginModal(true)}
              title="Login"
            >
              Login
            </Button>
          </Row>
        </Col>
        <Col className="landing-right-container">
          <img className="landing-right-img" src={LandingBg} alt="bg" />
        </Col>
      </Row>
      <Modal
        size="lg"
        show={loginModal}
        onHide={() => setLoginModal(false)}
        centered
        dialogClassName="modal-login"
      >
        <Modal.Body className="modal-container">
          <div className="login-wrapper">
            <Formik
              initialValues={initialValuesLogin}
              validationSchema={validationSchemaLogin}
              onSubmit={(e) => handleSubmitLogin(e)}
            >
              {(formik) => {
                return (
                  <Form>
                    <p className="title-login">Login</p>
                    <FormikControl
                      className="form-input"
                      placeholder="Email"
                      control="input"
                      type="email"
                      name="email"
                    />
                    <Gap height={20} />
                    <FormikControl
                      className="form-input"
                      placeholder="Password"
                      control="input"
                      type="password"
                      name="password"
                    />
                    <Gap height={20} />
                    {alertLogin && (
                      <Alert
                        className="alert-log"
                        variant="danger"
                        onClose={() => setAlertLogin(false)}
                      >
                        Your email or password is incorrect !
                      </Alert>
                    )}

                    <Button
                      block
                      className="btn-login"
                      type="submit"
                      variant="info"
                      disabled={!formik.isValid}
                    >
                      Login
                    </Button>
                    <Gap height={29} />
                    <p className="to-register">
                      Don't have an account ? Click{" "}
                      <strong
                        onClick={toRegisterShow}
                        className="cursor-pointer"
                      >
                        Here
                      </strong>
                    </p>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        size="lg"
        show={registerModal}
        onHide={() => setRegisterModal(false)}
        centered
        dialogClassName="modal-register"
      >
        <Modal.Body className="modal-container">
          <div className="register-wrapper">
            <Formik
              initialValues={initialValuesRegister}
              validationSchema={validationSchemaRegister}
              onSubmit={(e) => handleSubmitRegister(e)}
            >
              {(formik) => {
                return (
                  <Form>
                    <p className="title-register">Register</p>
                    <FormikControl
                      className="form-input"
                      placeholder="Email"
                      control="input"
                      type="email"
                      name="email"
                    />
                    <Gap height={20} />
                    <FormikControl
                      className="form-input"
                      placeholder="Password"
                      control="input"
                      type="password"
                      name="password"
                    />
                    <Gap height={20} />
                    <FormikControl
                      className="form-input"
                      placeholder="Fullname"
                      control="input"
                      type="text"
                      name="fullname"
                    />
                    {alertRegister && (
                      <Alert
                        className="alert-log"
                        variant="danger"
                        onClose={() => setAlertRegister(false)}
                      >
                        Your email already registered
                      </Alert>
                    )}
                    {successShow && (
                      <Alert
                        className="alert-log"
                        variant="success"
                        onClose={() => setSuccessShow(false)}
                      >
                        Your account successfully registered, Please{" "}
                        <strong
                          className="cursor-pointer"
                          onClick={toLoginShow}
                        >
                          login
                        </strong>{" "}
                        to continue
                      </Alert>
                    )}
                    <Gap height={29} />
                    <Button
                      block
                      className="btn-register"
                      type="submit"
                      variant="info"
                      disabled={!formik.isValid}
                    >
                      Register
                    </Button>
                    <Gap height={29} />
                    <p className="to-login">
                      Already have an account ? Click{" "}
                      <strong onClick={toLoginShow} className="cursor-pointer">
                        Here
                      </strong>
                    </p>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Landing;
