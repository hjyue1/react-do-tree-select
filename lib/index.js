'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactVirtualized = require('react-virtualized');

var _tool = require('./tool');

require('./style/index.css');

var _searchBox = require('./searchBox');

var _searchBox2 = _interopRequireDefault(_searchBox);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultProps = {
    style: {
        width: 320,
        height: 800,
        overflow: 'auto'
    },
    showlevel: 0,
    checkbox: {
        enable: false,
        parentChain: true, // 影响父级节点；
        childrenChain: true, // 影响子级节点;
        halfChain: true, // 即使子级节点被全部选中影响父级节点半选；
        initCheckedList: [] // 初始化多选数组
    },
    prefixClassName: 'do',
    paddingLeftLevel: 20
};

var TreeSelect = function (_Component) {
    _inherits(TreeSelect, _Component);

    function TreeSelect(props) {
        _classCallCheck(this, TreeSelect);

        var _this = _possibleConstructorReturn(this, (TreeSelect.__proto__ || Object.getPrototypeOf(TreeSelect)).call(this, props));

        _this.state = {
            treeData: [], // 树数据
            treeDataMap: {}, // 树数据映射表
            idList: [], // 所有列表
            renderIdList: [], // 渲染的列表
            checkedList: new Map(), // 勾选的Map列表
            searchVal: '', // 搜索的值
            selectVal: '', // 选中的条目
            checkbox: {}, // 复选框的配置
            showlevel: 0, // 展开的层级
            updateListState: false // 强制更新List组件
        };
        _this.treeNodeRender = _this.treeNodeRender.bind(_this);
        _this.onClickRow = _this.onClickRow.bind(_this);
        _this.onChecked = _this.onChecked.bind(_this);
        _this.onSearch = _this.onSearch.bind(_this);
        _this.onCheckedInitCheckedList = _this.onCheckedInitCheckedList.bind(_this);
        _this.cacheIdList = null;
        return _this;
    }

    _createClass(TreeSelect, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
            if (prevState.checkbox != this.state.checkbox) {
                this.onCheckedInitCheckedList(this.state.checkbox);
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.onCheckedInitCheckedList(this.state.checkbox);
        }
    }, {
        key: 'onCheckedInitCheckedList',
        value: function onCheckedInitCheckedList(checkbox) {
            var _state = this.state,
                treeDataMap = _state.treeDataMap,
                updateListState = _state.updateListState,
                checkedList = _state.checkedList;
            var initCheckedList = checkbox.initCheckedList;

            var _checkedList = checkedList;
            if (!(0, _tool.isEmptyArray)(initCheckedList)) {
                initCheckedList.forEach(function (_item) {
                    var treeItem = treeDataMap[_item];
                    if (!treeItem) {
                        return;
                    }
                    var value = treeItem.value;

                    _checkedList.set(value, value);
                    // 处理treeDataMap的数据状态
                    treeDataMap[value] = _extends({}, treeDataMap[value], {
                        checkStatus: _extends({}, treeDataMap[value].checkStatus, {
                            checked: true,
                            halfChecked: false
                        })
                    });
                    checkbox.parentChain && (0, _tool.parentChain)(treeDataMap, treeDataMap[treeItem.parentVal], checkbox, _checkedList, true);
                });
            }
            this.setState({
                treeDataMap: treeDataMap,
                checkedList: _checkedList,
                updateListState: !updateListState
            });
        }
    }, {
        key: 'componentDidCatch',
        value: function componentDidCatch(err) {
            console.log(err);
        }

        /**
         * [onClickRow 每行节点点击事件回调函数]
         * @method onClickRow
         * @param  {[Object]}  item [被点击节点的集合]
         * @param  {[Event]}   e    [事件]
         *
         */

    }, {
        key: 'onClickRow',
        value: function onClickRow(item, e) {
            var onSelect = this.props.onSelect;
            var _state2 = this.state,
                renderIdList = _state2.renderIdList,
                treeDataMap = _state2.treeDataMap,
                updateListState = _state2.updateListState;
            var value = item.value;

            var _renderIdList = renderIdList.concat([]);
            // const disabled = item.disabled && (!item.children ||
            // !isEmptyArray(item.children)) if(disabled) {     return }

            var isExpand = treeDataMap[item.value].isExpand = !treeDataMap[item.value].isExpand;
            if (isExpand) {
                // 展开
                if (!(0, _tool.isEmptyArray)(item.children)) {
                    // 找到这个val在renderIdList中的索引
                    var idx = this.findIdListInValIdx(value, _renderIdList);
                    var _children = item.children.concat([]);
                    // 在这个val后面插入
                    _children.unshift(idx + 1, 0);
                    Array.prototype.splice.apply(_renderIdList, _children);
                }
            } else {
                // 收缩
                if (!(0, _tool.isEmptyArray)(item.children)) {
                    // 找到children的所有子节点
                    var map = new Map();

                    _renderIdList.forEach(function (_item) {
                        map.set(_item, _item);
                    });

                    var arr = (0, _tool.findAllChildren)(item.children, treeDataMap);

                    arr.forEach(function (_item) {
                        treeDataMap[_item].isExpand = false;
                        map.delete(_item);
                    });

                    _renderIdList = Array.from(map.values());
                }
            }

            this.setState({
                renderIdList: _renderIdList,
                treeDataMap: treeDataMap,
                selectVal: value,
                updateListState: !updateListState
            }, function () {
                onSelect && onSelect(item, e);
            });
        }

        /**
         * [checked 节点的选中情况]
         * @method checked
         * @param  {[Object]}  item [被点击节点的集合]
         * @param  {[Event]}   e    [事件]
         *
         */

    }, {
        key: 'onChecked',
        value: function onChecked(item, e) {
            var _this2 = this;

            e && e.stopPropagation();
            var onChecked = this.props.onChecked;
            var _state3 = this.state,
                treeDataMap = _state3.treeDataMap,
                checkedList = _state3.checkedList,
                updateListState = _state3.updateListState,
                checkbox = _state3.checkbox;
            var checkStatus = item.checkStatus,
                value = item.value;
            var checked = checkStatus.checked;
            // 判断是否是禁用

            var disabled = item.disabled;
            if (disabled) {
                return;
            }
            // 影响性能，直接修改Map值 const _treeDataMap = Object.assign({}, treeDataMap)
            var _treeDataMap = treeDataMap;

            var _checked = !checked;
            var _checkedList = new Map(checkedList);

            // 处理勾选的value List
            if (_checked) {
                _checkedList.set(value, value);
            } else {
                (0, _tool.delMapItem)(_checkedList, value);
            }

            // 处理treeDataMap的数据状态
            _treeDataMap[value] = _extends({}, _treeDataMap[value], {
                checkStatus: _extends({}, _treeDataMap[value].checkStatus, {
                    checked: _checked,
                    halfChecked: false
                })

                // 处理复选框联动逻辑
            });e && checkbox.parentChain && (0, _tool.parentChain)(_treeDataMap, _treeDataMap[item.parentVal], checkbox, _checkedList);
            e && checkbox.childrenChain && (0, _tool.childrenChain)(_treeDataMap, item.children, _checked, _checkedList);
            this.setState({
                treeDataMap: _treeDataMap,
                checkedList: _checkedList,
                updateListState: !updateListState
            }, function () {
                e && onChecked && onChecked(Array.from(_this2.state.checkedList.keys()), e);
            });
        }

        // 查找在idList中val的索引

    }, {
        key: 'findIdListInValIdx',
        value: function findIdListInValIdx(val, idList) {
            return idList.indexOf(val);
        }

        // 渲染TreeNode

    }, {
        key: 'treeNodeRender',
        value: function treeNodeRender(_ref) {
            var _this3 = this;

            var index = _ref.index,
                style = _ref.style;
            var _props = this.props,
                checkbox = _props.checkbox,
                customIconRender = _props.customIconRender,
                customTitleRender = _props.customTitleRender;
            var _state4 = this.state,
                idList = _state4.idList,
                treeDataMap = _state4.treeDataMap,
                renderIdList = _state4.renderIdList,
                selectVal = _state4.selectVal;

            var prefixClassName = defaultProps.prefixClassName;
            var idx = renderIdList[index];
            var item = treeDataMap[idx];
            if (!item) return;
            if (item.parentVal && !treeDataMap[item.parentVal].isExpand) {
                // 父级节点属性为不展开，子节点不应该显示
                throw new Error('this item should not be show');
            }
            var _style = _extends({}, style, {
                paddingLeft: defaultProps.paddingLeftLevel * item.level
            });
            var checkedClassName = item.checkStatus.checked ? prefixClassName + '-checkbox-checked' : '';
            var halfCheckedClassName = item.checkStatus.halfChecked ? prefixClassName + '-checkbox-halfChecked' : '';
            var disabled = item.disabled && (!item.children || !(0, _tool.isEmptyArray)(item.children));
            var isSelectVal = selectVal == item.value;
            var _checkbox = checkbox || defaultProps.checkbox;
            return _react2.default.createElement(
                'div',
                {
                    key: item.value,
                    style: _extends({}, _style, {
                        width: 'auto'
                    }),
                    onClick: function onClick(e) {
                        return _this3.onClickRow(item, e);
                    },
                    className: prefixClassName + '-TreeNode' },
                _react2.default.createElement(
                    'div',
                    {
                        className: prefixClassName + '-fadeIn ' + (item.disabled ? 'disabled' : '') },
                    _react2.default.createElement(
                        'div',
                        { className: prefixClassName + '-expandIcon' },
                        !(0, _tool.isEmptyArray)(item.children) && _react2.default.createElement('i', { className: '' + (item.isExpand && prefixClassName + '-expand') })
                    ),
                    _checkbox.enable && !disabled && _react2.default.createElement(
                        'div',
                        {
                            onClick: function onClick(e) {
                                return _this3.onChecked(item, e);
                            },
                            className: prefixClassName + '-checkbox ' + checkedClassName + ' ' + halfCheckedClassName },
                        _react2.default.createElement('span', {
                            className: prefixClassName + '-checkbox-inner ' + (disabled ? 'disabled' : '') })
                    ),
                    _react2.default.createElement(
                        'div',
                        {
                            title: item.title,
                            className: prefixClassName + '-title ' + (isSelectVal ? 'active' : '') },
                        customTitleRender ? customTitleRender(item) : item.title
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: prefixClassName + '-customIcon' },
                        customIconRender ? customIconRender(item) : ''
                    )
                )
            );
        }

        // 搜索框的回调函数

    }, {
        key: 'onSearch',
        value: function onSearch(val) {
            var _filterIdList = void 0;
            var _state5 = this.state,
                idList = _state5.idList,
                treeDataMap = _state5.treeDataMap,
                renderIdList = _state5.renderIdList,
                updateListState = _state5.updateListState;
            // 影响性能，直接修改Map值 const _treeDataMap = Object.assign({}, treeDataMap)

            var _treeDataMap = treeDataMap;

            if (!this.cacheIdList) {
                this.cacheIdList = renderIdList;
            }

            if (val) {
                _filterIdList = (0, _tool.getFilterIdList)(idList, _treeDataMap, val);
            } else {
                _filterIdList = this.cacheIdList;
                this.cacheIdList = null;
            }

            _filterIdList = (0, _tool.treeDataMapCheckRenderIdList)(_treeDataMap, _filterIdList);

            this.setState({
                searchVal: val,
                renderIdList: _filterIdList,
                treeDataMap: _treeDataMap,
                updateListState: !updateListState
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var _props2 = this.props,
                style = _props2.style,
                wrapperClassName = _props2.wrapperClassName,
                checkbox = _props2.checkbox;
            var _state6 = this.state,
                treeDataMap = _state6.treeDataMap,
                renderIdList = _state6.renderIdList,
                searchVal = _state6.searchVal,
                checkedList = _state6.checkedList,
                selectVal = _state6.selectVal,
                updateListState = _state6.updateListState;

            var _style = style || defaultProps.style;
            var prefixClassName = defaultProps.prefixClassName;
            var _className = prefixClassName + '-TreeSelect ' + (wrapperClassName || '');
            return _react2.default.createElement(
                'div',
                {
                    className: _className,
                    style: {
                        width: _style.width
                    } },
                _react2.default.createElement(_searchBox2.default, {
                    defaultProps: defaultProps,
                    searchVal: searchVal,
                    onSearch: this.onSearch }),
                _react2.default.createElement(
                    'div',
                    {
                        className: prefixClassName + '-TreeSelectList',
                        style: _extends({}, _style, {
                            overflow: 'unset'
                        }) },
                    _react2.default.createElement(
                        _reactVirtualized.AutoSizer,
                        null,
                        function (_ref2) {
                            var height = _ref2.height,
                                width = _ref2.width;
                            return _react2.default.createElement(_reactVirtualized.List, {
                                width: width,
                                height: height,
                                rowCount: renderIdList.length,
                                rowHeight: 22,
                                rowRenderer: _this4.treeNodeRender,
                                overscanRowCount: 20,
                                autoContainerWidth: true,
                                treeDataMap: treeDataMap,
                                checkedList: checkedList,
                                selectVal: selectVal,
                                updateListState: updateListState,
                                checkbox: checkbox });
                        }
                    )
                )
            );
        }
    }], [{
        key: 'getDerivedStateFromProps',
        value: function getDerivedStateFromProps(nextProps, prevState) {
            var defaultConfig = {
                showlevel: nextProps.showlevel || defaultProps.showlevel,
                checkbox: nextProps.checkbox || defaultProps.checkbox
            };
            if (nextProps.treeData !== prevState.treeData) {
                var _generateTreeDataMap = (0, _tool.generateTreeDataMap)({}, nextProps.treeData, defaultConfig),
                    map = _generateTreeDataMap.map,
                    idList = _generateTreeDataMap.idList,
                    renderIdList = _generateTreeDataMap.renderIdList;

                return {
                    treeData: nextProps.treeData,
                    value: nextProps.value,
                    treeDataMap: map,
                    idList: idList,
                    renderIdList: renderIdList,
                    selectVal: nextProps.selectVal,
                    checkbox: defaultConfig.checkbox,
                    showlevel: defaultConfig.showlevel
                };
            }
            return null;
        }
    }]);

    return TreeSelect;
}(_react.Component);

// [propTypes 属性类型定义]


TreeSelect.propTypes = {
    treeData: _propTypes2.default.array.isRequired, // 元数据
    style: _propTypes2.default.object, // 样式
    checkbox: _propTypes2.default.object, // 复选框配置
    showlevel: _propTypes2.default.number, // 显示层级
    selectVal: _propTypes2.default.string, // 选中的值
    onSelect: _propTypes2.default.func, // 选择的回调函数
    onChecked: _propTypes2.default.func, // 复选框勾选的回调函数
    wrapperClassName: _propTypes2.default.string, // 扩展classname
    customIconRender: _propTypes2.default.func, // 自定义扩展Icon渲染
    customTitleRender: _propTypes2.default.func // 自定义标题渲染
};

exports.default = TreeSelect;