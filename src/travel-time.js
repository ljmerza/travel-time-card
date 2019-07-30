

export default class TravelTimeEntity {
  constructor(entity, config, hass) {
    this._entity = entity;
    this._config = config;
    this._unit_system = hass.config.unit_system;

    this._entityConfig = config.entities.find(confEntity => (confEntity.entity || confEntity) === entity.entity_id) || {};

    this._zoneConfig = this._entityConfig.zone && hass.states[this._entityConfig.zone];
  }

  get zone() {
    if (this._zoneConfig) {
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

    if (this.isGoogle) {
      time = this._entity.attributes.duration.replace(/mins$/, 'min');
    } else if (this.isWaze) {
      time = parseInt(this._entity.attributes.duration, 10);
      time = Number.isNaN(time) ? 0 : this._entity.attributes.duration.toFixed(1);
    }

    time = parseInt(time, 10);
    if (Number.isNaN(time)) return 0;
    return time;
  }

  get timeMeasurement() {
    return this._entity.attributes.unit_of_measurement || '';
  }

  get distance() {
    let distance = this._entity.attributes.distance || 0;

    // if given string try to remove everything that's not a part of the number 
    // (google adds measurement on distance)
    if (distance.replace) distance = distance.replace(/[A-Za-z ]/g, '');

    // waze givesa very long float number so we need to shorten it
    if (this.isWaze) {
      distance = parseInt(this._entity.attributes.distance, 10);
      distance = Number.isNaN(distance) ? 0 : this._entity.attributes.distance.toFixed(1);
    }

    // check if we have a number at this point
    distance = parseInt(distance, 10);
    if (Number.isNaN(distance)) return 0;

    // if given custom units we need to convert units
    if (this._config.distance_units){

      // miles to kilometers
      if (this.originalDistanceMeasurement === 'mi' && this._config.distance_units === 'km'){
        distance = distance * 1.60934;
      }

      // feet to meters
      if (this.originalDistanceMeasurement === 'ft' && this._config.distance_units === 'km') {
        distance = distance * 0.3048;
      }

      // kilometers to miles
      if (this.originalDistanceMeasurement === 'km' && this._config.distance_units === 'mi') {
        distance = distance * 0.621371;
      }

      // meters to feet
      if (this.originalDistanceMeasurement === 'm' && this._config.distance_units === 'mi') {
        distance = distance * 3.28084;
      }
    }

    return parseInt(distance, 10);
  }

  /**
   * keep original so we know if we need to convert diatnce or 
   * not even if the measurement itself is converted
   */
  get originalDistanceMeasurement() {
    let distance = this._entity.attributes.units || this._unit_system.length || '';

    if (this.isGoogle) {
      distance = this._entity.attributes.distance || 0;
      distance = distance.replace(/[0-9\. ]/g, '');
    };

    return distance;
  }

  get distanceMeasurement() {
    let distance = this.originalDistanceMeasurement;

    // if given custom units we need to convert units
    if (this._config.distance_units) {

      // miles to kilometers
      if (distance=== 'mi' && this._config.distance_units === 'km') {
        distance = 'km';
      }

      // feet to meters
      if (distance === 'ft' && this._config.distance_units === 'km') {
        distance = 'm';
      }

      // kilometers to miles
      if (distance === 'km' && this._config.distance_units === 'mi') {
        distance = 'mi';
      }

      // meters to feet
      if (distance === 'm' && this._config.distance_units === 'mi') {
        distance = 'ft';
      }
    }

    return distance;
  }

  get route() {
    return this._entity.attributes.route || '';
  }

  get destinationAddress() {
    if (this._entity.attributes.destination_addresses && this._entity.attributes.destination_addresses.length) {
      return this._entity.attributes.destination_addresses[0];
    }

    return this._entity.attributes.destination_address || '';
  }

  get destinationCoordinates() {
    return this._entity.attributes.destination;
  }

  get icon() {
    return this._entity.attributes.icon || 'mdi:car';
  }
}
