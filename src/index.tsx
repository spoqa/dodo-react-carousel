import * as classNames from 'classnames';
import * as React from 'react';


interface Props {
    children?: any;
    position: number;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onPositionChange?: (position: number) => void;
    onUnstable?: () => void;
    onStable?: (position: number) => void;
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


function isStateStable(state: State) {
    return !state.transition && state.drag === null;
}

function wrapIndex(index: number, len: number) {
    if (len <= 0) {
        return 0;
    }
    while (index < 0) {
        index += len;
    }
    return index % len;
}

export class Carousel extends React.Component<Props, State> {
    public static defaultProps: Partial<Props> = {
        position: 0,
    };

    private carouselWindow: HTMLElement | null = null;
    private carousel: HTMLElement | null = null;


    constructor(props: Props) {
        super(props);

        this.state = {
            currentIndex: props.position,
            targetIndex: props.position,
            slideTo: null,
            transition: false,
            drag: null,
        };
    }

    public componentWillReceiveProps(props: Props) {
        const len = props.children ? props.children.length : 0;
        const idx = wrapIndex(props.position, len);
        if (this.state.targetIndex !== idx && this.state.drag === null) {
            if (len > 0) {
                let distance = wrapIndex(idx - this.state.currentIndex, len);
                if (distance === 1) {
                    // slide to the right
                    this.slide('right');
                } else if (distance === len - 1) {
                    // slide to the left
                    this.slide('left');
                } else {
                    // more than one slide; move immediately
                    this.setState({
                        currentIndex: idx,
                        targetIndex: idx,
                        slideTo: null,
                        transition: false,
                    });
                }
            } else {
                this.setState({
                    currentIndex: idx,
                    targetIndex: idx,
                    slideTo: null,
                    transition: false,
                });
            }
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevState.targetIndex !== this.state.targetIndex) {
            if (this.props.onPositionChange != null) {
                this.props.onPositionChange(this.state.targetIndex);
            }
        }
        const isStableBefore = isStateStable(prevState);
        const isStableNow = isStateStable(this.state);
        if (isStableBefore !== isStableNow) {
            if (isStableNow && this.props.onStable != null) {
                this.props.onStable(this.state.currentIndex);
            }
            if (!isStableNow && this.props.onUnstable != null) {
                this.props.onUnstable();
            }
        }
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
        const childrenCount =
            this.props.children ? this.props.children.length : 0;
        let base = this.currentSlidePos;
        let idx = this.state.currentIndex;
        if (base < -0.5) {
            idx--;
            base += 1;
        } else if (base > 0.5) {
            idx++;
            base -= 1;
        }
        idx = wrapIndex(idx, childrenCount);
        this.setState({
            currentIndex: idx,
            targetIndex: idx,
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
        if (this.props.onDragStart != null) {
            this.props.onDragStart();
        }
    }

    private updateDrag(x: number) {
        if (this.state.drag === null) {
            return;
        }
        const childrenCount =
            this.props.children ? this.props.children.length : 0;
        let base =
            this.state.drag.base +
            this.parameterizedDragDelta(this.state.drag.start, x);
        let start = x;
        let flick = false;
        let idx = this.state.currentIndex;
        if (base < -0.5) {
            idx--;
            base += 1;
        } else if (base > 0.5) {
            idx++;
            base -= 1;
        } else {
            base = this.state.drag.base;
            start = this.state.drag.start;
            flick = true;
        }
        idx = wrapIndex(idx, childrenCount);
        this.setState({
            currentIndex: idx,
            targetIndex: idx,
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
        this.setState({ drag: null });
        if (pos !== 0) {
            this.setState({ transition: true });
        }
        if (this.props.onDragEnd != null) {
            this.props.onDragEnd();
        }
    }

    private cancelDrag() {
        this.setState({ transition: true, drag: null });
        if (this.props.onDragEnd != null) {
            this.props.onDragEnd();
        }
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
        const idx = this.state.targetIndex;
        this.setState({
            currentIndex: idx,
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
