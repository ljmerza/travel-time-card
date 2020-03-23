
export default {
  show_header: true,
  title: 'Travel Times',
  columns: ['name', 'duration', 'distance', 'route'],
  entites: [],
  map: 'google',
  distance_units: '',
};

export const validMaps = ['google', 'waze', 'here'];
export const validUnits = ['km', 'mi'];
