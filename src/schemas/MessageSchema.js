import * as Yup from "yup";

const MessageSchema = [
  {
    key: "1",
    label: "Subject",
    name: "subject",
    validationSchema: Yup.string()
      .required("Subject is Required")
      .max(50, "Subject must be less than 50 characters")
      .min(5, "Subject must be greater than 5 characters"),
    initialValue: "",
  },
  {
    key: "2",
    label: "Message",
    name: "message",
    multiline: true,
    rows: 4,
    validationSchema: Yup.string()
      .required("Message is Required")
      .max(350, "Message must be less than 350 characters")
      .min(5, "Message must be greater than 5 characters"),
    initialValue: "",
  },
];
export default MessageSchema;
