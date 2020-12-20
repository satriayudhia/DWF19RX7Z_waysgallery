import { useState } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik, Form } from "formik";
import * as Yup from "yup";

//CSS
import "./Hired.scss";

//Config
import FormikControl from "../../config/FormikControl";
import { API, setAuthToken } from "../../config/API";

//Components
import Header from "../../components/molecules/Header";
import Gap from "../../components/atoms/Gap";

const Hired = (props) => {
  const router = useHistory();
  //Get UserInfo
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  //Modal
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setLoading] = useState(false);

  //Initial State Formik
  const initialValues = {
    title: "",
    description: "",
    startDate: null,
    endDate: null,
    price: "",
  };

  //Schema validation form
  const validationSchema = Yup.object({
    title: Yup.string().min(3).required("required"),
    description: Yup.string().min(5).required("required"),
    startDate: Yup.date().required("required").nullable(),
    endDate: Yup.date().required("required").nullable(),
    price: Yup.number().required("required"),
  });

  const handleSubmit = async (e) => {
    const userId = props.match.params.userId;
    const body = {
      title: e.title,
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate,
      price: e.price,
      orderBy: user.id,
      orderTo: userId,
      status: "waiting approval",
    };
    try {
      setAuthToken(token);
      setLoading(true);
      const saveToDb = await API.post("/transaction", body);
      console.log("save to db status", saveToDb);
      setLoading(false);
      setModalShow(true);
      await timeout(3000);
      router.push("/transaction");
    } catch (error) {
      console.log(error);
    }
  };

  const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return (
    <Container fluid>
      <Header />
      <Row className="hired-page-container">
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
                  placeholder="Description Job"
                  control="textarea"
                  type="text"
                  name="description"
                />
                <Gap height={20} />

                <div className="date-container">
                  <div className="date-inside-container">
                    <label for="endDate">Start Date</label>
                    <FormikControl
                      className="date-class"
                      control="date"
                      name="startDate"
                    />
                  </div>
                  <Gap width={15} />
                  <div className="date-inside-container">
                    <label for="endDate">End Date</label>
                    <FormikControl
                      className="date-class"
                      control="date"
                      name="endDate"
                    />
                  </div>
                </div>

                <Gap height={20} />
                <FormikControl
                  className="form-input"
                  placeholder="Price"
                  control="input"
                  type="number"
                  name="price"
                />

                <Gap height={20} />
                <div className="button-hired-container">
                  <Button block variant="secondary" disabled={isLoading}>
                    Cancel
                  </Button>
                  <Gap width={20} />
                  <Button
                    block
                    variant="info"
                    type="submit"
                    disabled={isLoading || !formik.isValid}
                  >
                    {isLoading ? "Loading…" : "Bidding"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Row>

      <Modal
        size="lg"
        show={modalShow}
        onHide={() => setModalShow(false)}
        centered
        transparent={true}
      >
        <Modal.Body>
          <p className="modal-text">
            We have sent your offer, please wait for the user to accept it
          </p>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Hired;
