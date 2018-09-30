'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./style/search.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchBox = function (_Component) {
    _inherits(SearchBox, _Component);

    function SearchBox(props) {
        _classCallCheck(this, SearchBox);

        var _this = _possibleConstructorReturn(this, (SearchBox.__proto__ || Object.getPrototypeOf(SearchBox)).call(this, props));

        _this.state = {
            searchVal: props.searchVal
        };
        _this.clickSearchIcon = _this.clickSearchIcon.bind(_this);
        _this.onKeyDown = _this.onKeyDown.bind(_this);
        _this.onInput = _this.onInput.bind(_this);
        return _this;
    }

    _createClass(SearchBox, [{
        key: 'componentDidCatch',
        value: function componentDidCatch(err) {
            console.log(err);
        }
    }, {
        key: 'clickSearchIcon',
        value: function clickSearchIcon() {
            this.props.onSearch(this.state.searchVal);
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(e) {
            var evt = e || window.event;
            if (evt.keyCode === 13) {
                //回车事件
                this.clickSearchIcon();
            }
        }
    }, {
        key: 'onInput',
        value: function onInput(e) {
            this.setState({
                searchVal: e.target.value
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var defaultProps = this.props.defaultProps;

            var prefixClassName = defaultProps.prefixClassName;
            var _className = prefixClassName + '-SearchBox';
            return _react2.default.createElement(
                'div',
                { className: _className },
                _react2.default.createElement('input', { className: prefixClassName + '-SearchBox-input', type: 'text', onInput: this.onInput, onKeyDown: this.onKeyDown }),
                _react2.default.createElement(
                    'span',
                    { className: prefixClassName + '-SearchBox-input-suffix', onClick: this.clickSearchIcon },
                    _react2.default.createElement('i', { className: prefixClassName + '-icon-search' })
                )
            );
        }
    }]);

    return SearchBox;
}(_react.Component);

exports.default = SearchBox;