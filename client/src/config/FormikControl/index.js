import Input from "../../components/atoms/Input";
import TextArea from "../../components/atoms/TextArea";

const FormikControl = (props) => {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "textarea":
      return <TextArea {...rest} />;
    case "select":
    case "radio":
    case "checkbox":
    case "date":
    default:
      return null;
  }
};

export default FormikControl;
