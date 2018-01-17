import * as React from 'react';
import * as classNames from 'classnames';

import {
    carousel,
    carouselWindow,
    transitionActive,
    toLeft,
    toRight,
} from './carousel.css';


interface Props {
    children?: any;
}

interface DragState {
    base: number;
    start: number;
    current: number;
}

interface State {
    currentIndex: number;
    targetIndex: number;
    slideTo: 'left' | 'right' | null;
    transition: boolean;
    drag: DragState | null;
}


export default class Carousel extends React.Component<Props, State> {
    carouselWindow: HTMLElement | null = null;
    carousel: HTMLElement | null = null;

    startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (this.state.drag !== null) {
            console.error('this.state.drag is not null when mouse goes down');
        }
        let base = this.currentSlidePos;
        if (base < -0.5) {
            base += 1;
            this.setState({ currentIndex: this.state.currentIndex - 1 });
        } else if (base > 0.5) {
            base -= 1;
            this.setState({ currentIndex: this.state.currentIndex + 1 });
        }
        this.setState({
            slideTo: null,
            transition: false,
            drag: {
                base: base,
                start: e.clientX,
                current: e.clientX,
            }
        });
    };

    updateDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (this.state.drag === null) {
            return;
        }
        this.setState({ drag: { ...this.state.drag, current: e.clientX } });
    };

    endDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (this.state.drag === null) {
            console.error('this.state.drag is null when mouse goes up');
            return;
        }
        if (this.dragDelta < -0.2) {
            this.slide('left');
        } else if (this.dragDelta > 0.2) {
            this.slide('right');
        }
        this.setState({ transition: true, drag: null });
    };

    mouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (this.state.drag === null) {
            return;
        }
        if (this.dragDelta < -0.2) {
            this.slide('left');
        } else if (this.dragDelta > 0.2) {
            this.slide('right');
        }
        this.setState({ transition: true, drag: null });
    };

    processStable = () => {
        this.setState({
            currentIndex: this.state.targetIndex,
            slideTo: null,
            transition: false,
        });
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            currentIndex: 0,
            targetIndex: 0,
            slideTo: null,
            transition: false,
            drag: null,
        };
    }

    get displayItemList() {
        const { children } = this.props;
        const len = children ? children.length : 0;
        if (len <= 0) {
            return [];
        }

        const current = this.state.currentIndex;
        const idxs = new Array(5)
            .fill(0)
            .map((_, i) => i - 2 + current)
            .map(idx => {
                while (idx < 0) {
                    idx += len;
                }
                while (idx >= len) {
                    idx -= len;
                }
                return idx;
            });
        return idxs.map(idx => children[idx]);
    }

    get currentSlidePos() {
        if (this.carouselWindow === null || this.carousel === null) {
            return 0;
        }
        const invertedPos =
            this.carousel.offsetLeft / this.carouselWindow.offsetWidth + 2;
        return -invertedPos;
    }

    get dragDelta() {
        if (this.carouselWindow === null || this.state.drag === null) {
            return 0;
        }
        const { start, current } = this.state.drag;
        return -((current - start) / this.carouselWindow.offsetWidth);
    }

    slide(to: 'left' | 'right') {
        const { children } = this.props;
        const len = children ? children.length : 0;
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
        this.setState({
            targetIndex: newIndex,
            slideTo: to,
            transition: true,
        });
    }

    render() {
        const carouselClassList = classNames({
            [carousel]: true,
            [transitionActive]: this.state.transition,
            [toLeft]: this.state.slideTo === 'left',
            [toRight]: this.state.slideTo === 'right',
        });
        const dragStyle: { left?: string } = {};
        if (this.state.drag !== null) {
            const { base } = this.state.drag;
            dragStyle.left = `${(-base - this.dragDelta - 2) * 100}%`;
        }

        return (
            <div className={carouselWindow}
                 onMouseDown={this.startDrag}
                 onMouseMove={this.updateDrag}
                 onMouseUp={this.endDrag}
                 onMouseLeave={this.mouseLeave}
                 ref={el => this.carouselWindow = el}>
                <div className={carouselClassList}
                     style={dragStyle}
                     onTransitionEnd={this.processStable}
                     ref={el => this.carousel = el}>
                    {this.displayItemList}
                </div>
            </div>
        );
    }
}
