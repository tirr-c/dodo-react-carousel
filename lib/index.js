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
function isStateStable(state) {
    return !state.transition && state.drag === null;
}
function wrapIndex(index, len) {
    if (len <= 0) {
        return 0;
    }
    while (index < 0) {
        index += len;
    }
    return index % len;
}
var Carousel = /** @class */ (function (_super) {
    __extends(Carousel, _super);
    function Carousel(props) {
        var _this = _super.call(this, props) || this;
        _this.carouselWindow = null;
        _this.carousel = null;
        _this.cachedWidth = null;
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
            e.target.addEventListener('touchmove', _this.touchMove);
            e.target.addEventListener('touchend', _this.touchEnd);
            e.target.addEventListener('touchcancel', _this.touchCancel);
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
            if (_this.state.drag === null) {
                return;
            }
            var touches = Array.from(e.changedTouches);
            for (var _i = 0, touches_2 = touches; _i < touches_2.length; _i++) {
                var touch = touches_2[_i];
                var id = touch.identifier;
                if (_this.state.drag.touch === id) {
                    _this.endDrag();
                    e.target.removeEventListener('touchmove', _this.touchMove);
                    e.target.removeEventListener('touchend', _this.touchEnd);
                    e.target.removeEventListener('touchcancel', _this.touchCancel);
                    return;
                }
            }
        };
        _this.touchCancel = function (e) {
            if (_this.state.drag === null) {
                return;
            }
            var touches = Array.from(e.changedTouches);
            for (var _i = 0, touches_3 = touches; _i < touches_3.length; _i++) {
                var touch = touches_3[_i];
                var id = touch.identifier;
                if (_this.state.drag.touch === id) {
                    _this.cancelDrag();
                    e.target.removeEventListener('touchmove', _this.touchMove);
                    e.target.removeEventListener('touchend', _this.touchEnd);
                    e.target.removeEventListener('touchcancel', _this.touchCancel);
                    return;
                }
            }
        };
        _this.processStable = function () {
            var idx = _this.state.targetIndex;
            _this.setState({
                currentIndex: idx,
                slideTo: null,
                transition: false,
            });
        };
        _this.state = {
            currentIndex: props.position,
            targetIndex: props.position,
            slideTo: null,
            transition: false,
            drag: null,
        };
        return _this;
    }
    Carousel.prototype.componentWillReceiveProps = function (props) {
        var len = props.children ? props.children.length : 0;
        var idx = wrapIndex(props.position, len);
        if (this.state.targetIndex !== idx && this.state.drag === null) {
            if (len > 0) {
                var distance = wrapIndex(idx - this.state.currentIndex, len);
                if (distance === 1) {
                    // slide to the right
                    this.slide('right');
                }
                else if (distance === len - 1) {
                    // slide to the left
                    this.slide('left');
                }
                else {
                    // more than one slide; move immediately
                    this.setState({
                        currentIndex: idx,
                        targetIndex: idx,
                        slideTo: null,
                        transition: false,
                    });
                }
            }
            else {
                this.setState({
                    currentIndex: idx,
                    targetIndex: idx,
                    slideTo: null,
                    transition: false,
                });
            }
        }
    };
    Carousel.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (prevState.targetIndex !== this.state.targetIndex) {
            if (this.props.onPositionChange != null) {
                this.props.onPositionChange(this.state.targetIndex);
            }
        }
        var isStableBefore = isStateStable(prevState);
        var isStableNow = isStateStable(this.state);
        if (isStableBefore !== isStableNow) {
            if (isStableNow && this.props.onStable != null) {
                this.props.onStable(this.state.currentIndex);
            }
            if (!isStableNow && this.props.onUnstable != null) {
                this.props.onUnstable();
            }
        }
    };
    Carousel.prototype.render = function () {
        var _this = this;
        var carouselClassList = classNames({
            'dodo-carousel': true,
            'dodo-transition-active': this.state.transition,
            'dodo-to-left': this.state.slideTo === 'left',
            'dodo-to-right': this.state.slideTo === 'right',
        });
        var duration = this.state.transition ? this.props.transitionDuration : '';
        var dragStyle = {
            left: '',
            transitionDuration: duration,
        };
        if (this.state.drag !== null) {
            var base = this.state.drag.base;
            dragStyle.left = (-base - this.dragDelta - 1) * 100 + "%";
        }
        return (React.createElement("div", { className: "dodo-carousel-window", onMouseDown: this.mouseDown, onMouseMove: this.mouseMove, onMouseUp: this.mouseUp, onMouseLeave: this.mouseLeave, onTouchStart: this.touchStart, ref: function (el) {
                _this.carouselWindow = el;
                _this.cachedWidth = el == null ? null : el.offsetWidth;
            } },
            React.createElement("div", { className: carouselClassList, style: dragStyle, onTransitionEnd: this.processStable, ref: function (el) { return _this.carousel = el; } }, this.displayItemList)));
    };
    Carousel.prototype.startDrag = function (x, touch) {
        var childrenCount = this.props.children ? this.props.children.length : 0;
        var base = this.currentSlidePos;
        var idx = this.state.currentIndex;
        if (base < -0.5) {
            idx--;
            base += 1;
        }
        else if (base > 0.5) {
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
    };
    Carousel.prototype.updateDrag = function (x) {
        if (this.state.drag === null) {
            return;
        }
        var childrenCount = this.props.children ? this.props.children.length : 0;
        var base = this.state.drag.base +
            this.parameterizedDragDelta(this.state.drag.start, x);
        var start = x;
        var flick = false;
        var idx = this.state.currentIndex;
        if (base < -0.5) {
            idx--;
            base += 1;
        }
        else if (base > 0.5) {
            idx++;
            base -= 1;
        }
        else {
            base = this.state.drag.base;
            start = this.state.drag.start;
            flick = true;
        }
        idx = wrapIndex(idx, childrenCount);
        this.setState({
            currentIndex: idx,
            targetIndex: idx,
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
        var threshold = this.props.threshold;
        if ((flick && delta < -threshold) || (!flick && pos < -0.5)) {
            this.slide('left');
        }
        else if ((flick && delta > threshold) || (!flick && pos > 0.5)) {
            this.slide('right');
        }
        var nextState = { drag: null, transition: false };
        if (pos !== 0) {
            nextState.transition = true;
        }
        this.setState(nextState);
        if (this.props.onDragEnd != null) {
            this.props.onDragEnd();
        }
    };
    Carousel.prototype.cancelDrag = function () {
        this.setState({ transition: true, drag: null });
        if (this.props.onDragEnd != null) {
            this.props.onDragEnd();
        }
    };
    Object.defineProperty(Carousel.prototype, "displayItemList", {
        get: function () {
            var children = this.props.children;
            var len = children ? children.length : 0;
            if (len <= 0) {
                return [];
            }
            var current = this.state.currentIndex;
            var idxs = [-1, 0, 1].map(function (idx) { return wrapIndex(idx + current, len); });
            // where copy should occur
            var copy;
            if (len === 1) {
                // second and third element are copied
                copy = [0, 1, 2];
            }
            else if (len === 2) {
                // the third element is copied
                copy = [0, 0, 1];
            }
            else {
                // none of the elements are copied
                copy = [0, 0, 0];
            }
            return idxs.map(function (idx, i) {
                var child = children[idx];
                // We should change the element's key if it is copied
                if (copy[i] !== 0 && child.key != null) {
                    var suffix = void 0;
                    if (copy[i] === 1) {
                        suffix = 'copy';
                    }
                    else {
                        suffix = "copy" + copy[i];
                    }
                    var newKey = child.key + "-" + suffix;
                    return React.cloneElement(child, { key: newKey });
                }
                return child;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Carousel.prototype, "carouselWindowWidth", {
        get: function () {
            if (this.props.dynamicSize) {
                if (this.carouselWindow === null) {
                    return 0;
                }
                return this.carouselWindow.offsetWidth;
            }
            return this.cachedWidth || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Carousel.prototype, "currentSlidePos", {
        get: function () {
            if (this.carouselWindow === null || this.carousel === null) {
                return 0;
            }
            var invertedPos = this.carousel.offsetLeft / this.carouselWindowWidth + 1;
            return -invertedPos;
        },
        enumerable: true,
        configurable: true
    });
    Carousel.prototype.parameterizedDragDelta = function (start, current) {
        if (this.carouselWindow === null) {
            return 0;
        }
        return -((current - start) / this.carouselWindowWidth);
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
    Carousel.defaultProps = {
        position: 0,
        threshold: 0.1,
        dynamicSize: false,
    };
    return Carousel;
}(React.Component));
exports.Carousel = Carousel;
//# sourceMappingURL=index.js.map