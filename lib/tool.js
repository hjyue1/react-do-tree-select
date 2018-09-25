"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// 判断是否为空数组
var isEmptyArray = exports.isEmptyArray = function isEmptyArray(arr) {
    if (!arr) return true;
    if (arr instanceof Array) {
        return arr.length <= 0;
    }
    return true;
};

// 删除数组中条目
var delArrayItem = exports.delArrayItem = function delArrayItem(arr, node) {
    var idx = arr.indexOf(node);
    if (idx > -1) {
        arr.splice(idx, 1);
    }
};

// 把条目加入Map
var addMapItem = exports.addMapItem = function addMapItem(arr, node) {
    // 这种写法影响性能
    // const idx = arr.indexOf(node)
    // if (idx === -1) {
    //     arr.push(node);
    // }
    arr.set(node, node);
};

// 删除Map中条目
var delMapItem = exports.delMapItem = function delMapItem(map, node) {
    if (map.has(node)) {
        map.delete(node);
    }
};

// 生成树数据的map
/**
 * [generateTreeDataMap 检查子节点的选中情况]
 * @method generateTreeDataMap
 * @param  {[Object]}   parent              [父节点]
 * @param  {[Array]}    treeData            [源数据]
 * @param  {[Object]}   defaultConfig       [配置]
 * @param  {[number]}   level               [展开级别]
 * @param  {[Object]}   _map                [以ID为键值的Hash表]
 * @param  {[Array]}    _idList             [所有的idList]
 * @param  {[Array]}    _renderIdList       [渲染的IdList]
 * @return {[Object]}               
 *
 */
var generateTreeDataMap = exports.generateTreeDataMap = function generateTreeDataMap(parent, treeData, defaultConfig) {
    var level = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    var _map = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    var _idList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

    var _renderIdList = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];

    var map = _map;
    var _level = level;
    var showlevel = defaultConfig.showlevel;

    var idList = _idList;
    var renderIdList = _renderIdList;
    treeData.forEach(function (item) {
        if (map[item.value]) {
            throw new Error('The value must be unique');
        }
        var isExpand = showlevel >= level;
        if (isExpand) {
            renderIdList.push(item.value);
            if (!isEmptyArray(item.children) && showlevel === level) {
                item.children.forEach(function (_item) {
                    return renderIdList.push(_item.value);
                });
            }
        }

        idList.push(item.value);

        map[item.value] = _extends({}, item, {
            level: _level,
            isExpand: isExpand,
            checkStatus: {
                checked: false,
                halfChecked: false
            },
            parentVal: parent && parent.value || null
        });
        if (!isEmptyArray(item.children)) {
            map[item.value].children = item.children.map(function (_item) {
                return _item.value;
            });
            generateTreeDataMap(item, item.children, defaultConfig, _level + 1, map, idList, renderIdList);
        }
    });
    return { map: map, idList: idList, renderIdList: renderIdList };
};

/**
 * [childCheckedStatus 检查子节点的选中情况]
 * @method childCheckedStatus
 * @param  {[Array]}   children     [节点的子节点集合]
 * @param  {[HashMap]} TreeDataMap  [以ID为键值的Hash表]
 * @param  {[Object]}  checkbox     [配置]
 * @return {[Object]}               [节点的选中状态]
 *
 */
var childCheckedStatus = exports.childCheckedStatus = function childCheckedStatus(children, TreeDataMap, checkbox) {
    // 子级节点被全部选中影响父级节点半选
    var halfChain = checkbox.halfChain;


    var checked = !halfChain;
    var halfChecked = false;
    children.forEach(function (item) {
        var checkStatus = TreeDataMap[item].checkStatus;

        if (checkStatus.halfChecked || checkStatus.checked) {
            halfChecked = true;
        }
        if (!checkStatus.checked) {
            checked = false;
        }
    });

    if (checked && halfChecked) {
        if (halfChain) {
            checked = false;
        } else {
            halfChecked = false;
        }
    }
    return { checked: checked, halfChecked: halfChecked };
};

/**
 * [parentChain 设置父节点checkbox状态]
 * @method parentChain
 * @param {[HashMap]} TreeDataMap  [以ID为键值的Hash表，方便快速查找]
 * @param {[Object]}  parentNode   [父节点]
 * @param {[Object]}  config       [配置]
 * @param {[Array]}   checkedList  [选中复选框的Value列表]]]
 * @return {[null]}   null
 */
var parentChain = exports.parentChain = function parentChain(TreeDataMap, parentNode, config, checkedList) {
    if (parentNode) {
        var checkStatus = childCheckedStatus(parentNode.children, TreeDataMap, config);
        Object.assign(parentNode, { checkStatus: checkStatus });

        // 加入/移除 选中的父节点Value列表
        if (checkStatus.checked) {
            addMapItem(checkedList, parentNode.value);
        } else {
            delMapItem(checkedList, parentNode.value);
        }

        // 递归
        if ("undefined" !== typeof parentNode.parentVal) {
            parentChain(TreeDataMap, TreeDataMap[parentNode.parentVal], config, checkedList);
        }
    }
};

