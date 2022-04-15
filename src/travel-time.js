const wazeBaseUrl = 'https://www.waze.com/ul?navigate=yes&';
const wazeSearchByLL = 'latlng=';
const wazeSearchByQuery = 'q=';

const googleMapsBaseUrl = 'https://maps.google.com/?';
const googleSearchByLL = 'daddr=';
const googleSearchByQuery = 'daddr=';

const hereBaseUrl = 'https://wego.here.com/directions/mix/';
const hereSearchByLL = '';
const hereSearchByQuery = '';

export function getDistance(entity, config, hass) {
  let distance = entity.attributes.distance || 0;

  // if given string try to remove everything that's not a part of the number
  // (google adds measurement on distance)
  if (distance.replace) distance = distance.replace(/[A-Za-z ]/g, '');

  distance = parseInt(entity.attributes.distance, 10);
  distance = Number.isNaN(distance) ? 0 : distance.toFixed(1);

  // check if we have a number at this point
  distance = parseInt(distance, 10);
  if (Number.isNaN(distance)) return 0;

  // if given custom units we need to convert units
  if (config.distance_units) {
    const distanceMeasurement = getOriginalDistanceMeasurement(entity, hass);

    // miles to kilometers
    if (distanceMeasurement === 'mi' && config.distance_units === 'km') {
      distance = distance * 1.60934;
    }

    // feet to meters
    if (distanceMeasurement === 'ft' && config.distance_units === 'km') {
      distance = distance * 0.3048;
    }

    // kilometers to miles
    if (distanceMeasurement === 'km' && config.distance_units === 'mi') {
      distance = distance * 0.621371;
    }

    // meters to feet
    if (distanceMeasurement === 'm' && config.distance_units === 'mi') {
      distance = distance * 3.28084;
    }
  }

  return parseInt(distance, 10);
}

function getOriginalDistanceMeasurement(entity, hass) {
  return `${entity.attributes.distance}`.replace(/[^a-z]/g, '') || hass.config.unit_system.length || '';
}

export function getDistanceMeasurement(entity, config, hass) {
  if (config.distance_units) return config.distance_units;
  return getOriginalDistanceMeasurement(entity, hass);
}

function isGoogle(entity) {
  return entity.attributes.destination_addresses;
}

function isWaze(entity) {
  return /Powered by Waze/i.test(entity.attributes.attribution);
}

function isHere(entity) {
  return /Powered by Here/i.test(entity.attributes.attribution);
}

export function openRoute(entity) {
  let baseUrl = '';
  let searchByLL = '';
  let searchByQuery = '';

  if (isGoogle(entity)) {
    baseUrl = googleMapsBaseUrl;
    searchByLL = googleSearchByLL;
    searchByQuery = googleSearchByQuery;
  } else if (isHere(entity)) {
    baseUrl = hereBaseUrl;
    searchByLL = hereSearchByLL;
    searchByQuery = hereSearchByQuery;
  } else if (isWaze(entity)) {
    baseUrl = wazeBaseUrl;
    searchByLL = wazeSearchByLL;
    searchByQuery = wazeSearchByQuery;
  }

  let url = '';

  const destinationAddress = getDestinationAddress(entity);

  if (entity.attributes.destination) {
    url = `${baseUrl}${searchByLL}${entity.attributes.destination}`;
  } else if (destinationAddress) {
    url = `${baseUrl}${searchByQuery}${destinationAddress}`;
  }

  if (!url) throw Error(`Could not find an address for ${entity.entity_id}`);
  window.open(url);
}

function getDestinationAddress(entity) {
  if (entity.attributes.destination_addresses && entity.attributes.destination_addresses.length) {
    return entity.attributes.destination_addresses[0];
  }

  if (entity.attributes.destination_name) {
    return entity.attributes.destination_name;
  }

  return entity.attributes.destination_address || '';
}
