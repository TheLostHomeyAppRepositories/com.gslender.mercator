'use strict';

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { CLUSTER, Cluster, debug } = require('zigbee-clusters');

class DoublePowerPointDevice extends ZigBeeDevice {
  
  async onNodeInit({ zclNode }) {
    await super.onNodeInit({ zclNode });

    this.log('DoublePowerPointDevice has been initialized');

    // debug(true);

    // this.printNode();
    // console.log(zclNode.endpoints);

    this.meteringOffset = this.getSetting('metering_offset');
    this.measureOffset = this.getSetting('measure_offset') * 100;
    this.minReportPower = this.getSetting('minReportPower') * 1000;
    this.minReportCurrent = this.getSetting('minReportCurrent') * 1000;
    this.minReportVoltage = this.getSetting('minReportVoltage') * 1000;

    await this.addCapability('measure_current').catch(this.error);

    await this.addCapability('measure_voltage').catch(this.error);

    await zclNode.endpoints[1].clusters.basic.readAttributes(['manufacturerName', 'zclVersion', 'appVersion', 'modelId', 'powerSource', 'attributeReportingStatus'])
      .catch(err => {
        this.error('Error when reading device attributes ', err);
      });
    
    try {
			const left_socket_attributes = await zclNode.endpoints[1].clusters[CLUSTER.ON_OFF.NAME].readAttributes(['onOff']);
      // this.log('left_socket_attributes.onOff',left_socket_attributes.onOff);
      this.setCapabilityValue('left_socket', left_socket_attributes.onOff).catch(this.error);
			const right_socket_attributes = await zclNode.endpoints[2].clusters[CLUSTER.ON_OFF.NAME].readAttributes(['onOff']);
      // this.log('right_socket_attributes.onOff',right_socket_attributes.onOff);
      this.setCapabilityValue('right_socket', right_socket_attributes.onOff).catch(this.error);
		} catch (err) {
			this.setUnavailable('Cannot reach zigbee device').catch(this.error);
			this.error('Error in readAttributes onOff: ', err);
		}

    let _device = this; // We're in a Device instance

    // left_socket
    this.registerCapabilityListener("left_socket", async (value, opts) => {
      if (value) {
        await zclNode.endpoints[1].clusters[CLUSTER.ON_OFF.NAME].setOn();
      }
      else {
        await zclNode.endpoints[1].clusters[CLUSTER.ON_OFF.NAME].setOff();
      }
    });
    await zclNode.endpoints[1].clusters[CLUSTER.ON_OFF.NAME].configureReporting({});
    zclNode.endpoints[1].clusters[CLUSTER.ON_OFF.NAME].on(
      'attr.onOff',
      (value) => {
        _device.setCapabilityValue("left_socket", value);
        if (value) {
          _device.driver.triggerLeftSocketOn(_device);
        } else {
          _device.driver.triggerLeftSocketOff(_device);
        }
      }
    );


    // right_socket
    this.registerCapabilityListener("right_socket", async (value, opts) => {
      if (value) {
        await zclNode.endpoints[2].clusters[CLUSTER.ON_OFF.NAME].setOn();
      }
      else {
        await zclNode.endpoints[2].clusters[CLUSTER.ON_OFF.NAME].setOff();
      }
    });
    await zclNode.endpoints[2].clusters[CLUSTER.ON_OFF.NAME].configureReporting({});
    zclNode.endpoints[2].clusters[CLUSTER.ON_OFF.NAME].on(
      'attr.onOff',
      (value) => {
        _device.setCapabilityValue("right_socket", value);
        if (value) {
          _device.driver.triggerRightSocketOn(_device);
        } else {
          _device.driver.triggerRightSocketOff(_device);
        }
      }
    );


    // meter_power
    this.registerCapability('meter_power', CLUSTER.METERING, {
      reportParser: value => (value * this.meteringOffset) / 100.0,
      getParser: value => (value * this.meteringOffset)/100.0,
      get: 'currentSummationDelivered',
      report: 'currentSummationDelivered',
      getOpts: {
        getOnStart: true,
        pollInterval: 30000, // in ms
      },
     });

    // measure_power
    this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
      reportParser: value => {
        // this.log('measure_power value=', value);
        return (value * this.measureOffset) / 100;
      },
      getOpts: {
        getOnStart: true,
        pollInterval: this.minReportPower
      }
    });

    this.registerCapability('measure_current', CLUSTER.ELECTRICAL_MEASUREMENT,  {
      reportParser: value => {
        // this.log('measure_current value=', value);
        return value / 1000;
      },
      getOpts: {
        getOnStart: true,
        pollInterval: this.minReportCurrent
      }
    });

    this.registerCapability('measure_voltage', CLUSTER.ELECTRICAL_MEASUREMENT,  {
      reportParser: value => {
        // this.log('measure_voltage value=', value);
        return value;
      },
      getOpts: {
        getOnStart: true,
        pollInterval: this.minReportVoltage
      }
    });
  }

  onDeleted() {
    this.log("DoublePowerPointDevice removed")
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    // Check if specific settings have changed
    if (changedKeys.includes('metering_offset')) {
      this.meteringOffset = newSettings.metering_offset;
    }
    if (changedKeys.includes('measure_offset')) {
      this.measureOffset = newSettings.measure_offset * 100;
    }
    if (changedKeys.includes('minReportPower')) {
      this.minReportPower = newSettings.minReportPower * 1000;
    }
    if (changedKeys.includes('minReportCurrent')) {
      this.minReportCurrent = newSettings.minReportCurrent * 1000;
    }
    if (changedKeys.includes('minReportVoltage')) {
      this.minReportVoltage = newSettings.minReportVoltage * 1000;
    }
  }
}

module.exports = DoublePowerPointDevice;
