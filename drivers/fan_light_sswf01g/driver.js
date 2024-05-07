const Homey = require('homey');

class Driver extends Homey.Driver {
  async onInit() {
    this.log('FanLightDriver has been initialized');
    this._fanOn = this.homey.flow.getDeviceTriggerCard("fan-on");
    this._fanOff = this.homey.flow.getDeviceTriggerCard("fan-off");
  }

  triggerFanOn(device, tokens, state) {
    tokens = tokens || {};
    state = state || {};
    this._fanOn.trigger(device, tokens, state).catch(this.error);
  }

  triggerFanOff(device, tokens, state) {
    tokens = tokens || [];
    state = state || [];
    this._fanOff.trigger(device, tokens, state).catch(this.error);
  }
}

module.exports = Driver;