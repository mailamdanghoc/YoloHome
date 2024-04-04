import mqtt from "mqtt";
import Publisher from "../utils/publisher";
import Subscriber from "../utils/subscriber";
import IContext from "../utils/context";

class MQTTService implements Publisher {
  private mqttClient: mqtt.MqttClient;
  private observers: Subscriber[] = [];

  constructor(
    protected username: string,
    protected password: string,
    protected topics: string[] = []
  ) {
    this.mqttClient = mqtt.connect({
      host: "io.adafruit.com",
      port: 8883,
      protocol: "mqtts",
      username: this.username,
      password: this.password,
      clientId: "mqttjs_" + Math.random().toString(16).substring(2, 8),
      connectTimeout: 4000,
    });

    this.mqttClient.on("connect", () => {
      console.log("MQTT server connected");
      if (topics.length > 0) {
        this.mqttClient.subscribe(this.topics, () => {
          console.log(`Subscribe to topic(s): ${this.topics}`);
        });
      }
    });

    this.mqttClient.on("error", err => {
      console.error(err);
    });

    this.mqttClient.on("message", (topic: string, payload) => {
      this.notify({
        name: topic,
        payload: payload.toString(),
      });
    });
  }

  addTopic(newTopics: string[]) {
    const unaddedTopics = newTopics.filter(
      topic => !this.topics.includes(topic)
    );
    if (unaddedTopics.length > 0) {
      this.mqttClient.subscribe(unaddedTopics, () => {
        console.log(`Subscribe to topic(s): ${unaddedTopics}`);
      });
    }
  }

  sendMessage(topic: string, message: string) {
    this.mqttClient.publish(topic, message);
  }

  subscribe(sub: Subscriber) {
    if (!this.observers.includes(sub)) {
      this.observers.push(sub);
    }
  }

  unsubscribe(sub: Subscriber) {
    const index = this.observers.indexOf(sub);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(context: IContext) {
    this.observers
      .filter(observer => observer.name === context.name)
      .forEach(observer => observer.update(context));
  }
}

export default MQTTService;
