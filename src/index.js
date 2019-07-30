import "core-js/stable";
import "regenerator-runtime/runtime";

import { LitElement, html } from 'lit-element';
import style from './style';

import TravelTimeEditor from './index-editor';
import TravelTimeEntity from './travel-time';

import defaultConfig, { validMaps, validUnits } from './defaults';

customElements.define('travel-time-card-editor', TravelTimeEditor);


class TravelTime extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    };
  }

  constructor() {
    super();

    this.wazeBaseUrl = 'https://www.waze.com/ul?navigate=yes&';
    this.wazeSearchByLL = 'latlng=';
    this.wazeSearchByQuery = 'q=';

    this.googleMapsBaseUrl = 'https://maps.google.com/?';
    this.googleSearchByLL = 'daddr=';
    this.googleSearchByQuery = 'daddr=';
  }

  // static async getConfigElement() {
  //   return document.createElement("travel-time-card-editor");
  // }

  setConfig(config) {
    this.config = {
      ...defaultConfig,
      ...config,
    };

    if (!validMaps.includes(this.config.map)) {
      throw Error(`Invalid map selection: ${this.config.map}, must be one of: ${validMaps.join(',')}`);
    }

    if (this.config.distance_units && !validUnits.includes(this.config.distance_units)) {
      throw Error(`Invalid distance_units selection: ${this.config.distance_units}, must be one of: ${validUnits.join(',')}`);
    }

    if (this.config.map === 'google') {
      this.baseUrl = this.googleMapsBaseUrl;
      this.searchByLL = this.googleSearchByLL;
      this.searchByQuery = this.googleSearchByQuery;
    } else {
      this.baseUrl = this.wazeBaseUrl;
      this.searchByLL = this.wazeSearchByLL;
      this.searchByQuery = this.wazeSearchByQuery;
    }
  }

  /**
   * get the current size of the card
   * @return {Number}
   */
  getCardSize() {
    const headerHeight = (this.config && this.config.header) ? 1 : 0;
    const tableHeight = (this.config && this.config.entities.length) ? 1 : 0;

    return headerHeight + tableHeight;
  }

  static get styles() {
    return style;
  }

  /**
   * generates the card HTML
   * @return {TemplateResult}
   */
  render() {
    return html`
      <ha-card class='travel-time-card'>
        <style>${TravelTime.styles}</style>
        ${this.config.show_header
    ? html`
            <div class='header'>
              ${this.config.title}
            </div>
          `
    : null
}
        <div class='body'>
          ${this.renderBody()}
        </div>
      </ha-card>
    `;
  }

  /**
   * finds the url for a route and opens it if we can find it
   * @param {TravelTimeEntity} entity
   */
  openRoute(entity) {
    let url = '';

    // config zone overrides everything then search by
    // lat/long because it's more accurate, finally search by address
    if (entity.zone) {
      url = `${this.baseUrl}${this.searchByLL}${entity.zone}`;
    } else if (entity.destinationCoordinates) {
      url = `${this.baseUrl}${this.searchByLL}${entity.destinationCoordinates}`;
    } else if (entity.destinationAddress) {
      url = `${this.baseUrl}${this.searchByQuery}${entity.destinationAddress}`;
    }

    if (url) {
      window.open(url);
    } else {
      throw Error(`Could not find an address for ${entity._entity.entity_id}`);
    }
  }

  /**
   * generates the card body
   * @return {TemplateResult}
   */
  renderBody() {
    const entites = this.getEntities();

    const body = entites.map(entity => html`
        <tr class='pointer' @click=${() => this.openRoute(entity)}>
          ${this.config.columns.includes('name') ? html`<td>${entity.name}</td>` : null}
          ${this.config.columns.includes('duration') ? html`<td>${entity.time} ${entity.timeMeasurement}</td>` : null}
          ${this.config.columns.includes('distance') ? html`<td>${entity.distance} ${entity.distanceMeasurement}</td>` : null}
          ${this.config.columns.includes('route') ? html`<td>${entity.route}</td>` : null}
        <tr>
      `);

    return html`
      <table>
        ${this.renderBodyHeader()}
        <tbody>
          ${body}
        </tbody>
      </table>
    `;
  }

  /**
   * generates the card body header
   * @return {TemplateResult}
   */
  renderBodyHeader() {
    return html`
      <thead>
        <tr>
          ${this.config.columns.includes('name') ? html`<th>Name</th>` : null}
          ${this.config.columns.includes('duration') ? html`<th>Duration</th>` : null}
          ${this.config.columns.includes('distance') ? html`<th>Distance</th>` : null}
          ${this.config.columns.includes('route') ? html`<th>Route</th>` : null}
        </tr>
      <thead>
    `;
  }

  /**
   * gets a list of entiy states from the config list of entities
   * @return {TravelTimeEntity[]}
   */
  getEntities() {
    return this.config.entities.reduce((entities, entity) => {
      const entityName = entity.entity || entity;
      const entityState = this.hass.states[entityName];
      if (entityState) entities.push(new TravelTimeEntity(entityState, this.config, this.hass));
      return entities;
    }, []);
  }
}

customElements.define('travel-time-card', TravelTime);
