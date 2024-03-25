class TestModel {
  getData() {
    return new Promise<string>(resolve => {
      setTimeout(() => {
        resolve("Calling API");
      }, 1000);
    });
  }
}

export default new TestModel();