/**
 * [childrenChain 设置子节点的checkbox状态]
 * @method childrenChain
 * @param {[HashMap]} 	TreeDataMap 	[以ID为键值的Hash表]
 * @param {[Array]} 	children 	[子节点数组]
 * @param {[bool]}  	checked  	[checkbox状态]
 * @param {[Array]}  	checkedList  	[选中复选框的Value列表]]]
 * @return {[null]}     null
 */
var childrenChain = exports.childrenChain = function childrenChain(TreeDataMap, children, checked, checkedList) {
    if (!children) {
        // console.log('子节点不存在')
        return;
    }
    children.forEach(function (id) {
        var node = TreeDataMap[id];
        if (node.disabled) {
            // 被禁用的无法选中 return
        } else {
            node.checkStatus = {
                checked: checked,
                halfChecked: false
            };
            if (checked) {
                addMapItem(checkedList, node.value);
            } else {
                delMapItem(checkedList, node.value);
            }
        }
        if (node.children) {
            childrenChain(TreeDataMap, node.children, checked, checkedList);
        }
    });
};

/**
 * [findAllChildren 查找指定的所有子节点]
 * @method findAllChildren
 * @param  {[Array]}   children     [子节点集合]
 * @param  {[HashMap]} TreeDataMap  [以ID为键值的Hash表，方便快速查找]
 * @param  {[Array]}  _arr          [递归返回值]
 * @return {[Array]}  arr          [子节点数组]
 *
 */
var findAllChildren = exports.findAllChildren = function findAllChildren(children, treeDataMap) {
    var _arr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var arr = _arr;
    children.forEach(function (item) {
        var _item = treeDataMap[item];
        arr.push(item);
        if (!isEmptyArray(_item.children)) {
            findAllChildren(_item.children, treeDataMap, arr);
        }
    });
    return arr;
};

/**
 * [filterListCheckChildren 搜索功能-过滤列表ID的子节点是否满足搜索条件]
 * @method filterListCheckChildren
 * @param  {[Array]}   _children     [子节点集合]
 * @param  {[HashMap]} treeDataMap   [以ID为键值的Hash表，方便快速查找]
 * @param  {[String]]}  val            [搜索条件]
 * @return {[Boolean]}               [true-满足 / false-不满足]
 *
 */
var filterListCheckChildren = exports.filterListCheckChildren = function filterListCheckChildren(_children, treeDataMap, val) {
    return _children.some(function (item) {
        var _treeDataMap$item = treeDataMap[item],
            title = _treeDataMap$item.title,
            value = _treeDataMap$item.value,
            children = _treeDataMap$item.children;

        if (title.indexOf(val) > -1) {
            return true;
        }
        if (!isEmptyArray(children)) {
            return filterListCheckChildren(children, treeDataMap, val);
        }
        return false;
    });
};

/**
 * [getFilterIdList 获取根据搜索条件过滤的id列表]
 * @method getFilterIdList
 * @param  {[Array]}    idList                   [源集合]
 * @param  {[HashMap]}  treeDataMap              [以ID为键值的Hash表，方便快速查找]
 * @param  {[String]}   val                      [搜索条件]
 * @param  {[Array]}    filterIdList             [过滤后的列表]
 * @return {[Array]}    _filterIdList
 *
 */
var getFilterIdList = exports.getFilterIdList = function getFilterIdList(idList, treeDataMap, val) {
    var filterIdList = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    var _filterIdList = filterIdList;
    idList.forEach(function (item) {
        var _treeDataMap$item2 = treeDataMap[item],
            title = _treeDataMap$item2.title,
            value = _treeDataMap$item2.value,
            children = _treeDataMap$item2.children,
            parentVal = _treeDataMap$item2.parentVal;


        if (title.indexOf(val) > -1 || !isEmptyArray(children) && filterListCheckChildren(children, treeDataMap, val)) {
            // console.log(value)

            if (parentVal) {
                // 父级展开isExpand
                treeDataMap[parentVal] = _extends({}, treeDataMap[parentVal], {
                    isExpand: true
                });
            }
            return _filterIdList.push(value);
        }
    });
    return _filterIdList;
};

/**
 * [treeDataMapCheckRenderIdList 根据treeDataMap检查RenderIdList中是否有父级不展开的情况]
 * @method treeDataMapCheckRenderIdList
 * @param  {[HashMap]}  treeDataMap             [以ID为键值的Hash表，方便快速查找]
 * @param  {[Array]}    renderIdList            [渲染的IdList]
 * @return {[Array]}    _renderIdList
 *
 */
var treeDataMapCheckRenderIdList = exports.treeDataMapCheckRenderIdList = function treeDataMapCheckRenderIdList(treeDataMap, renderIdList) {
    var _renderIdList = renderIdList.filter(function (id) {
        var parentVal = treeDataMap[id] && treeDataMap[id].parentVal;
        if (parentVal) {
            var parentItem = treeDataMap[parentVal];
            if (parentItem && !parentItem.isExpand) {
                return false;
            }
        }
        return true;
    });
    return _renderIdList;
};