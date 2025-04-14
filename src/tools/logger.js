class Logger {
  constructor() {
    this.enabled = true;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  log(message) {
    if (this.enabled) {
      console.log('MyLogger:', message);
    }
  }
}

const logger = new Logger();
export default logger;
