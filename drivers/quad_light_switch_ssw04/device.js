'use strict';

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { CLUSTER,Cluster, debug } = require('zigbee-clusters');
const TuyaSpecificCluster = require('../../lib/TuyaSpecificCluster');
const TuyaSpecificClusterDevice = require("../../lib/TuyaSpecificClusterDevice");

Cluster.addCluster(TuyaSpecificCluster);

class QuadLightSwitchDevice extends TuyaSpecificClusterDevice {

  async onNodeInit({ zclNode }) {
    await super.onNodeInit({ zclNode });

    this.log('QuadLightSwitchDevice has been initialized');

    const { subDeviceId } = this.getData();
    this.log('Device data: ', subDeviceId);

    this.registerCapability('onoff', CLUSTER.ON_OFF, {
      endpoint: subDeviceId === 'secondLight' ? 2 : subDeviceId === 'thirdLight' ? 3 : subDeviceId === 'fourthLight' ? 4 : 1,
    });

    if (!this.isSubDevice()) {
        await zclNode.endpoints[1].clusters.basic.readAttributes(['manufacturerName', 'zclVersion', 'appVersion', 'modelId', 'powerSource', 'attributeReportingStatus'])
        .catch(err => {
            this.error('Error when reading device attributes ', err);
        });
    }
    // debug(true);

    // this.printNode();
    // console.log(zclNode.endpoints);

  }


  onDeleted() {
    this.log("QuadLightSwitchDevice removed")
  }

}

module.exports = QuadLightSwitchDevice;
