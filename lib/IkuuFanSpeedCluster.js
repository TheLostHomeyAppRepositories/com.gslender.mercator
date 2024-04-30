const { Cluster, ZCLDataTypes } = require('zigbee-clusters');

const SPEEDS = {
  off: 0,
  low: 1,
  medium: 2,
  high: 3,
  on: 4
};

const ATTRIBUTES = {
  speed: { id: 0x0, type: ZCLDataTypes.enum8(SPEEDS) }
};

const COMMANDS = {};

class IkuuFanSpeedCluster extends Cluster {

  static get ID() {
    return 0x0202;
  }

  static get NAME() {
    return 'ikuuFanSpeed';
  }

  static get ATTRIBUTES() {
    return ATTRIBUTES;
  }

  static get COMMANDS() {
    return COMMANDS;
  }

}

Cluster.addCluster(IkuuFanSpeedCluster);

module.exports = IkuuFanSpeedCluster;