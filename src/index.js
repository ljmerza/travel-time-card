import '@babel/polyfill';

import { LitElement, html } from 'lit-element';
import style from './style';

import TravelTimeEditor from './index-editor';
import TravelTimeEntity from './travel-time';

import defaultConfig from './defaults';
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
  }

  static async getConfigElement() {
    return document.createElement("travel-time-card-editor");
  }

  setConfig(config) {
    if (!config.entities) throw Error('entities required.');

    this.config = {
      ...defaultConfig,
      ...config,
    };
  }

  /**
   * get the current size of the card
   * @return {Number}
   */
  getCardSize() {
    return 1;
  }

  static get styles() {
    return style;
  }

  /**
   * generates the card HTML
   * @return {TemplateResult}
   */
  render() {
    console.log({hass: this.hass, config: this.config});

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

  renderBody() {
    const entites = this.getEntities();
    console.log({entites})

    const body = entites.map(entity => {
      return html`
        <tr>
          ${this.config.rows.includes('name') ? html`<td>${entity.name}</td>` : null}
          ${this.config.rows.includes('duration') ? html`<td>${entity.travelTime} ${entity.unitsOfMeasurement}</td>` : null}
          ${this.config.rows.includes('distance') ? html`<td>${entity.distance}</td>` : null}
          ${this.config.rows.includes('route') ? html`<td>${entity.route}</td>` : null}
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

  renderBodyHeader() {
    return html`
      <thead>
        <tr>
          ${this.config.rows.includes('name') ? html`<th>Name</th>` : null}
          ${this.config.rows.includes('duration') ? html`<th>Duration</th>` : null}
          ${this.config.rows.includes('distance') ? html`<th>Distance</th>` : null}
          ${this.config.rows.includes('route') ? html`<th>Route</th>` : null}
        </tr>
      <thead>
    `;
  }

  /**
   * gets a list of entiy states from the config list of entities
   * @return {Entities[]}
   */
  getEntities(){
    return this.config.entities.reduce((entities, entity) => {
      const entityName = entity.entity || entity;
      const entityState = this.hass.states[entityName];
      if (entityState) entities.push(new TravelTimeEntity(entityState, this.config) );
      return entities;
    }, []);
  }
}

customElements.define('travel-time-card', TravelTime);


