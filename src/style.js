import { css } from 'lit';

const style = css`
    .travel-time-card {
        display: flex;
        padding: 0 16px 4px;
        flex-direction: column;
    }

    .travel-time-card .header {
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

    .travel-time-card .body {
        margin-bottom: 10px;
        margin-top: 10px;
    }

    .travel-time-card .body table {

    }

    .travel-time-card .body table th,
    .travel-time-card .body table td {
        padding: 10px 10px 10px 10px;
    }

    .travel-time-card .body table thead {
        text-align: left;
    }

    .travel-time-card .body table tbody {
        text-align: left;
    }

    .pointer {
        cursor: pointer; 
    }
`;

export default style;
