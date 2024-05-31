
'use strict';

const { ZigBeeDriver } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');

class double_power_point_spp02g extends ZigBeeDriver {
    async onInit() {
        this.log('double_power_point_spp02g has been initialized');
        this._leftSocketOn = this.homey.flow.getDeviceTriggerCard("left_socket_is_on");
        this._leftSocketOff = this.homey.flow.getDeviceTriggerCard("left_socket_is_off");
        this._rightSocketOn = this.homey.flow.getDeviceTriggerCard("right_socket_is_on");
        this._rightSocketOff = this.homey.flow.getDeviceTriggerCard("right_socket_is_off");

        // left_socket
        this.homey.flow.getActionCard('left_socket_switch_on').registerRunListener(async (args, state) => {
          await args.device.zclNode.endpoints[1].clusters[CLUSTER.ON_OFF.NAME].setOn();
        });
        this.homey.flow.getActionCard('left_socket_switch_off').registerRunListener(async (args, state) => {
          await args.device.zclNode.endpoints[1].clusters[CLUSTER.ON_OFF.NAME].setOff();
        });
        // right_socket
        this.homey.flow.getActionCard('right_socket_switch_on').registerRunListener(async (args, state) => {
          await args.device.zclNode.endpoints[2].clusters[CLUSTER.ON_OFF.NAME].setOn();
        });
        this.homey.flow.getActionCard('right_socket_switch_off').registerRunListener(async (args, state) => {
          await args.device.zclNode.endpoints[2].clusters[CLUSTER.ON_OFF.NAME].setOff();
        });
      }
    
      triggerLeftSocketOn(device, tokens, state) {
        tokens = tokens || {};
        state = state || {};
        this._leftSocketOn.trigger(device, tokens, state).catch(this.error);
      }
    
      triggerLeftSocketOff(device, tokens, state) {
        tokens = tokens || [];
        state = state || [];
        this._leftSocketOff.trigger(device, tokens, state).catch(this.error);
      }
    
      triggerRightSocketOn(device, tokens, state) {
        tokens = tokens || {};
        state = state || {};
        this._rightSocketOn.trigger(device, tokens, state).catch(this.error);
      }
    
      triggerRightSocketOff(device, tokens, state) {
        tokens = tokens || [];
        state = state || [];
        this._rightSocketOff.trigger(device, tokens, state).catch(this.error);
      }
}

module.exports = double_power_point_spp02g;