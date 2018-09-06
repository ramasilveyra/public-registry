function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

import React from 'react';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'exenv';
import Animate from 'react-move/Animate';
import * as easing from 'd3-ease';
import { PagingDots, PreviousButton, NextButton } from './default-controls';
import Transitions from './all-transitions';

var addEvent = function addEvent(elem, type, eventHandle) {
  if (elem === null || typeof elem === 'undefined') {
    return;
  }

  if (elem.addEventListener) {
    elem.addEventListener(type, eventHandle, false);
  } else if (elem.attachEvent) {
    elem.attachEvent("on".concat(type), eventHandle);
  } else {
    elem["on".concat(type)] = eventHandle;
  }
};

var removeEvent = function removeEvent(elem, type, eventHandle) {
  if (elem === null || typeof elem === 'undefined') {
    return;
  }

  if (elem.removeEventListener) {
    elem.removeEventListener(type, eventHandle, false);
  } else if (elem.detachEvent) {
    elem.detachEvent("on".concat(type), eventHandle);
  } else {
    elem["on".concat(type)] = null;
  }
};

var Carousel =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Carousel, _React$Component);

  function Carousel() {
    var _this;

    _classCallCheck(this, Carousel);

    _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).apply(this, arguments));
    _this.displayName = 'Carousel';
    _this.clickSafe = true;
    _this.touchObject = {};
    _this.controlsMap = [{
      funcName: 'renderTopLeftControls',
      key: 'TopLeft'
    }, {
      funcName: 'renderTopCenterControls',
      key: 'TopCenter'
    }, {
      funcName: 'renderTopRightControls',
      key: 'TopRight'
    }, {
      funcName: 'renderCenterLeftControls',
      key: 'CenterLeft'
    }, {
      funcName: 'renderCenterCenterControls',
      key: 'CenterCenter'
    }, {
      funcName: 'renderCenterRightControls',
      key: 'CenterRight'
    }, {
      funcName: 'renderBottomLeftControls',
      key: 'BottomLeft'
    }, {
      funcName: 'renderBottomCenterControls',
      key: 'BottomCenter'
    }, {
      funcName: 'renderBottomRightControls',
      key: 'BottomRight'
    }];

    var _this$getPropsByTrans = _this.getPropsByTransitionMode(_this.props, ['slidesToScroll', 'slidesToShow', 'cellAlign']),
        slidesToScroll = _this$getPropsByTrans.slidesToScroll,
        slidesToShow = _this$getPropsByTrans.slidesToShow,
        cellAlign = _this$getPropsByTrans.cellAlign;

    _this.state = {
      currentSlide: _this.props.slideIndex,
      dragging: false,
      frameWidth: 0,
      left: 0,
      slideCount: 0,
      slidesToScroll: slidesToScroll,
      slidesToShow: slidesToShow,
      slideWidth: 0,
      top: 0,
      cellAlign: cellAlign,
      easing: easing.easeCircleOut,
      isWrappingAround: false,
      wrapToIndex: null,
      resetWrapAroundPosition: false
    };
    _this.getTouchEvents = _this.getTouchEvents.bind(_assertThisInitialized(_this));
    _this.getMouseEvents = _this.getMouseEvents.bind(_assertThisInitialized(_this));
    _this.handleMouseOver = _this.handleMouseOver.bind(_assertThisInitialized(_this));
    _this.handleMouseOut = _this.handleMouseOut.bind(_assertThisInitialized(_this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.handleSwipe = _this.handleSwipe.bind(_assertThisInitialized(_this));
    _this.swipeDirection = _this.swipeDirection.bind(_assertThisInitialized(_this));
    _this.autoplayIterator = _this.autoplayIterator.bind(_assertThisInitialized(_this));
    _this.startAutoplay = _this.startAutoplay.bind(_assertThisInitialized(_this));
    _this.stopAutoplay = _this.stopAutoplay.bind(_assertThisInitialized(_this));
    _this.resetAutoplay = _this.resetAutoplay.bind(_assertThisInitialized(_this));
    _this.goToSlide = _this.goToSlide.bind(_assertThisInitialized(_this));
    _this.nextSlide = _this.nextSlide.bind(_assertThisInitialized(_this));
    _this.previousSlide = _this.previousSlide.bind(_assertThisInitialized(_this));
    _this.getTargetLeft = _this.getTargetLeft.bind(_assertThisInitialized(_this));
    _this.onResize = _this.onResize.bind(_assertThisInitialized(_this));
    _this.onReadyStateChange = _this.onReadyStateChange.bind(_assertThisInitialized(_this));
    _this.onVisibilityChange = _this.onVisibilityChange.bind(_assertThisInitialized(_this));
    _this.setInitialDimensions = _this.setInitialDimensions.bind(_assertThisInitialized(_this));
    _this.setDimensions = _this.setDimensions.bind(_assertThisInitialized(_this));
    _this.setLeft = _this.setLeft.bind(_assertThisInitialized(_this));
    _this.getFrameStyles = _this.getFrameStyles.bind(_assertThisInitialized(_this));
    _this.getSliderStyles = _this.getSliderStyles.bind(_assertThisInitialized(_this));
    _this.getOffsetDeltas = _this.getOffsetDeltas.bind(_assertThisInitialized(_this));
    _this.getChildNodes = _this.getChildNodes.bind(_assertThisInitialized(_this));
    _this.getSlideHeight = _this.getSlideHeight.bind(_assertThisInitialized(_this));
    _this.findMaxHeightSlide = _this.findMaxHeightSlide.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Carousel, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setInitialDimensions();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // see https://github.com/facebook/react/issues/3417#issuecomment-121649937
      this.mounted = true;
      this.setDimensions();
      this.bindEvents();

      if (this.props.autoplay) {
        this.startAutoplay();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var slideCount = this.getValidChildren(nextProps.children).length;
      var slideCountChanged = slideCount !== this.state.slideCount;
      this.setState({
        slideCount: slideCount,
        currentSlide: slideCountChanged ? nextProps.slideIndex : this.state.currentSlide
      });

      if (slideCount <= this.state.currentSlide) {
        this.goToSlide(Math.max(slideCount - 1, 0), nextProps);
      }

      var updateDimensions = slideCountChanged || function (curr, next, keys) {
        var shouldUpdate = false;

        for (var i = 0; i < keys.length; i++) {
          if (curr[keys[i]] !== next[keys[i]]) {
            shouldUpdate = true;
            break;
          }
        }

        return shouldUpdate;
      }(this.props, nextProps, ['cellSpacing', 'vertical', 'slideWidth', 'slideHeight', 'heightMode', 'slidesToScroll', 'slidesToShow', 'transitionMode', 'cellAlign']);

      if (updateDimensions) {
        this.setDimensions(nextProps);
      }

      if (this.props.slideIndex !== nextProps.slideIndex && nextProps.slideIndex !== this.state.currentSlide && !this.state.isWrappingAround) {
        this.goToSlide(nextProps.slideIndex, this.props);
      }

      if (this.props.autoplay !== nextProps.autoplay) {
        if (nextProps.autoplay) {
          this.startAutoplay();
        } else {
          this.stopAutoplay();
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unbindEvents();
      this.stopAutoplay(); // see https://github.com/facebook/react/issues/3417#issuecomment-121649937

      this.mounted = false;
    }
  }, {
    key: "getPropsByTransitionMode",
    value: function getPropsByTransitionMode(props, keys) {
      var updatedDefaults = {};

      if (props.transitionMode === 'fade') {
        keys.forEach(function (key) {
          switch (key) {
            case 'slidesToShow':
              updatedDefaults[key] = Math.max(parseInt(props.slidesToShow), 1);
              break;

            case 'slidesToScroll':
              updatedDefaults[key] = Math.max(parseInt(props.slidesToShow), 1);
              break;

            case 'cellAlign':
              updatedDefaults[key] = 'left';
              break;

            default:
              updatedDefaults[key] = props[key];
              break;
          }
        });
      } else {
        keys.forEach(function (key) {
          updatedDefaults[key] = props[key];
        });
      }

      return updatedDefaults;
    }
  }, {
    key: "getTouchEvents",
    value: function getTouchEvents() {
      var _this2 = this;

      if (this.props.swiping === false) {
        return null;
      }

      return {
        onTouchStart: function onTouchStart(e) {
          _this2.touchObject = {
            startX: e.touches[0].pageX,
            startY: e.touches[0].pageY
          };

          _this2.handleMouseOver();
        },
        onTouchMove: function onTouchMove(e) {
          var direction = _this2.swipeDirection(_this2.touchObject.startX, e.touches[0].pageX, _this2.touchObject.startY, e.touches[0].pageY);

          if (direction !== 0) {
            e.preventDefault();
          }

          var length = _this2.props.vertical ? Math.round(Math.sqrt(Math.pow(e.touches[0].pageY - _this2.touchObject.startY, 2))) : Math.round(Math.sqrt(Math.pow(e.touches[0].pageX - _this2.touchObject.startX, 2)));
          _this2.touchObject = {
            startX: _this2.touchObject.startX,
            startY: _this2.touchObject.startY,
            endX: e.touches[0].pageX,
            endY: e.touches[0].pageY,
            length: length,
            direction: direction
          };

          _this2.setState({
            left: _this2.props.vertical ? 0 : _this2.getTargetLeft(_this2.touchObject.length * _this2.touchObject.direction),
            top: _this2.props.vertical ? _this2.getTargetLeft(_this2.touchObject.length * _this2.touchObject.direction) : 0
          });
        },
        onTouchEnd: function onTouchEnd(e) {
          _this2.handleSwipe(e);

          _this2.handleMouseOut();
        },
        onTouchCancel: function onTouchCancel(e) {
          _this2.handleSwipe(e);
        }
      };
    }
  }, {
    key: "getMouseEvents",
    value: function getMouseEvents() {
      var _this3 = this;

      if (this.props.dragging === false) {
        return null;
      }

      return {
        onMouseOver: function onMouseOver() {
          return _this3.handleMouseOver();
        },
        onMouseOut: function onMouseOut() {
          return _this3.handleMouseOut();
        },
        onMouseDown: function onMouseDown(e) {
          if (e.preventDefault) {
            e.preventDefault();
          }

          _this3.touchObject = {
            startX: e.clientX,
            startY: e.clientY
          };

          _this3.setState({
            dragging: true
          });
        },
        onMouseMove: function onMouseMove(e) {
          if (!_this3.state.dragging) {
            return;
          }

          var direction = _this3.swipeDirection(_this3.touchObject.startX, e.clientX, _this3.touchObject.startY, e.clientY);

          if (direction !== 0) {
            e.preventDefault();
          }

          var length = _this3.props.vertical ? Math.round(Math.sqrt(Math.pow(e.clientY - _this3.touchObject.startY, 2))) : Math.round(Math.sqrt(Math.pow(e.clientX - _this3.touchObject.startX, 2)));
          _this3.touchObject = {
            startX: _this3.touchObject.startX,
            startY: _this3.touchObject.startY,
            endX: e.clientX,
            endY: e.clientY,
            length: length,
            direction: direction
          };

          _this3.setState({
            left: _this3.props.vertical ? 0 : _this3.getTargetLeft(_this3.touchObject.length * _this3.touchObject.direction),
            top: _this3.props.vertical ? _this3.getTargetLeft(_this3.touchObject.length * _this3.touchObject.direction) : 0
          });
        },
        onMouseUp: function onMouseUp(e) {
          if (!_this3.state.dragging) {
            return;
          }

          _this3.handleSwipe(e);
        },
        onMouseLeave: function onMouseLeave(e) {
          if (!_this3.state.dragging) {
            return;
          }

          _this3.handleSwipe(e);
        }
      };
    }
  }, {
    key: "pauseAutoplay",
    value: function pauseAutoplay() {
      if (this.props.autoplay) {
        this.autoplayPaused = true;
        this.stopAutoplay();
      }
    }
  }, {
    key: "unpauseAutoplay",
    value: function unpauseAutoplay() {
      if (this.props.autoplay && this.autoplayPaused) {
        this.startAutoplay();
        this.autoplayPaused = null;
      }
    }
  }, {
    key: "handleMouseOver",
    value: function handleMouseOver() {
      if (this.props.pauseOnHover) {
        this.pauseAutoplay();
      }
    }
  }, {
    key: "handleMouseOut",
    value: function handleMouseOut() {
      if (this.autoplayPaused) {
        this.unpauseAutoplay();
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      if (this.clickSafe === true) {
        event.preventDefault();
        event.stopPropagation();

        if (event.nativeEvent) {
          event.nativeEvent.stopPropagation();
        }
      }
    }
  }, {
    key: "handleSwipe",
    value: function handleSwipe() {
      if (typeof this.touchObject.length !== 'undefined' && this.touchObject.length > 44) {
        this.clickSafe = true;
      } else {
        this.clickSafe = false;
      }

      var slidesToShow = this.state.slidesToShow;

      if (this.props.slidesToScroll === 'auto') {
        slidesToShow = this.state.slidesToScroll;
      }

      if (this.touchObject.length > this.state.slideWidth / slidesToShow / 5) {
        if (this.touchObject.direction === 1) {
          if (this.state.currentSlide >= this.state.slideCount - slidesToShow && !this.props.wrapAround) {
            this.setState({
              easing: easing[this.props.edgeEasing]
            });
          } else {
            this.nextSlide();
          }
        } else if (this.touchObject.direction === -1) {
          if (this.state.currentSlide <= 0 && !this.props.wrapAround) {
            this.setState({
              easing: easing[this.props.edgeEasing]
            });
          } else {
            this.previousSlide();
          }
        }
      } else {
        this.goToSlide(this.state.currentSlide);
      }

      this.touchObject = {};
      this.setState({
        dragging: false
      });
    }
  }, {
    key: "swipeDirection",
    value: function swipeDirection(x1, x2, y1, y2) {
      var xDist = x1 - x2;
      var yDist = y1 - y2;
      var r = Math.atan2(yDist, xDist);
      var swipeAngle = Math.round(r * 180 / Math.PI);

      if (swipeAngle < 0) {
        swipeAngle = 360 - Math.abs(swipeAngle);
      }

      if (swipeAngle <= 45 && swipeAngle >= 0) {
        return 1;
      }

      if (swipeAngle <= 360 && swipeAngle >= 315) {
        return 1;
      }

      if (swipeAngle >= 135 && swipeAngle <= 225) {
        return -1;
      }

      if (this.props.vertical === true) {
        if (swipeAngle >= 35 && swipeAngle <= 135) {
          return 1;
        } else {
          return -1;
        }
      }

      return 0;
    }
  }, {
    key: "autoplayIterator",
    value: function autoplayIterator() {
      if (this.props.wrapAround) {
        this.nextSlide();
        return;
      }

      if (this.state.currentSlide !== this.state.slideCount - this.state.slidesToShow) {
        this.nextSlide();
      } else {
        this.stopAutoplay();
      }
    }
  }, {
    key: "startAutoplay",
    value: function startAutoplay() {
      this.autoplayID = setInterval(this.autoplayIterator, this.props.autoplayInterval);
    }
  }, {
    key: "resetAutoplay",
    value: function resetAutoplay() {
      if (this.props.autoplay && !this.autoplayPaused) {
        this.stopAutoplay();
        this.startAutoplay();
      }
    }
  }, {
    key: "stopAutoplay",
    value: function stopAutoplay() {
      if (this.autoplayID) {
        clearInterval(this.autoplayID);
      }
    } // Action Methods

  }, {
    key: "goToSlide",
    value: function goToSlide(index, props) {
      var _this4 = this;

      if (props === undefined) {
        props = this.props;
      }

      this.setState({
        easing: easing[props.easing]
      });

      if (index >= this.state.slideCount || index < 0) {
        if (!props.wrapAround) {
          return;
        }

        if (index >= this.state.slideCount) {
          props.beforeSlide(this.state.currentSlide, 0);
          this.setState(function (prevState) {
            return {
              left: props.vertical ? 0 : _this4.getTargetLeft(_this4.state.slideWidth, prevState.currentSlide),
              top: props.vertical ? _this4.getTargetLeft(_this4.state.slideWidth, prevState.currentSlide) : 0,
              currentSlide: 0,
              isWrappingAround: true,
              wrapToIndex: index
            };
          }, function () {
            return setTimeout(function () {
              _this4.setState({
                isWrappingAround: false,
                resetWrapAroundPosition: true
              }, function () {
                _this4.setState({
                  resetWrapAroundPosition: false
                });

                props.afterSlide(0);

                _this4.resetAutoplay();
              });
            }, props.speed);
          });
          return;
        } else {
          var endSlide = this.state.slideCount - this.state.slidesToScroll;
          props.beforeSlide(this.state.currentSlide, endSlide);
          this.setState(function (prevState) {
            return {
              left: props.vertical ? 0 : _this4.getTargetLeft(0, prevState.currentSlide),
              top: props.vertical ? _this4.getTargetLeft(0, prevState.currentSlide) : 0,
              currentSlide: endSlide,
              isWrappingAround: true,
              wrapToIndex: index
            };
          }, function () {
            return setTimeout(function () {
              _this4.setState({
                isWrappingAround: false,
                resetWrapAroundPosition: true
              }, function () {
                _this4.setState({
                  resetWrapAroundPosition: false
                });

                props.afterSlide(endSlide);

                _this4.resetAutoplay();
              });
            }, props.speed);
          });
          return;
        }
      }

      this.props.beforeSlide(this.state.currentSlide, index);
      var previousSlide = this.state.currentSlide;
      this.setState({
        currentSlide: index
      }, function () {
        return setTimeout(function () {
          _this4.resetAutoplay();

          if (index !== previousSlide) {
            _this4.props.afterSlide(index);
          }
        }, props.speed);
      });
    }
  }, {
    key: "nextSlide",
    value: function nextSlide() {
      var childrenCount = this.state.slideCount;
      var slidesToShow = this.state.slidesToShow;

      if (this.props.slidesToScroll === 'auto') {
        slidesToShow = this.state.slidesToScroll;
      }

      if (this.state.currentSlide >= childrenCount - slidesToShow && !this.props.wrapAround && this.props.cellAlign === 'left') {
        return;
      }

      if (this.props.wrapAround) {
        this.goToSlide(this.state.currentSlide + this.state.slidesToScroll);
      } else {
        if (this.props.slideWidth !== 1) {
          this.goToSlide(this.state.currentSlide + this.state.slidesToScroll);
          return;
        }

        var offset = this.state.currentSlide + this.state.slidesToScroll;
        var nextSlideIndex = this.props.cellAlign !== 'left' ? offset : Math.min(offset, childrenCount - slidesToShow);
        this.goToSlide(nextSlideIndex);
      }
    }
  }, {
    key: "previousSlide",
    value: function previousSlide() {
      if (this.state.currentSlide <= 0 && !this.props.wrapAround) {
        return;
      }

      if (this.props.wrapAround) {
        this.goToSlide(this.state.currentSlide - this.state.slidesToScroll);
      } else {
        this.goToSlide(Math.max(0, this.state.currentSlide - this.state.slidesToScroll));
      }
    } // Animation

  }, {
    key: "getTargetLeft",
    value: function getTargetLeft(touchOffset, slide) {
      var offset;
      var target = slide || this.state.currentSlide;

      switch (this.state.cellAlign) {
        case 'left':
          {
            offset = 0;
            offset -= this.props.cellSpacing * target;
            break;
          }

        case 'center':
          {
            offset = (this.state.frameWidth - this.state.slideWidth) / 2;
            offset -= this.props.cellSpacing * target;
            break;
          }

        case 'right':
          {
            offset = this.state.frameWidth - this.state.slideWidth;
            offset -= this.props.cellSpacing * target;
            break;
          }
      }

      var left = this.state.slideWidth * target;
      var lastSlide = this.state.currentSlide > 0 && target + this.state.slidesToScroll >= this.state.slideCount;

      if (lastSlide && this.props.slideWidth !== 1 && !this.props.wrapAround && this.props.slidesToScroll === 'auto') {
        left = this.state.slideWidth * this.state.slideCount - this.state.frameWidth;
        offset = 0;
        offset -= this.props.cellSpacing * (this.state.slideCount - 1);
      }

      offset -= touchOffset || 0;
      return (left - offset) * -1;
    } // Bootstrapping

  }, {
    key: "bindEvents",
    value: function bindEvents() {
      if (ExecutionEnvironment.canUseDOM) {
        addEvent(window, 'resize', this.onResize);
        addEvent(document, 'readystatechange', this.onReadyStateChange);
        addEvent(document, 'visibilitychange', this.onVisibilityChange);
      }
    }
  }, {
    key: "onResize",
    value: function onResize() {
      var _this5 = this;

      this.setDimensions(null, this.props.onResize);
      setTimeout(function () {
        _this5.setDimensions(null, _this5.props.onResize);
      }, 100);
    }
  }, {
    key: "onReadyStateChange",
    value: function onReadyStateChange() {
      this.setDimensions();
    }
  }, {
    key: "onVisibilityChange",
    value: function onVisibilityChange() {
      if (document.hidden) {
        this.pauseAutoplay();
      } else {
        this.unpauseAutoplay();
      }
    }
  }, {
    key: "unbindEvents",
    value: function unbindEvents() {
      if (ExecutionEnvironment.canUseDOM) {
        removeEvent(window, 'resize', this.onResize);
        removeEvent(document, 'readystatechange', this.onReadyStateChange);
        removeEvent(document, 'visibilitychange', this.onVisibilityChange);
      }
    }
  }, {
    key: "setInitialDimensions",
    value: function setInitialDimensions() {
      var _this6 = this;

      var slideWidth = this.props.vertical ? this.props.initialSlideHeight || 0 : this.props.initialSlideWidth || 0;
      var slideHeight = this.props.vertical ? (this.props.initialSlideHeight || 0) * this.state.slidesToShow : this.props.initialSlideHeight || 0;
      var frameHeight = slideHeight + this.props.cellSpacing * (this.state.slidesToShow - 1);
      this.setState({
        slideHeight: slideHeight,
        frameWidth: this.props.vertical ? frameHeight : '100%',
        slideCount: this.getValidChildren(this.props.children).length,
        slideWidth: slideWidth
      }, function () {
        _this6.setLeft();
      });
    }
  }, {
    key: "findMaxHeightSlide",
    value: function findMaxHeightSlide(slides) {
      var maxHeight = 0;

      for (var i = 0; i < slides.length; i++) {
        if (slides[i].offsetHeight > maxHeight) {
          maxHeight = slides[i].childNodes[0].offsetHeight;
        }
      }

      return maxHeight;
    }
  }, {
    key: "getSlideHeight",
    value: function getSlideHeight(props) {
      var childNodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var heightMode = props.heightMode,
          vertical = props.vertical;
      var firstSlide = childNodes[0];

      if (firstSlide && heightMode === 'first') {
        return vertical ? firstSlide.offsetHeight * this.state.slidesToShow : firstSlide.offsetHeight;
      }

      if (heightMode === 'max') {
        return this.findMaxHeightSlide(childNodes);
      }

      if (props.heightMode === 'current') {
        return childNodes[this.state.currentSlide].offsetHeight;
      }

      return 100;
    }
  }, {
    key: "setDimensions",
    value: function setDimensions(props) {
      var _this7 = this;

      var stateCb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      props = props || this.props;

      var _getPropsByTransition = this.getPropsByTransitionMode(props, ['slidesToShow', 'cellAlign']),
          slidesToShow = _getPropsByTransition.slidesToShow,
          cellAlign = _getPropsByTransition.cellAlign;

      var frame = this.frame;
      var childNodes = this.getChildNodes();
      var slideHeight = this.getSlideHeight(props, childNodes);
      var slideWidth;

      if (typeof props.slideWidth !== 'number') {
        slideWidth = parseInt(props.slideWidth);
      } else if (props.vertical) {
        slideWidth = slideHeight / slidesToShow * props.slideWidth;
      } else {
        slideWidth = frame.offsetWidth / slidesToShow * props.slideWidth;
      }

      if (!props.vertical) {
        slideWidth -= props.cellSpacing * ((100 - 100 / slidesToShow) / 100);
      }

      var frameHeight = slideHeight + props.cellSpacing * (slidesToShow - 1);
      var frameWidth = props.vertical ? frameHeight : frame.offsetWidth;

      var _getPropsByTransition2 = this.getPropsByTransitionMode(props, ['slidesToScroll']),
          slidesToScroll = _getPropsByTransition2.slidesToScroll;

      if (slidesToScroll === 'auto') {
        slidesToScroll = Math.floor(frameWidth / (slideWidth + props.cellSpacing));
      }

      this.setState({
        slideHeight: slideHeight,
        frameWidth: frameWidth,
        slideWidth: slideWidth,
        slidesToScroll: slidesToScroll,
        slidesToShow: slidesToShow,
        cellAlign: cellAlign,
        left: props.vertical ? 0 : this.getTargetLeft(),
        top: props.vertical ? this.getTargetLeft() : 0
      }, function () {
        stateCb();

        _this7.setLeft();
      });
    }
  }, {
    key: "getValidChildren",
    value: function getValidChildren(children) {
      // .toArray automatically removes invalid React children
      return React.Children.toArray(children);
    }
  }, {
    key: "getChildNodes",
    value: function getChildNodes() {
      return this.frame.childNodes[0].childNodes;
    }
  }, {
    key: "setLeft",
    value: function setLeft() {
      var newLeft = this.props.vertical ? 0 : this.getTargetLeft();
      var newTop = this.props.vertical ? this.getTargetLeft() : 0;

      if (newLeft !== this.state.left || newTop !== this.state.top) {
        this.setState({
          left: newLeft,
          top: newTop
        });
      }
    } // Styles

  }, {
    key: "getFrameStyles",
    value: function getFrameStyles() {
      return {
        position: 'relative',
        display: 'block',
        overflow: this.props.frameOverflow,
        height: this.props.vertical ? this.state.frameWidth || 'initial' : 'auto',
        margin: this.props.framePadding,
        padding: 0,
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        msTransform: 'translate(0, 0)',
        boxSizing: 'border-box',
        MozBoxSizing: 'border-box',
        touchAction: "pinch-zoom ".concat(this.props.vertical ? 'pan-x' : 'pan-y')
      };
    }
  }, {
    key: "getSliderStyles",
    value: function getSliderStyles() {
      return {
        position: 'relative',
        display: 'block',
        width: this.props.width,
        height: 'auto',
        boxSizing: 'border-box',
        MozBoxSizing: 'border-box',
        visibility: this.state.slideWidth ? 'inherit' : 'hidden'
      };
    }
  }, {
    key: "getStyleTagStyles",
    value: function getStyleTagStyles() {
      return '.slider-slide > img {width: 100%; display: block;}';
    }
  }, {
    key: "getDecoratorStyles",
    value: function getDecoratorStyles(position) {
      switch (position) {
        case 'TopLeft':
          {
            return {
              position: 'absolute',
              top: 0,
              left: 0
            };
          }

        case 'TopCenter':
          {
            return {
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              WebkitTransform: 'translateX(-50%)',
              msTransform: 'translateX(-50%)'
            };
          }

        case 'TopRight':
          {
            return {
              position: 'absolute',
              top: 0,
              right: 0
            };
          }

        case 'CenterLeft':
          {
            return {
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              WebkitTransform: 'translateY(-50%)',
              msTransform: 'translateY(-50%)'
            };
          }

        case 'CenterCenter':
          {
            return {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              WebkitTransform: 'translate(-50%, -50%)',
              msTransform: 'translate(-50%, -50%)'
            };
          }

        case 'CenterRight':
          {
            return {
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              WebkitTransform: 'translateY(-50%)',
              msTransform: 'translateY(-50%)'
            };
          }

        case 'BottomLeft':
          {
            return {
              position: 'absolute',
              bottom: 0,
              left: 0
            };
          }

        case 'BottomCenter':
          {
            return {
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              WebkitTransform: 'translateX(-50%)',
              msTransform: 'translateX(-50%)'
            };
          }

        case 'BottomRight':
          {
            return {
              position: 'absolute',
              bottom: 0,
              right: 0
            };
          }

        default:
          {
            return {
              position: 'absolute',
              top: 0,
              left: 0
            };
          }
      }
    }
  }, {
    key: "getOffsetDeltas",
    value: function getOffsetDeltas() {
      var offset = 0;

      if (this.state.isWrappingAround) {
        offset = this.getTargetLeft(null, this.state.wrapToIndex);
      } else {
        offset = this.getTargetLeft(this.touchObject.length * this.touchObject.direction);
      }

      return {
        tx: [this.props.vertical ? 0 : offset],
        ty: [this.props.vertical ? offset : 0]
      };
    }
  }, {
    key: "getTransitionProps",
    value: function getTransitionProps() {
      return {
        slideWidth: this.state.slideWidth,
        slideHeight: this.state.slideHeight,
        slideCount: this.state.slideCount,
        currentSlide: this.state.currentSlide,
        isWrappingAround: this.state.isWrappingAround,
        top: this.state.top,
        left: this.state.left,
        cellSpacing: this.props.cellSpacing,
        vertical: this.props.vertical,
        dragging: this.props.dragging,
        wrapAround: this.props.wrapAround,
        slidesToShow: this.state.slidesToShow
      };
    }
  }, {
    key: "renderControls",
    value: function renderControls() {
      var _this8 = this;

      return this.controlsMap.map(function (_ref) {
        var funcName = _ref.funcName,
            key = _ref.key;
        var func = _this8.props[funcName];
        return func && typeof func === 'function' && React.createElement("div", {
          className: "slider-control-".concat(key.toLowerCase()),
          style: _this8.getDecoratorStyles(key),
          key: key
        }, func({
          currentSlide: _this8.state.currentSlide,
          slideCount: _this8.state.slideCount,
          frameWidth: _this8.state.frameWidth,
          slideWidth: _this8.state.slideWidth,
          slidesToScroll: _this8.state.slidesToScroll,
          cellSpacing: _this8.props.cellSpacing,
          slidesToShow: _this8.state.slidesToShow,
          wrapAround: _this8.props.wrapAround,
          nextSlide: function nextSlide() {
            return _this8.nextSlide();
          },
          previousSlide: function previousSlide() {
            return _this8.previousSlide();
          },
          goToSlide: function goToSlide(index) {
            return _this8.goToSlide(index);
          }
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this9 = this;

      var duration = this.state.dragging || this.state.resetWrapAroundPosition ? 0 : this.props.speed;
      var frameStyles = this.getFrameStyles();
      var touchEvents = this.getTouchEvents();
      var mouseEvents = this.getMouseEvents();
      var TransitionControl = Transitions[this.props.transitionMode];
      var validChildren = this.getValidChildren(this.props.children);
      return React.createElement("div", {
        className: ['slider', this.props.className || ''].join(' '),
        style: _extends({}, this.getSliderStyles(), this.props.style)
      }, React.createElement(Animate, {
        show: true,
        start: {
          tx: 0,
          ty: 0
        },
        update: _extends({}, this.getOffsetDeltas(), {
          timing: {
            duration: duration,
            ease: this.state.easing
          },
          events: {
            end: this.setLeft
          }
        }),
        children: function children(_ref2) {
          var tx = _ref2.tx,
              ty = _ref2.ty;
          return React.createElement("div", _extends({
            className: "slider-frame",
            ref: function ref(frame) {
              return _this9.frame = frame;
            },
            style: frameStyles
          }, touchEvents, mouseEvents, {
            onClickCapture: _this9.handleClick
          }), React.createElement(TransitionControl, _extends({}, _this9.getTransitionProps(), {
            deltaX: tx,
            deltaY: ty
          }), validChildren));
        }
      }), this.renderControls(), this.props.autoGenerateStyleTag && React.createElement("style", {
        type: "text/css",
        dangerouslySetInnerHTML: {
          __html: this.getStyleTagStyles()
        }
      }));
    }
  }]);

  return Carousel;
}(React.Component);

export { Carousel as default };
Carousel.propTypes = {
  afterSlide: PropTypes.func,
  autoplay: PropTypes.bool,
  autoplayInterval: PropTypes.number,
  autoGenerateStyleTag: PropTypes.bool,
  beforeSlide: PropTypes.func,
  cellAlign: PropTypes.oneOf(['left', 'center', 'right']),
  cellSpacing: PropTypes.number,
  dragging: PropTypes.bool,
  easing: PropTypes.string,
  edgeEasing: PropTypes.string,
  frameOverflow: PropTypes.string,
  framePadding: PropTypes.string,
  heightMode: PropTypes.oneOf(['first', 'current', 'max']),
  transitionMode: PropTypes.oneOf(['scroll', 'fade']),
  initialSlideHeight: PropTypes.number,
  initialSlideWidth: PropTypes.number,
  onResize: PropTypes.func,
  pauseOnHover: PropTypes.bool,
  renderTopLeftControls: PropTypes.func,
  renderTopCenterControls: PropTypes.func,
  renderTopRightControls: PropTypes.func,
  renderCenterLeftControls: PropTypes.func,
  renderCenterCenterControls: PropTypes.func,
  renderCenterRightControls: PropTypes.func,
  renderBottomLeftControls: PropTypes.func,
  renderBottomCenterControls: PropTypes.func,
  renderBottomRightControls: PropTypes.func,
  slideIndex: PropTypes.number,
  slidesToScroll: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  slidesToShow: PropTypes.number,
  slideWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  speed: PropTypes.number,
  swiping: PropTypes.bool,
  vertical: PropTypes.bool,
  width: PropTypes.string,
  wrapAround: PropTypes.bool
};
Carousel.defaultProps = {
  afterSlide: function afterSlide() {},
  autoplay: false,
  autoplayInterval: 3000,
  autoGenerateStyleTag: true,
  beforeSlide: function beforeSlide() {},
  cellAlign: 'left',
  cellSpacing: 0,
  dragging: true,
  easing: 'easeCircleOut',
  edgeEasing: 'easeElasticOut',
  framePadding: '0px',
  frameOverflow: 'hidden',
  heightMode: 'max',
  transitionMode: 'scroll',
  onResize: function onResize() {},
  slideIndex: 0,
  slidesToScroll: 1,
  slidesToShow: 1,
  style: {},
  pauseOnHover: true,
  renderCenterLeftControls: function renderCenterLeftControls(props) {
    return React.createElement(PreviousButton, props);
  },
  renderCenterRightControls: function renderCenterRightControls(props) {
    return React.createElement(NextButton, props);
  },
  renderBottomCenterControls: function renderBottomCenterControls(props) {
    return React.createElement(PagingDots, props);
  },
  slideWidth: 1,
  speed: 500,
  swiping: true,
  vertical: false,
  width: '100%',
  wrapAround: false
};
export { NextButton, PreviousButton, PagingDots };