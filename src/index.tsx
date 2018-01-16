import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Carousel } from '../lib/main';
import { container } from './index.css';

const content = document.getElementById('content');
ReactDOM.render(
    <div className={container}>
        <Carousel />
    </div>,
    content
);
