import IContext from "./context";

interface Subscriber {
  readonly name: string;

  update: (context: IContext) => void;
}

export default Subscriber;
