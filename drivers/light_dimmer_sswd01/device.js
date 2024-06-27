'use strict';

const { CLUSTER, Cluster, debug } = require('zigbee-clusters');
const TuyaSpecificCluster = require('../../lib/TuyaSpecificCluster');
const TuyaSpecificClusterDevice = require("../../lib/TuyaSpecificClusterDevice");

Cluster.addCluster(TuyaSpecificCluster);

class LightDimmerDevice extends TuyaSpecificClusterDevice {

  async onNodeInit({ zclNode }) {
    await super.onNodeInit({ zclNode });

    this.log('LightDimmerDevice has been initialized');

    // this.printNode();
    // debug(true);

    await zclNode.endpoints[1].clusters.basic.readAttributes(['manufacturerName', 'zclVersion', 'appVersion', 'modelId', 'powerSource', 'attributeReportingStatus'])
      .catch(err => {
        this.error('Error when reading device attributes ', err);
      });


    this.registerCapabilityListener('onoff', async value => {
      // this.log('onoff: ', value);
      await this.writeBool(1, value);
    });

    this.registerCapabilityListener('dim', async value => {
      const convertedValue = value * 1000;
      this.log(`dim: ${value} ${convertedValue}`);
      await this.writeData32(2, convertedValue);
    });

    // const datapoint = await zclNode.endpoints[1].clusters[TuyaSpecificCluster.NAME].readAttributes(['commandDataResponse', 'commandDataReport']);
    // this.log('>>>>>datapoint', datapoint);


    let _device = this; // We're in a Device instance

    zclNode.endpoints[1].clusters[TuyaSpecificCluster.NAME].on(
      "response",
      async (value) => {
        if (value.dp === 2) {
          const corrected_level = value.data.readUInt32BE(0) / 1000.0;
          // this.log(">>>tuya.dim", corrected_level ); 
          await _device.setCapabilityValue("dim", corrected_level).catch(this.error);
          await _device.setCapabilityValue("onoff", corrected_level != 0).catch(this.error);
          return;
        }
        if (value.dp === 1) {
          const onoff = value.data.readUInt8(0);
          // this.log(">>>tuya.onoff", onoff === 1 );
          await _device.setCapabilityValue("onoff", onoff === 1);
          return;
        }
        if (value.dp === 3) {
          const corrected_minlevel = value.data.readUInt32BE(0) / 1000.0;
          this.log(">>>tuya.minlevel", corrected_minlevel);
          await _device.setCapabilityOptions("dim", {
            "min": corrected_minlevel,
            "max": 1,
            "decimals": 2,
            "step": 0.01,
            "opts": {
              "duration": true
            }
          });
          return;
        }
        if (value.dp === 6) return; // unknown !?


        this.log(">>>tuya.response", value);
      }
    );

    await this.sendQuery();
  }

  onDeleted() {
    this.log('LightDimmerDevice removed');
  }
}

module.exports = LightDimmerDevice;
