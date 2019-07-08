

export default class TravelTimeEntity {
    constructor(entity, config, hass) {
        this._entity = entity;
        this._config = config;
        this._unit_system = hass.config.unit_system;

        this._entityConfig = config.entities.find(confEntity => (confEntity.entity || confEntity) === entity.entity_id) || {};
        this._zoneConfig = this._entityConfig.zone && hass.states[this._entityConfig.zone];
    }

    get zone() {
        if (this._zoneConfig){
            return `${this._zoneConfig.attributes.latitude},${this._zoneConfig.attributes.longitude}`;
        }
        
        return '';
    }

    get isGoogle() {
        return this._entity.attributes.destination_addresses;
    }

    get isWaze() {
        return /Powered by Waze/i.test(this._entity.attributes.attribution);
    }

    get name() {
        return this._entity.attributes.friendly_name;
    }

    get time() {
        let time = this._entity.state || 0;

        if (this.isGoogle){
            time = this._entity.attributes.duration.replace(/mins$/, 'min');
        } else if (this.isWaze) {
            time = isNaN(this._entity.attributes.duration) ? 0 : this._entity.attributes.duration.toFixed(1);
        }

        return !!parseInt(time) ? time : 0;
    }

    get timeMeasurement() {
        if (this.isGoogle) return '';
        return this._entity.attributes.unit_of_measurement || '';
    }

    get distance() {
        let distance = this._entity.attributes.distance || 0;

        if (this.isWaze){
            distance = isNaN(this._entity.attributes.distance) ? 0 : this._entity.attributes.distance.toFixed(1);
        }

        return !!parseInt(distance) ? distance : 0;
    }

    get distanceMeasurement() {
        if(this.isGoogle) return '';

        return this._entity.attributes.units || this._unit_system.length || '';
    }

    get route() {
        return this._entity.attributes.route || '';
    }

    get destinationAddress() {
        if (this._entity.attributes.destination_addresses && this._entity.attributes.destination_addresses.length) return this._entity.attributes.destination_addresses[0];
        return '';
    }

    get icon() {
        return this._entity.attributes.icon || 'mdi:car';
    }
}