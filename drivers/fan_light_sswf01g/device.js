'use strict';

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { ZCLNode, CLUSTER, debug } = require('zigbee-clusters');

// Enable debug logging of all relevant Zigbee communication
debug(true);

const IkuuFanSpeedCluster = require('../../lib/IkuuFanSpeedCluster');

class FanLightDevice extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    this.log('FanLightDevice has been initialized');

    this.registerCapability("onoff", CLUSTER.ON_OFF);

    this.registerCapability("fanspeed", IkuuFanSpeedCluster);

  }
}

module.exports = FanLightDevice;
