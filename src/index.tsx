import * as classNames from 'classnames';
import * as React from 'react';


interface Props {
    children?: any;
}

interface DragState {
    touch: any;
    base: number;
    start: number;
    current: number;
    flick: boolean;
}

interface State {
    currentIndex: number;
    targetIndex: number;
    slideTo: 'left' | 'right' | null;
    transition: boolean;
    drag: DragState | null;
}


export class Carousel extends React.Component<Props, State> {
    private carouselWindow: HTMLElement | null = null;
    private carousel: HTMLElement | null = null;


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

    public render() {
        const carouselClassList = classNames({
            'dodo-carousel': true,
            'dodo-transition-active': this.state.transition,
            'dodo-to-left': this.state.slideTo === 'left',
            'dodo-to-right': this.state.slideTo === 'right',
        });
        const dragStyle: { left?: string } = {};
        if (this.state.drag !== null) {
            const { base } = this.state.drag;
            dragStyle.left = `${(-base - this.dragDelta - 2) * 100}%`;
        }

        return (
            <div className="dodo-carousel-window"
                 onMouseDown={this.mouseDown}
                 onMouseMove={this.mouseMove}
                 onMouseUp={this.mouseUp}
                 onMouseLeave={this.mouseLeave}
                 onTouchStart={this.touchStart}
                 onTouchMove={this.touchMove}
                 onTouchEnd={this.touchEnd}
                 onTouchCancel={this.touchCancel}
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


    private startDrag(x: number, touch: any) {
        let base = this.currentSlidePos;
        if (base < -0.5) {
            const idx = this.state.currentIndex - 1;
            base += 1;
            this.setState({ currentIndex: idx, targetIndex: idx });
        } else if (base > 0.5) {
            const idx = this.state.currentIndex + 1;
            base -= 1;
            this.setState({ currentIndex: idx, targetIndex: idx });
        } else {
            this.setState({ targetIndex: this.state.currentIndex });
        }
        this.setState({
            slideTo: null,
            transition: false,
            drag: {
                touch: touch,
                base: base,
                start: x,
                current: x,
                flick: true,
            },
        });
    }

    private updateDrag(x: number) {
        if (this.state.drag === null) {
            return;
        }
        let base =
            this.state.drag.base +
            this.parameterizedDragDelta(this.state.drag.start, x);
        let start = x;
        let flick = false;
        if (base < -0.5) {
            const idx = this.state.currentIndex - 1;
            base += 1;
            this.setState({ currentIndex: idx, targetIndex: idx });
        } else if (base > 0.5) {
            const idx = this.state.currentIndex + 1;
            base -= 1;
            this.setState({ currentIndex: idx, targetIndex: idx });
        } else {
            base = this.state.drag.base;
            start = this.state.drag.start;
            flick = true;
        }
        this.setState({
            drag: {
                ...this.state.drag,
                base: base,
                start: start,
                current: x,
                flick: this.state.drag.flick && flick,
            },
        });
    }

    private endDrag() {
        if (this.state.drag === null) {
            return;
        }
        const delta = this.dragDelta;
        const pos = this.currentSlidePos;
        const { flick } = this.state.drag;
        if ((flick && delta < -0.2) || (!flick && pos < -0.5)) {
            this.slide('left');
        } else if ((flick && delta > 0.2) || (!flick && pos > 0.5)) {
            this.slide('right');
        }
        this.setState({ transition: true, drag: null });
    }

    private cancelDrag() {
        this.setState({ transition: true, drag: null });
    }

    private mouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        this.startDrag(e.clientX, null);
    };

    private mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (this.state.drag === null) {
            return;
        }
        if (this.state.drag.touch !== null) {
            return;
        }
        this.updateDrag(e.clientX);
    };

    private mouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (this.state.drag === null) {
            return;
        }
        if (this.state.drag.touch !== null) {
            return;
        }
        this.endDrag();
    };

    private mouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (this.state.drag === null) {
            return;
        }
        this.endDrag();
    };

    private touchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touches = e.changedTouches;
        const touch = touches[0];
        const { clientX, identifier: id } = touch;
        if (this.state.drag !== null && this.state.drag.touch !== id) {
            return;
        }
        this.startDrag(clientX, id);
    };

    private touchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (this.state.drag === null) {
            return;
        }

        const touches = Array.from(e.changedTouches);
        for (const touch of touches) {
            const { clientX, identifier: id } = touch;
            if (this.state.drag.touch === id) {
                this.updateDrag(clientX);
                return;
            }
        }
    };

    private touchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (this.state.drag === null) {
            return;
        }

        const touches = Array.from(e.changedTouches);
        for (const touch of touches) {
            const { identifier: id } = touch;
            if (this.state.drag.touch === id) {
                this.endDrag();
                return;
            }
        }
    };

    private touchCancel = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (this.state.drag === null) {
            return;
        }

        const touches = Array.from(e.changedTouches);
        for (const touch of touches) {
            const { identifier: id } = touch;
            if (this.state.drag.touch === id) {
                this.cancelDrag();
                return;
            }
        }
    };

    private processStable = () => {
        this.setState({
            currentIndex: this.state.targetIndex,
            slideTo: null,
            transition: false,
        });
    };

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

    private parameterizedDragDelta(start: number, current: number) {
        if (this.carouselWindow === null) {
            return 0;
        }
        return -((current - start) / this.carouselWindow.offsetWidth);
    }

    get dragDelta() {
        if (this.state.drag === null) {
            return 0;
        }
        const { start, current } = this.state.drag;
        return this.parameterizedDragDelta(start, current);
    }

    private slide(to: 'left' | 'right') {
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
        if (newIndex < 0) {
            newIndex += len;
        }
        if (newIndex >= len) {
            newIndex -= len;
        }
        this.setState({
            targetIndex: newIndex,
            slideTo: to,
            transition: true,
        });
    }
}
