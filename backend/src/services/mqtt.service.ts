import mqtt from "mqtt";
import Publisher from "../utils/publisher";
import Subscriber from "../utils/subscriber";
import IContext from "../utils/context";

class MQTTService implements Publisher {
  private _id: string;
  private mqttClient: mqtt.MqttClient;
  private topics: string[] = [];
  private observers: Subscriber[] = [];
  private static instance: MQTTService;

  private constructor() {
    this._id = "mqttjs_" + Math.random().toString(16).substring(2, 8);

    this.mqttClient = mqtt.connect({
      host: "io.adafruit.com",
      port: 8883,
      protocol: "mqtts",
      username: process.env.ADAFRUIT_IO_USERNAME,
      password: process.env.ADAFRUIT_IO_KEY,
      clientId: this._id,
      connectTimeout: 4000,
    });

    this.mqttClient.on("connect", () => {
      console.log("MQTT server connected successfully!");
    });

    this.mqttClient.on("error", err => {
      console.error("MQTT error: ", err);
    });

    this.mqttClient.on("message", (topic, payload) => {
      this.notify({
        name: topic,
        payload: payload.toString(),
      });
    });
  }

  public static getInstance() {
    if (!MQTTService.instance) {
      MQTTService.instance = new MQTTService();
    }

    return MQTTService.instance;
  }

  addTopic(newTopics: string | string[]) {
    let unaddedTopics: string[] = [];

    if (typeof newTopics === "string" && !this.topics.includes(newTopics)) {
      unaddedTopics.push(newTopics);
    }
    if (Array.isArray(newTopics)) {
      unaddedTopics = newTopics.filter(topic => !this.topics.includes(topic));
    }

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

  notify(context?: IContext) {
    if (typeof context !== "undefined") {
      this.observers
        .filter(observer => observer.name === context.name)
        .forEach(observer => observer.update(context));
    } else {
      this.observers.forEach(observer => observer.update(context));
    }
  }
}

export default MQTTService;
