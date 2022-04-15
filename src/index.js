import { LitElement, html } from 'lit';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import style from './style';
import packageJson from '../package.json';

import { getDistance, getDistanceMeasurement, openRoute } from './travel-time';
import defaultConfig from './defaults';

/* eslint no-console: 0 */
console.info(
  `%c TRAVEL-TIME-CARD \n%c  Version ${packageJson.version}   `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

class TravelTimeCard extends ScopedRegistryHost(LitElement) {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    };
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
    const headerHeight = this.config && this.config.header ? 1 : 0;
    const tableHeight = this.config && this.config.entities.length ? 1 : 0;

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
      <ha-card class="travel-time-card">
        <style>
          ${TravelTimeCard.styles}
        </style>
        ${this.config.show_header ? this.renderHeader() : null}
        <div class="body">${this.renderBody()}</div>
      </ha-card>
    `;
  }

  renderHeader() {
    return html` <div class="header">${this.config.title}</div> `;
  }

  /**
   * generates the card body
   * @return {TemplateResult}
   */
  renderBody() {
    const body = this.config.entities.map(entity => {
      const entityName = entity.entity || entity;
      const entityState = this.hass.states[entityName];
      const { attributes } = entityState;

      const distance = getDistance(entityState, this.config, this.hass);
      const distanceMeasurement = getDistanceMeasurement(entityState, this.config, this.hass);

      return html`
        <tr class="pointer" @click=${() => openRoute(entityState)}>
          ${this.config.columns.includes('name')
            ? html`<td>${attributes.friendly_name || entityState.entity_id}</td>`
            : null}
          ${this.config.columns.includes('duration')
            ? html`<td>${parseInt(attributes.duration, 10)} ${attributes.unit_of_measurement}</td>`
            : null}
          ${this.config.columns.includes('distance') ? html`<td>${distance} ${distanceMeasurement}</td>` : null}
          ${this.config.columns.includes('route') ? html`<td>${attributes.route}</td>` : null}
        </tr>

        <tr></tr>
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
        <thead></thead>
      </thead>
    `;
  }
}

customElements.define('travel-time-card', TravelTimeCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'travel-time-card',
  name: 'Travel Time Card',
  description: 'Show Travel Times',
});
