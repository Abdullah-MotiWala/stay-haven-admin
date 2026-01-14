import { notification } from "antd";

export const openNotification = (type, message) => {
    notification[type]({
      message: type[0].toUpperCase() + type.slice(1),
      description: message
    });
  };
  export const ServerError = () => {
    notification["error"]({
      message: "Error",
      description: "Something went wrong"
    });
  };
  