import Input from "../../components/atoms/Input";
import TextArea from "../../components/atoms/TextArea";
import DatePicker from "../../components/atoms/DatePicker";

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
      return <DatePicker {...rest} />;
    default:
      return null;
  }
};

export default FormikControl;
