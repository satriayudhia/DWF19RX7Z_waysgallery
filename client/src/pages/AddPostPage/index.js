import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Formik, Form } from "formik";
import * as Yup from "yup";

//Config
import FormikControl from "../../config/FormikControl";
import { API, setAuthToken } from "../../config/API";

//CSS
import "./AddPost.scss";

//Components
import Header from "../../components/molecules/Header";
import Dropzone from "../../components/atoms/Dropzone";
import Gap from "../../components/atoms/Gap";
import Button from "../../components/atoms/Button";

const AddPostPage = () => {
  //Get UserInfo
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");
  //Initial State Formik
  const initialValues = {
    title: "",
    description: "",
  };

  //Schema validation form
  const validationSchema = Yup.object({
    title: Yup.string(),
    description: Yup.string(),
  });

  const handleSubmit = async (e) => {
    const config = { headers: { "Content-Type": "application/json" } };
    const body = JSON.stringify({
      title: e.title,
      description: e.description,
    });
    setAuthToken(token);
    try {
      await API.post(`/add-post/${user.id}`, body, config);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container fluid>
      <Header />
      <Row className="addpost-container">
        <Col className="addpost-left-container">
          <Dropzone />
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
                  <div className="button-addpost-container">
                    <Button title="Cancel" type="submit" />
                    <Gap width={20} />
                    <Button
                      title="Post"
                      type="submit"
                      disabled={!formik.isValid}
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default AddPostPage;
