'use strict';

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { debug } = require("zigbee-clusters");

// Enable debug logging of all relevant Zigbee communication
debug(true);

// const { Device } = require('homey');

class FanLightDevice extends ZigBeeDevice {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('FanLightDevice has been initialized');
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('FanLightDevice has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('FanLightDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('FanLightDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('FanLightDevice has been deleted');
  }

}

module.exports = FanLightDevice;
