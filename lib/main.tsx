import * as React from 'react';
import classNames = require('classnames');

import { carousel, carouselWindow, transitionActive, toLeft, toRight } from './carousel.css';

interface DragState {
    base: number;
    start: number;
    current: number;
}
interface State {
    currentIndex: number;
    targetIndex: number;
    slideTo: 'left' | 'right' | null;
    drag: DragState | null;
}

export class Carousel extends React.Component<{}, State> {
    carouselWindow: HTMLElement | null = null;
    carousel: HTMLElement | null = null;
    startDrag = (e) => {
        e.preventDefault();
        if (this.state.drag !== null) {
            console.error('this.state.drag is not null when mouse goes down');
        }
        this.setState({
            drag: {
                base: this.currentSlidePos,
                start: e.clientX,
                current: e.clientX,
            }
        });
    };
    updateDrag = (e) => {
        e.preventDefault();
        if (this.state.drag === null) {
            return;
        }
        this.setState({ drag: { ...this.state.drag, current: e.clientX } });
    };
    endDrag = (e) => {
        e.preventDefault();
        if (this.state.drag === null) {
            console.error('this.state.drag is null when mouse goes up');
            return;
        }
        if (this.dragDelta > 0.2) {
            this.slide('left');
        } else if (this.dragDelta < -0.2) {
            this.slide('right');
        }
        this.setState({ drag: null });
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
            drag: null,
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

    get currentSlidePos() {
        if (this.carouselWindow === null || this.carousel === null) {
            return 0;
        }
        return this.carousel.offsetLeft / this.carouselWindow.offsetWidth + 1;
    }

    get dragDelta() {
        if (this.carouselWindow === null || this.state.drag === null) {
            return 0;
        }
        const { start, current } = this.state.drag;
        return (current - start) / this.carouselWindow.offsetWidth;
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
        const dragStyle = {};
        if (this.state.drag !== null) {
            const { base } = this.state.drag;
            dragStyle.left = `${(base + this.dragDelta - 1) * 100}%`;
        }

        return (
            <div className={carouselWindow}
                 ref={el => { this.carouselWindow = el; }}>
                <div className={carouselClassList}
                     style={dragStyle}
                     onMouseDown={this.startDrag}
                     onMouseMove={this.updateDrag}
                     onMouseUp={this.endDrag}
                     onTransitionEnd={this.recalculate}
                     ref={el => { this.carousel = el; }}>
                    {this.displayItemList}
                </div>
            </div>
        );
    }
}
