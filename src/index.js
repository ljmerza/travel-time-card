import '@babel/polyfill';

import { LitElement, html } from 'lit-element';
import style from './style';

import GithubCardEditor from './index-editor';
customElements.define('github-card-editor', GithubCardEditor);


class GithubCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    };
  }

  constructor() {
    super();
    this.githubBaseUrl = 'https://github.com';
  }

  static async getConfigElement() {
    return document.createElement("github-card-editor");
  }

  setConfig(config) {
    if (!config.entities) throw Error('entities required.');
    
    this.config = {
      title: 'Github',
      show_extended: true,
      ...config,
    };
  }

  /**
   * get the current size of the card
   * @return {Number}
   */
  getCardSize() {
    const baseSize = 3.5;
    const reposSize = this.config.entites * (this.config.show_extended ? 2 : 1);
    return Math.round(baseSize * reposSize);
  }

  static get styles() {
    return style;
  }

  /**
   * generates the card HTML
   * @return {TemplateResult}
   */
  render() {
    const github = this.issues.map(issue => html`
        <div class='issue'>
          <div class="name">
            <span class='property' @click=${() => this.openLink(`${issue.attributes.path}`)}  title='Open repository'>
              <ha-icon icon="${issue.attributes.icon}"></ha-icon>
              <span class='issue-name'>${issue.attributes.name}</span>
            </span>
          </div>

          <div></div>

          <div class="links">
            <div class='property'>
              <span @click=${() => this.openLink(`${issue.attributes.path}/issues`)} title='Open issues'>
                <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                <span>${issue.attributes.open_issues}</span>
              </span>
              <span 
                class='${this.config.show_extended ? '' : 'hidden'}' 
                @click=${() => this.openLink(`${issue.attributes.path}/releases`)} 
                title='Open releases'
              >
                <ha-icon icon="mdi:tag-outline"></ha-icon>
              </span>
            </div>

            <div class='property'>
              <span @click=${() => this.openLink(`${issue.attributes.path}/pulls`)} title='Open pull requests'>
                <ha-icon icon="mdi:source-pull"></ha-icon>
                <span>${issue.attributes.open_pull_requests}</span>
              </span>
              <span 
                class='${this.config.show_extended ? '' : 'hidden'}' 
                @click=${() => this.openLink(`${issue.attributes.path}/network/members`)} 
                title='Open forks'
              >
                <ha-icon icon="mdi:source-fork"></ha-icon>
              </span>
            </div>

            <div class='property'>
              <span @click=${() => this.openLink(`${issue.attributes.path}/stargazers`)} title='Open stargazers'>
                <ha-icon icon="mdi:star"></ha-icon>
                <span>${issue.attributes.stargazers}</span>
              </span>
              <span 
                class='${this.config.show_extended ? '' : 'hidden'}' 
                @click=${() => this.openLink(`${issue.attributes.path}/commits`)} 
                title='Open commits'
              >
                <ha-icon icon="mdi:clock-outline"></ha-icon>
              </span>
            </div>

          </div>
        </div>
      `);

    return html`
      <ha-card class='github-card'>
        <style>${GithubCard.styles}</style>
        <div class='header'>
          ${this.config.title}
        </div>
        <div class='github-card__body'>
          ${github}
        </div>
      </ha-card>
    `;
  }

  /**
   * open a link in github
   * @param {string} link
   */
  openLink(link) {
    window.open(`${this.githubBaseUrl}/${link}`);
  }

  /**
   * get amtching issue sensors
   */
  get issues() {
    return this.config.entities
      .map(entity => this.hass.states[entity])
      .filter(issue => issue);
  }
}

customElements.define('github-card', GithubCard);
