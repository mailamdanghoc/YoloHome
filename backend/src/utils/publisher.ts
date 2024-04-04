import Subscriber from "./subscriber";
import IContext from "./context";

interface Publisher {
  subscribe: (sub: Subscriber) => void;
  unsubscribe: (sub: Subscriber) => void;
  notify: (context?: IContext) => void;
}

export default Publisher;
