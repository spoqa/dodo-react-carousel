import * as React from 'react';
import classNames = require('classnames');

import { carousel, carouselWindow, transitionActive, toLeft, toRight } from './carousel.css';

interface State {
    currentIndex: number;
    targetIndex: number;
    slideTo: 'left' | 'right' | null;
}

export class Carousel extends React.Component<{}, State> {
    carouselWindow: HTMLElement | null = null;
    carousel: HTMLElement | null = null;
    intercept = (e) => {
        console.log(this.carouselWindow.offsetWidth);
        console.log(this.carousel.offsetLeft);
    };
    recalculate = (e) => {
        this.setState({ currentIndex: this.state.targetIndex, slideTo: null });
    };

    constructor(props) {
        super(props);

        this.state = {
            currentIndex: 0,
            targetIndex: 0,
            slideTo: null,
        };
    }

    get displayItemList() {
        const len = this.props.children.length;

        const current = this.state.currentIndex;
        const left = current - 1;
        const right = current + 1;

        const idx = [
            left < 0 ? left+len : left,
            current,
            right >= len ? right-len : right,
        ];

        return idx.map(x => this.props.children[x]);
    }

    slide(to: 'left' | 'right') {
        const len = this.props.children.length;
        let newIndex = this.state.currentIndex;
        switch (to) {
            case 'left':
                newIndex--;
                break;
            case 'right':
                newIndex++;
                break;
        }
        if (newIndex < 0) newIndex += len;
        if (newIndex >= len) newIndex -= len;
        this.setState({ targetIndex: newIndex, slideTo: to });
    }

    render() {
        const animationInProgress = this.state.currentIndex !== this.state.targetIndex;
        const carouselClassList = classNames({
            [carousel]: true,
            [transitionActive]: animationInProgress,
            [toLeft]: animationInProgress && this.state.slideTo === 'left',
            [toRight]: animationInProgress && this.state.slideTo === 'right',
        });

        return (
            <div className={carouselWindow}
                 ref={el => { this.carouselWindow = el; }}>
                <div className={carouselClassList}
                     onMouseDown={this.intercept}
                     onTransitionEnd={this.recalculate}
                     ref={el => { this.carousel = el; }}>
                    {this.displayItemList}
                </div>
            </div>
        );
    }
}
