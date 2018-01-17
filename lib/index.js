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
        _this.startDrag = function (e) {
            e.preventDefault();
            if (_this.state.drag !== null) {
                // console.error('this.state.drag is not null when mouse goes down');
            }
            var base = _this.currentSlidePos;
            if (base < -0.5) {
                base += 1;
                _this.setState({ currentIndex: _this.state.currentIndex - 1 });
            }
            else if (base > 0.5) {
                base -= 1;
                _this.setState({ currentIndex: _this.state.currentIndex + 1 });
            }
            _this.setState({
                slideTo: null,
                transition: false,
                drag: {
                    base: base,
                    start: e.clientX,
                    current: e.clientX,
                },
            });
        };
        _this.updateDrag = function (e) {
            e.preventDefault();
            if (_this.state.drag === null) {
                return;
            }
            _this.setState({ drag: __assign({}, _this.state.drag, { current: e.clientX }) });
        };
        _this.endDrag = function (e) {
            e.preventDefault();
            if (_this.state.drag === null) {
                // console.error('this.state.drag is null when mouse goes up');
                return;
            }
            if (_this.dragDelta < -0.2) {
                _this.slide('left');
            }
            else if (_this.dragDelta > 0.2) {
                _this.slide('right');
            }
            _this.setState({ transition: true, drag: null });
        };
        _this.mouseLeave = function (e) {
            e.preventDefault();
            if (_this.state.drag === null) {
                return;
            }
            if (_this.dragDelta < -0.2) {
                _this.slide('left');
            }
            else if (_this.dragDelta > 0.2) {
                _this.slide('right');
            }
            _this.setState({ transition: true, drag: null });
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
        return (React.createElement("div", { className: "dodo-carousel-window", onMouseDown: this.startDrag, onMouseMove: this.updateDrag, onMouseUp: this.endDrag, onMouseLeave: this.mouseLeave, ref: function (el) { return _this.carouselWindow = el; } },
            React.createElement("div", { className: carouselClassList, style: dragStyle, onTransitionEnd: this.processStable, ref: function (el) { return _this.carousel = el; } }, this.displayItemList)));
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
    Object.defineProperty(Carousel.prototype, "dragDelta", {
        get: function () {
            if (this.carouselWindow === null || this.state.drag === null) {
                return 0;
            }
            var _a = this.state.drag, start = _a.start, current = _a.current;
            return -((current - start) / this.carouselWindow.offsetWidth);
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