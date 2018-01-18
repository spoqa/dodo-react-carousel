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

## Props

* `position`: Sets which slide will be shown. If this is one of the adjacent
  slides of the current slide, transition will occur.
* `threshold`: Sets flick threshold.
* `transitionDuration`: Sets the duration of transition, as of
  `transition-duration` CSS property.

## Events

* `onDragStart`: Fires when the user clicks or touches the carousel.
* `onDragEnd`: Fires when the user releases the carousel.
* `onPositionChange`: Fires whenever the current slide changes. Current slide
  index will be passed.
* `onUnstable`: Fires when the carousel is moving.
* `onStable`: Fires when the carousel finishes transition. Current slide index
  will be passed.

---

[MIT] OR [Apache-2.0]. See [COPYRIGHT] for details.

[MIT]: LICENSE-MIT
[Apache-2.0]: LICENSE-APACHE
[COPYRIGHT]: COPYRIGHT
