const { Cluster, ZCLDataTypes } = require('zigbee-clusters');

// setting FanSpeed needs to write atttribue to ZB device based on picker's value
//  cluster 0x0202
//  attributeId 0x0
//  dataType 0x30
//  value 0x03  <<==== high 3, medium 2, low 1, off 0
const SPEEDS = {
  off: 0x00,
  low: 0x01,
  medium: 0x02,
  high: 0x03
};

const ATTRIBUTES = {
  speed: { id: 0, type: ZCLDataTypes.map56(SPEEDS) }
};

const COMMANDS = {
  setSpeed: {
    id: 0x0,
    args: {
      value: ZCLDataTypes.enum8({
        off: 0x00,
        low: 0x01,
        medium: 0x02,
        high: 0x03
      })
    },
  },
};

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