'use strict';

const { CLUSTER, Cluster, debug } = require('zigbee-clusters');
const TuyaSpecificCluster = require('../../lib/TuyaSpecificCluster');
const TuyaSpecificClusterDevice = require("../../lib/TuyaSpecificClusterDevice");

Cluster.addCluster(TuyaSpecificCluster);

class FiveLightSwitchDevice extends TuyaSpecificClusterDevice {

  async onNodeInit({ zclNode }) {
    super.onNodeInit({ zclNode });

    this.printNode();
    debug(true);

    const subDeviceId = this.isSubDevice() ? this.getData().subDeviceId : 'firstLight';
    this.log('FiveLightSwitchDevice ', subDeviceId, ' has been initialized');

    if (subDeviceId === 'firstLight') {
      await zclNode.endpoints[1].clusters.basic.readAttributes(['manufacturerName', 'zclVersion', 'appVersion', 'modelId', 'powerSource', 'attributeReportingStatus'])
        .catch(err => {
          this.error('Error when reading device attributes ', err);
        });
      this.registerCapabilityListener('onoff', async value => {
        // this.log('onoff: ', value);
        await this.writeBool(1, value);
      });
    }

    if (subDeviceId === 'secondLight') {
      this.registerCapabilityListener('onoff', async value => {
        // this.log('onoff: ', value);
        await this.writeBool(2, value);
      });
    }

    if (subDeviceId === 'thirdLight') {
      this.registerCapabilityListener('onoff', async value => {
        // this.log('onoff: ', value);
        await this.writeBool(3, value);
      });
    }

    if (subDeviceId === 'fourthLight') {
      this.registerCapabilityListener('onoff', async value => {
        // this.log('onoff: ', value);
        await this.writeBool(4, value);
      });
    }

    if (subDeviceId === 'fifthLight') {
      this.registerCapabilityListener('onoff', async value => {
        // this.log('onoff: ', value);
        await this.writeBool(5, value);
      });
    }


    zclNode.endpoints[1].clusters[TuyaSpecificCluster.NAME].on(
      "response",
      async (value) => {

        if (value.dp === 1 && subDeviceId === 'firstLight') {
          const onoff = value.data.readUInt8(0);
          // this.log(">>>tuya.onoff", onoff === 1 );
          return await this.setCapabilityValue("onoff", onoff === 1);
        }

        if (value.dp === 2 && subDeviceId === 'secondLight') {
          const onoff = value.data.readUInt8(0);
          // this.log(">>>tuya.onoff", onoff === 1 );
          return await this.setCapabilityValue("onoff", onoff === 1);
        }

        if (value.dp === 3 && subDeviceId === 'thirdLight') {
          const onoff = value.data.readUInt8(0);
          // this.log(">>>tuya.onoff", onoff === 1 );
          return await this.setCapabilityValue("onoff", onoff === 1);
        }

        if (value.dp === 4 && subDeviceId === 'fourthLight') {
          const onoff = value.data.readUInt8(0);
          // this.log(">>>tuya.onoff", onoff === 1 );
          return await this.setCapabilityValue("onoff", onoff === 1);
        }

        if (value.dp === 5 && subDeviceId === 'fifthLight') {
          const onoff = value.data.readUInt8(0);
          // this.log(">>>tuya.onoff", onoff === 1 );
          return await this.setCapabilityValue("onoff", onoff === 1);
        }

        this.log(">>>tuya.response", value);
      }
    );

    await this.sendQuery();
  }

  onDeleted() {
    this.log('FiveLightSwitchDevice removed');
  }
}

module.exports = FiveLightSwitchDevice;
