

export default class TravelTimeEntity {
    constructor(entity, config) {
        this._entity = entity;
        this._config = config;
        this._entityConfig = config.entities.find(confEntity => (confEntity.entity || confEntity) === entity.entity_id) || {};
    }

    get isGoogle() {

    }

    get isWaze() {

    }

    get travelTime() {
        return this._entity.state;
    }

    get unitsOfMeasurement() {
        return this._entity.attributes.unit_of_measurement;
    }

    get units() {
        return this._entity.attributes.units;
    }

    get name() {
        return this._entity.attributes.friendly_name;
    }

    get distance() {
        return this._entity.attributes.distance;
    }
}