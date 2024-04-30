'use strict';

const { ZigBeeDevice } = require("homey-zigbeedriver");
const { ZCLNode, Cluster, debug } = require('zigbee-clusters');

// Enable debug logging of all relevant Zigbee communication
debug(true);

const IkuuLightDimmerCluster = require('../../lib/IkuuLightDimmerCluster');
Cluster.addCluster(IkuuLightDimmerCluster);


class LightDimmerDevice extends ZigBeeDevice {

    _transactionID = 0;

    set transactionID(val) {
        this._transactionID = val % 256;
    }

    get transactionID() {
        return this._transactionID;
    }
/* 


    String seq = "00" + zigbee.convertToHexString(rand(256), 2)
    def off() {     zigbee.command(0xEF00, 0x0, null, 500, seq+"0100000000")
    def on()  {     zigbee.command(0xEF00, 0x0, null, 500, seq+"0100000001")

    zigbee.command(
        clusterID,
        cmdID,
        Optional hex string in little-endian format of appropriate width for data type
        null, 500, seq+"0100000001")

    def setLevel(value, rate = 0) {
    
        if (value >= 0 && value <= 100) {       
        if (device.currentValue("level") != null 
        && device.currentValue("switch") == "off" 
        && value >= device.currentValue("level")-1 
        && value <= device.currentValue("level")+1) {
            //If the dimmer is currently off and the desired dimmer level is +-1 from current level, then just perform an "on()".
            //This resolves an issue where the dimmer wouldn't turn on if it is turned on using the setLevel function and the desired 
            //dimmer level is the same as the current dimmer level.
            on()
        } else {
            String seq = "00" + zigbee.convertToHexString(rand(256), 2)
            String commandPayload = seq + "020200040000" + zigbee.convertToHexString((value * 10) as Integer, 4)
            if (enableDebug) log.debug "setLevel() value:${value} - $commandPayload"        
            zigbee.command(0xEF00, 0x0, null, 200, commandPayload)  +  zigbee.command(0xEF00, 0x0, null, 500, "11110100000001")
        }
    }
}
*/
    async writeRaw(dp, data) {
        return this.zclNode.endpoints[1].clusters.ikuuLightDimmer.datapoint({
            status: 0,
            transid: this.transactionID++,
            dp,
            datatype: 0,
            length: data.length,
            data
        });
    }

    async onNodeInit({ zclNode }) {

        this.log('FanLightDevice has been initialized');

        this.registerCapabilityListener("onoff", async (value, opts) => {            
            this.log('>>>>> onoff',value);
        });

        this.registerCapabilityListener("dim", async (value, opts) => {            
            this.log('>>>>> dim',value);
        });
/*
        this.registerCapability("onoff", CLUSTER.ON_OFF, {
            reportOpts: {
                configureAttributeReporting: {
                    minInterval: 0,
                    maxInterval: 300,
                    minChange: 1,
                },
            },
        });

        this.registerCapabilityListener("fanspeed", async (value, opts) => {
            await zclNode.endpoints[1].clusters[IkuuFanSpeedCluster.NAME].writeAttributes({ speed: getSpeedValue(value) });
        });

        await zclNode.endpoints[1].clusters[IkuuFanSpeedCluster.NAME].configureReporting({
            speed: {
                minInterval: 0,
                maxInterval: 300,
                minChange: 1,
            },
        });

        zclNode.endpoints[1].clusters[IkuuFanSpeedCluster.NAME].on(
            "attr.speed",
            (value) => {
                this.setCapabilityValue("fanspeed", value);
            }
        );
*/

    }
}

module.exports = LightDimmerDevice;