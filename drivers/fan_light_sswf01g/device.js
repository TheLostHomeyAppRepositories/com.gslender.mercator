'use strict';

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { ZCLNode, CLUSTER, debug } = require('zigbee-clusters');

// Enable debug logging of all relevant Zigbee communication
// debug(true);

const IkuuFanSpeedCluster = require('../../lib/IkuuFanSpeedCluster');

const SPEEDS = {
  off: 0,
  low: 1,
  medium: 2,
  high: 3,
  on: 4
};

function getSpeedValue(speedKey) {
  const key = speedKey.trim().toLowerCase(); // Clean and standardize the input
  if (key in SPEEDS) {
    return SPEEDS[key];
  } else {
    throw new Error("Invalid speed key"); // Handle unknown keys
  }
}

class FanLightDevice extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {

    this.log('FanLightDevice has been initialized');

    const switchFanToAction = this.homey.flow.getActionCard('switch-fan-to');
    switchFanToAction.registerRunListener(async (args, state) => {
      await zclNode.endpoints[1].clusters[IkuuFanSpeedCluster.NAME].writeAttributes({ speed: getSpeedValue(args) });
    });

    this.registerCapability("onoff", CLUSTER.ON_OFF, {
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0,
          maxInterval: 300,
          minChange: 1,
        },
      },
    });

    let _device = this; // We're in a Device instance

    this.registerCapabilityListener("fanspeed", async (value, opts) => {
      await zclNode.endpoints[1].clusters[IkuuFanSpeedCluster.NAME].writeAttributes({ speed: getSpeedValue(value) });
      if (value === 'off') {
        _device.driver.triggerFanOff(_device);
        
      } else {
        _device.driver.triggerFanOn(_device);
      }
    });

    await zclNode.endpoints[1].clusters[IkuuFanSpeedCluster.NAME].configureReporting({
      speed: {
        minInterval: 0,
        maxInterval: 300,
        minChange: 1,
      },
    });
    
    zclNode.endpoints[1].clusters[IkuuFanSpeedCluster.NAME].on(
      "attr.speed",
      (value) => {
        _device.setCapabilityValue("fanspeed", value);
        if (value === 'off') {
          _device.driver.triggerFanOff(_device);
          
        } else {
          _device.driver.triggerFanOn(_device);
        }
      }
    );


  }
}

module.exports = FanLightDevice;
