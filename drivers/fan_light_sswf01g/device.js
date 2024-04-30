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

    this.registerCapability("onoff", CLUSTER.ON_OFF, {
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0,
          maxInterval: 300,
          minChange: 1,
        },
      },
    });

    this.registerCapabilityListener("fanspeed", async (value, opts) => {
      await zclNode.endpoints[1].clusters[IkuuFanSpeedCluster.NAME].writeAttributes({ speed: getSpeedValue(value) });
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
        this.setCapabilityValue("fanspeed", value);
      }
    );


  }
}

module.exports = FanLightDevice;
