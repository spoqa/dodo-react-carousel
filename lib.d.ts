import { Component } from 'react';

interface Props {
    position: number;
    onDragStart: () => void;
    onDragEnd: () => void;
    onPositionChange: (position: number) => void;
    onUnstable: () => void;
    onStable: (position: number) => void;
}

declare class Carousel extends Component<Partial<Props>> {}
