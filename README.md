# dodo-react-carousel

A simple React carousel component.

## How to install

```sh
yarn add @spoqa/react-carousel  # You can use `npm install --save`
```

## How to use

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { Carousel } from '@spoqa/react-carousel';
import '@spoqa/react-carousel/carousel.css'; // Bundle the CSS
import './main.css';

ReactDOM.render(
    <div className="carousel-container">
        <Carousel>
            <div>Content 1</div>
            <div>Content 2</div>
        </Carousel>
    </div>,
    document.getElementById('container')
);
```

`main.css`:

```css
.carousel-container {
    width: 400px;
    height: 300px;
}
```

Note that you should wrap the Carousel with an element that has width and
height.

---

[MIT] OR [Apache-2.0]. See [COPYRIGHT] for details.

[MIT]: LICENSE-MIT
[Apache-2.0]: LICENSE-APACHE
[COPYRIGHT]: COPYRIGHT
