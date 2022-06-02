# Travel Time Card for Home Assistant

Show travel time data and open rotues to Google Maps, Waze or HERE

<img src='https://raw.githubusercontent.com/ljmerza/travel-time-card/master/card.png' />

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
![Project Maintenance][maintenance-shield]
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)

Installation through [HACS](https://hacs.xyz/)

## Configurations

---

```yaml
type: 'custom:travel-time-card'
entities:
  - sensor.google_leo_home
  - sensor.google_leo_work
```

## Options

---
| Name | Type | Requirement | `Default` Description
| :---- | :---- | :------- | :----------- |
| entities | list | **Required** | List of entities to show
| title | string | **Optional** | `Travel Times` Change card title
| show_header | boolean | **Optional** | `true` Show or hide header
| columns | list | **Optional** | `['name', 'duration', 'distance', 'route']` Customize what columns are shown
| distance_units | string | **Optional** | `` Force conversion of distance units to metric or imperial if needed (km or mi only)

---

Enjoy my card? Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/JMISm06AD)

[commits-shield]: https://img.shields.io/github/commit-activity/y/ljmerza/travel-time-card.svg?style=for-the-badge
[commits]: https://github.com/ljmerza/travel-time-card/commits/master
[license-shield]: https://img.shields.io/github/license/ljmerza/travel-time-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/badge/maintainer-Leonardo%20Merza%20%40ljmerza-blue.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/ljmerza/travel-time-card.svg?style=for-the-badge
[releases]: https://github.com/ljmerza/travel-time-card/releases
