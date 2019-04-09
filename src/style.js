import { css } from 'lit-element';

const style = css`
    .github-card {
        display: flex;
        padding: 0 16px 4px;
        flex-direction: column;
    }

    .github-card .header {
        font-family: var(--paper-font-headline_-_font-family);
        -webkit-font-smoothing: var(--paper-font-headline_-_-webkit-font-smoothing);
        font-size: var(--paper-font-headline_-_font-size);
        font-weight: var(--paper-font-headline_-_font-weight);
        letter-spacing: var(--paper-font-headline_-_letter-spacing);
        line-height: var(--paper-font-headline_-_line-height);
        text-rendering: var(--paper-font-common-expensive-kerning_-_text-rendering);
        opacity: var(--dark-primary-opacity);
        padding: 24px 0px 0px;    
    }

    .github-card__body {
        margin-bottom: 10px;
        margin-top: 10px;
    }

    .github-card__body .issue {
        display:flex;
        justify-content: space-between;
        padding-top: 5px;
        padding-bottom: 5px;
    }
    
    .github-card__body .issue .name {
        min-width: 40%;
        word-break: break-all;
    }

    .github-card__body .issue .name .property {
        display:flex;
        font-size: 1.1em;
        cursor: pointer;
    }

    .github-card__body .issue .name .property .issue-name {
        padding-left: 5px;
        padding-top: 2px;
    }

    .github-card__body .issue .links {
        display:flex;
        justify-content: flex-end;
        padding-left: 5px;
        min-width: 50%;
        max-width: 200px;
    }
    
    .github-card__body .links .property {
        display:flex;
        cursor: pointer;
        flex-direction: column;
        padding-right: 5px;
    }

    .github-card__body .links .property:last-child {
        padding-right: 0px;
    }

    .github-card__body .links .property .hidden {
        display:none;
    }

    .github-card__body .links .property > span {
        padding-bottom: 5px;
    }

    .github-card__body ha-icon {
        color: var(--primary-color);
        font-size: 1.2em;
    }
`;

export default style;
