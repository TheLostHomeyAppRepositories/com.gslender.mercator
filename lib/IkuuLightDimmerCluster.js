const { Cluster, ZCLDataTypes } = require('zigbee-clusters');


const ATTRIBUTES = {};

const COMMANDS = {};

class IkuuLightDimmerCluster extends Cluster {

  static get ID() {
    return 0xEF00;
  }

  static get NAME() {
    return 'ikuuLightDimmer';
  }

  static get ATTRIBUTES() {
    return ATTRIBUTES;
  }

  static get COMMANDS() {
    return COMMANDS;
  }

}

Cluster.addCluster(IkuuLightDimmerCluster);

module.exports = IkuuLightDimmerCluster;