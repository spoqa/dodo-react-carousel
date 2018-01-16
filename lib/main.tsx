import * as React from 'react';

import { carousel, carouselWindow } from './carousel.css';

export class Carousel extends React.Component {
    render() {
        return (
            <div className={carouselWindow}>
                <div className={carousel}>
                    <div>
                        Hello, world!
                    </div>
                    <div>
                        Hello, world (2)!
                    </div>
                </div>
            </div>
        );
    }
}
