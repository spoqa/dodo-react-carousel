"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var classNames = require("classnames");
var React = require("react");
var Carousel = /** @class */ (function (_super) {
    __extends(Carousel, _super);
    function Carousel(props) {
        var _this = _super.call(this, props) || this;
        _this.carouselWindow = null;
        _this.carousel = null;
        _this.mouseDown = function (e) {
            e.preventDefault();
            _this.startDrag(e.clientX, null);
        };
        _this.mouseMove = function (e) {
            e.preventDefault();
            if (_this.state.drag === null) {
                return;
            }
            if (_this.state.drag.touch !== null) {
                return;
            }
            _this.updateDrag(e.clientX);
        };
        _this.mouseUp = function (e) {
            e.preventDefault();
            if (_this.state.drag === null) {
                return;
            }
            if (_this.state.drag.touch !== null) {
                return;
            }
            _this.endDrag();
        };
        _this.mouseLeave = function (e) {
            e.preventDefault();
            if (_this.state.drag === null) {
                return;
            }
            _this.endDrag();
        };
        _this.touchStart = function (e) {
            var touches = e.changedTouches;
            var touch = touches[0];
            var clientX = touch.clientX, id = touch.identifier;
            if (_this.state.drag !== null && _this.state.drag.touch !== id) {
                return;
            }
            _this.startDrag(clientX, id);
        };
        _this.touchMove = function (e) {
            if (_this.state.drag === null) {
                return;
            }
            var touches = Array.from(e.changedTouches);
            for (var _i = 0, touches_1 = touches; _i < touches_1.length; _i++) {
                var touch = touches_1[_i];
                var clientX = touch.clientX, id = touch.identifier;
                if (_this.state.drag.touch === id) {
                    _this.updateDrag(clientX);
                    return;
                }
            }
        };
        _this.touchEnd = function (e) {
            e.preventDefault();
            if (_this.state.drag === null) {
                return;
            }
            var touches = Array.from(e.changedTouches);
            for (var _i = 0, touches_2 = touches; _i < touches_2.length; _i++) {
                var touch = touches_2[_i];
                var id = touch.identifier;
                if (_this.state.drag.touch === id) {
                    _this.endDrag();
                    return;
                }
            }
        };
        _this.touchCancel = function (e) {
            e.preventDefault();
            if (_this.state.drag === null) {
                return;
            }
            var touches = Array.from(e.changedTouches);
            for (var _i = 0, touches_3 = touches; _i < touches_3.length; _i++) {
                var touch = touches_3[_i];
                var id = touch.identifier;
                if (_this.state.drag.touch === id) {
                    _this.cancelDrag();
                    return;
                }
            }
        };
        _this.processStable = function () {
            _this.setState({
                currentIndex: _this.state.targetIndex,
                slideTo: null,
                transition: false,
            });
        };
        _this.state = {
            currentIndex: 0,
            targetIndex: 0,
            slideTo: null,
            transition: false,
            drag: null,
        };
        return _this;
    }
    Carousel.prototype.render = function () {
        var _this = this;
        var carouselClassList = classNames({
            'dodo-carousel': true,
            'dodo-transition-active': this.state.transition,
            'dodo-to-left': this.state.slideTo === 'left',
            'dodo-to-right': this.state.slideTo === 'right',
        });
        var dragStyle = {};
        if (this.state.drag !== null) {
            var base = this.state.drag.base;
            dragStyle.left = (-base - this.dragDelta - 2) * 100 + "%";
        }
        return (React.createElement("div", { className: "dodo-carousel-window", onMouseDown: this.mouseDown, onMouseMove: this.mouseMove, onMouseUp: this.mouseUp, onMouseLeave: this.mouseLeave, onTouchStart: this.touchStart, onTouchMove: this.touchMove, onTouchEnd: this.touchEnd, onTouchCancel: this.touchCancel, ref: function (el) { return _this.carouselWindow = el; } },
            React.createElement("div", { className: carouselClassList, style: dragStyle, onTransitionEnd: this.processStable, ref: function (el) { return _this.carousel = el; } }, this.displayItemList)));
    };
    Carousel.prototype.startDrag = function (x, touch) {
        var base = this.currentSlidePos;
        if (base < -0.5) {
            var idx = this.state.currentIndex - 1;
            base += 1;
            this.setState({ currentIndex: idx, targetIndex: idx });
        }
        else if (base > 0.5) {
            var idx = this.state.currentIndex + 1;
            base -= 1;
            this.setState({ currentIndex: idx, targetIndex: idx });
        }
        else {
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
    };
    Carousel.prototype.updateDrag = function (x) {
        if (this.state.drag === null) {
            return;
        }
        var base = this.state.drag.base +
            this.parameterizedDragDelta(this.state.drag.start, x);
        var start = x;
        var flick = false;
        if (base < -0.5) {
            var idx = this.state.currentIndex - 1;
            base += 1;
            this.setState({ currentIndex: idx, targetIndex: idx });
        }
        else if (base > 0.5) {
            var idx = this.state.currentIndex + 1;
            base -= 1;
            this.setState({ currentIndex: idx, targetIndex: idx });
        }
        else {
            base = this.state.drag.base;
            start = this.state.drag.start;
            flick = true;
        }
        this.setState({
            drag: __assign({}, this.state.drag, { base: base, start: start, current: x, flick: this.state.drag.flick && flick }),
        });
    };
    Carousel.prototype.endDrag = function () {
        if (this.state.drag === null) {
            return;
        }
        var delta = this.dragDelta;
        var pos = this.currentSlidePos;
        var flick = this.state.drag.flick;
        if ((flick && delta < -0.2) || (!flick && pos < -0.5)) {
            this.slide('left');
        }
        else if ((flick && delta > 0.2) || (!flick && pos > 0.5)) {
            this.slide('right');
        }
        this.setState({ transition: true, drag: null });
    };
    Carousel.prototype.cancelDrag = function () {
        this.setState({ transition: true, drag: null });
    };
    Object.defineProperty(Carousel.prototype, "displayItemList", {
        get: function () {
            var children = this.props.children;
            var len = children ? children.length : 0;
            if (len <= 0) {
                return [];
            }
            var current = this.state.currentIndex;
            var idxs = new Array(5)
                .fill(0)
                .map(function (_, i) { return i - 2 + current; })
                .map(function (idx) {
                while (idx < 0) {
                    idx += len;
                }
                while (idx >= len) {
                    idx -= len;
                }
                return idx;
            });
            return idxs.map(function (idx) { return children[idx]; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Carousel.prototype, "currentSlidePos", {
        get: function () {
            if (this.carouselWindow === null || this.carousel === null) {
                return 0;
            }
            var invertedPos = this.carousel.offsetLeft / this.carouselWindow.offsetWidth + 2;
            return -invertedPos;
        },
        enumerable: true,
        configurable: true
    });
    Carousel.prototype.parameterizedDragDelta = function (start, current) {
        if (this.carouselWindow === null) {
            return 0;
        }
        return -((current - start) / this.carouselWindow.offsetWidth);
    };
    Object.defineProperty(Carousel.prototype, "dragDelta", {
        get: function () {
            if (this.state.drag === null) {
                return 0;
            }
            var _a = this.state.drag, start = _a.start, current = _a.current;
            return this.parameterizedDragDelta(start, current);
        },
        enumerable: true,
        configurable: true
    });
    Carousel.prototype.slide = function (to) {
        var children = this.props.children;
        var len = children ? children.length : 0;
        var newIndex = this.state.currentIndex;
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
    };
    return Carousel;
}(React.Component));
exports.Carousel = Carousel;
//# sourceMappingURL=index.js.map