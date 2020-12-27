import { Modal } from "antd";

const errorMessage = (message = "Something went wrong, please try again!") =>
  Modal.error({
    title: "Error!",
    content: message,
  });

const successMessage = (message = "Submitted Successully!") =>
  Modal.success({
    title: "Success",
    content: message,
  });
function goBackOnError(goback) {
  Modal.error({
    title: "Error",
    content: "Looks like the Grievance got corrupted!",
    onOk: goback,
    onCancel: goback,
    cancelText: false,
  });
}
export { errorMessage, successMessage, goBackOnError };
