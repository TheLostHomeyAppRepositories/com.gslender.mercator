'use strict';

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { ZCLNode, CLUSTER, debug } = require('zigbee-clusters');

// Enable debug logging of all relevant Zigbee communication
debug(true);

const IkuuFanSpeedCluster = require('../../lib/IkuuFanSpeedCluster');

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

    this.registerCapability("fanspeed", IkuuFanSpeedCluster, {
      setSpeed: async (value) => {
        this.log('FanLightDevice setSpeed',value);
      }
    });

    // this.registerCapabilityListener("fanspeed",)
    
  }
}

module.exports = FanLightDevice;
