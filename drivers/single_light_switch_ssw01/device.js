'use strict';

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { CLUSTER,Cluster, debug } = require('zigbee-clusters');
const TuyaSpecificCluster = require('../../lib/TuyaSpecificCluster');
const TuyaSpecificClusterDevice = require("../../lib/TuyaSpecificClusterDevice");

Cluster.addCluster(TuyaSpecificCluster);

class SingleLightSwitchDevice extends TuyaSpecificClusterDevice {

  async onNodeInit({ zclNode }) {
    await super.onNodeInit({ zclNode });

    this.log('SingleLightSwitchDevice has been initialized');


    this.registerCapability('onoff', CLUSTER.ON_OFF, { endpoint:  1 });

    await zclNode.endpoints[1].clusters.basic.readAttributes(['manufacturerName', 'zclVersion', 'appVersion', 'modelId', 'powerSource', 'attributeReportingStatus'])
    .catch(err => {
        this.error('Error when reading device attributes ', err);
    });
    // debug(true);

    // this.printNode();
    // console.log(zclNode.endpoints);

  }


  onDeleted() {
    this.log("SingleLightSwitchDevice removed")
  }

}

module.exports = SingleLightSwitchDevice;
