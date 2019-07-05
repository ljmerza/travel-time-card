import '@babel/polyfill';

import { LitElement, html } from 'lit-element';
import style from './style';

import TravelTimeEditor from './index-editor';
import TravelTimeEntity from './travel-time';

import defaultConfig, { validMaps } from './defaults';
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
    
    this.wazeBaseUrl = 'https://www.waze.com/ul?navigate=yes&ll=';
    this.googleMapsBaseUrl = 'https://www.waze.com/ul?navigate=yes&ll=';
  }

  static async getConfigElement() {
    return document.createElement("travel-time-card-editor");
  }

  setConfig(config) {
    this.config = {
      ...defaultConfig,
      ...config,
    };

    if (!validMaps.includes(this.config.map)) {
      throw Error(`Invalid map selection: ${this.config.map}, must be one of: ${validMaps.join(',')}`);
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
        ${this.config.show_header ? 
          html`
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
   * 
   * @param {*} event 
   */
  openRoute(event) {
    const baseUrl = this.config.map === defaultConfig.map ? this.googleMapsBaseUrl : this.wazeBaseUrl;
    window.open(`${baseUrl}${event.params}`);

  }

  /**
   * generates the card body
   * @return {TemplateResult}
   */
  renderBody() {
    const entites = this.getEntities();

    const body = entites.map(entity => {
      return html`
        <tr @click=${() => this.openRoute(entity)}>
          ${this.config.columns.includes('name') ? html`<td>${entity.name}</td>` : null}
          ${this.config.columns.includes('duration') ? html`<td>${entity.time} ${entity.timeMeasurement}</td>` : null}
          ${this.config.columns.includes('distance') ? html`<td>${entity.distance} ${entity.distanceMeasurement}</td>` : null}
          ${this.config.columns.includes('route') ? html`<td>${entity.route}</td>` : null}
        <tr>
      `;
    });

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
  getEntities(){
    return this.config.entities.reduce((entities, entity) => {
      const entityName = entity.entity || entity;
      const entityState = this.hass.states[entityName];
      if (entityState) entities.push(new TravelTimeEntity(entityState, this.config, this.hass.config.unit_system) );
      return entities;
    }, []);
  }

  /**
   * 
   * @param {TravelTimeEntity} entity
   */
  openRoute(entity){
    console.log(entity);
  }
}

customElements.define('travel-time-card', TravelTime);


