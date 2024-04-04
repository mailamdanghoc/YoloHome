import IContext from "./context";

interface Subscriber {
  name: string;

  update: (context: IContext) => void;
}

export default Subscriber;
