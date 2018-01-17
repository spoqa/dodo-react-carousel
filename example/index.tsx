import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Carousel from '../lib';
import { container } from './index.css';

const content = document.getElementById('content');
ReactDOM.render(
    <div className={container}>
        <Carousel>
            <div>
                Hello, world!
            </div>
            <div>
                Hello, world (2)!
            </div>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nam fermentum, eros vel posuere malesuada, diam.
            </div>
            <div>
                In ultrices porta sapien, nec blandit est semper a.
                Etiam in gravida enim. Fusce vitae.
            </div>
        </Carousel>
    </div>,
    content
);
