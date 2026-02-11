import { staticNotify } from "../App";

export const openNotification = (type, message) => {
    staticNotify[type]({
      message: type[0].toUpperCase() + type.slice(1),
      description: message
    });
  };
  export const ServerError = () => {
    staticNotify["error"]({
      message: "Error",
      description: "Something went wrong"
    });
  };
  