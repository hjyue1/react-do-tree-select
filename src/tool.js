// 判断是否为空数组
export const isEmptyArray = (arr) => {
    if (!arr) 
        return true
    if (arr instanceof Array) {
        return arr.length <= 0
    }
    return true
}

// 把条目加入Map
export const addMapItem = (arr, node) => {
    arr.set(node, node)
}

// 删除Map中条目
export const delMapItem = (map, node) => {
    if(map.has(node)){
        map.delete(node)
    }
}

// 生成树数据的map
/**
 * [generateTreeDataMap 检查子节点的选中情况]
 * @method generateTreeDataMap
 * @param  {[Object]}   parent              [父节点]
 * @param  {[Array]}    treeData            [源数据]
 * @param  {[Object]}   defaultConfig       [配置]
 * @param  {[Map]}      initCheckedList     [初始化勾选列表]
 * @param  {[Map]}      _checkedList        [勾选列表]
 * @param  {[number]}   level               [展开级别]
 * @param  {[Object]}   _map                [以ID为键值的Hash表]
 * @param  {[Array]}    _idList             [所有的idList]
 * @param  {[Array]}    _renderIdList       [渲染的IdList]
 * @return {[Object]}               
 *
 */
export const generateTreeDataMap = (parent, treeData, defaultConfig, initCheckedList, _checkedList, level = 0, _map = {}, _idList = [], _renderIdList = []) => {
    const map = _map
    const _level = level
    const {showlevel} = defaultConfig
    let idList = _idList
    let renderIdList = _renderIdList
    const checkedList = _checkedList
    
    treeData.forEach((item) => {
        const _value = item.value.toString()
        if (map[_value]) {
            throw new Error('The value must be unique')
        }
        const isExpand = showlevel >= level
        if (isExpand) {
            renderIdList.push(_value)
            if (!isEmptyArray(item.children) && showlevel === level) {
                item
                    .children
                    .forEach((_item) => renderIdList.push(_item.value))
            }
        }

        idList.push(_value)
        const checked = initCheckedList.has(item.value)
        checked && checkedList.set(item.value, item.value)
        map[_value] = {
            ...item,
            level: _level,
            isExpand,
            checkStatus: {
                checked: checked,
                halfChecked: false
            },
            parentVal: (parent && parent.value) || null
        }
        if (!isEmptyArray(item.children)) {
            map[_value].children = item
                .children
                .map((_item) => _item.value)
            generateTreeDataMap(item, item.children, defaultConfig, initCheckedList, checkedList, _level + 1, map, idList, renderIdList)
        }
    })
    return {map, idList, renderIdList, checkedList}
}

/**
 * [childCheckedStatus 检查子节点的选中情况]
 * @method childCheckedStatus
 * @param  {[Array]}    children        [节点的子节点集合]
 * @param  {[HashMap]}  TreeDataMap     [以ID为键值的Hash表]
 * @param  {[Object]}   checkbox        [配置]
 * @return {[Object]}                   [节点的选中状态]
 *
 */
export const childCheckedStatus = (children, TreeDataMap, checkbox) => {
    // 子级节点被全部选中影响父级节点半选
    const {halfChain} = checkbox
    // 开启半选功能 勾选默认为true
    let checked = !halfChain;
    // 半选默认为false
    let halfChecked = false;

    children.forEach((item) => {
        const {checkStatus} = TreeDataMap[item];
        // 该节点的半选或者勾选为true 
        if (checkStatus.halfChecked || checkStatus.checked) {
            halfChecked = true;
        }
        // 有一个节点的勾选为false
        if (!checkStatus.checked) {
            checked = false;
        }
    })

    if (checked && halfChecked) {
        if (halfChain) {
            checked = false;
        } else {
            halfChecked = false;
        }

    }
    return {checked, halfChecked};
}

/**
 * [parentChain 设置父节点checkbox状态]
 * @method parentChain
 * @param {[HashMap]} TreeDataMap  [以ID为键值的Hash表，方便快速查找]
 * @param {[Object]}  parentNode   [父节点]
 * @param {[Object]}  config       [配置]
 * @param {[Array]}   checkedList  [选中复选框的Value列表]]]
 * @return {[null]}   null
 */
export const parentChain = (TreeDataMap, parentNode, config, checkedList) => {
    if (parentNode) {
        const checkStatus = childCheckedStatus(parentNode.children, TreeDataMap, config)
        Object.assign(parentNode, {checkStatus});

        // 加入/移除 选中的父节点Value列表
        if (checkStatus.checked) {
            addMapItem(checkedList, parentNode.value)
        } else {
            delMapItem(checkedList, parentNode.value)
        }

        // 递归
        if ("undefined" !== typeof parentNode.parentVal) {
            parentChain(TreeDataMap, TreeDataMap[parentNode.parentVal], config, checkedList);
        }
    }
}

/**
 * [childrenChain 设置子节点的checkbox状态]
 * @method childrenChain
 * @param {[HashMap]} 	TreeDataMap 	[以ID为键值的Hash表]
 * @param {[Array]} 	children 	[子节点数组]
 * @param {[bool]}  	checked  	[checkbox状态]
 * @param {[Array]}  	checkedList  	[选中复选框的Value列表]]]
 * @return {[null]}     null
 */
export const childrenChain = (TreeDataMap, children, checked, checkedList) => {
    if (!children) {
        // console.log('子节点不存在')
        return
    }
    children.forEach((id) => {
        let node = TreeDataMap[id];
        if (node.disabled) {
            // 被禁用的无法选中 return
        } else {
            node.checkStatus = {
                checked: checked,
                halfChecked: false
            }
            if (checked) {
                addMapItem(checkedList, node.value)
            } else {
                delMapItem(checkedList, node.value)
            }
        }
        if (node.children) {
            childrenChain(TreeDataMap, node.children, checked, checkedList);
        }
    })
}

/**
 * [findAllChildren 查找指定的所有子节点]
 * @method findAllChildren
 * @param  {[Array]}   children     [子节点集合]
 * @param  {[HashMap]} TreeDataMap  [以ID为键值的Hash表，方便快速查找]
 * @param  {[Array]}  _arr          [递归返回值]
 * @return {[Array]}  arr          [子节点数组]
 *
 */
export const findAllChildren = (children, treeDataMap, _arr = []) => {
    const arr = _arr
    children.forEach((item) => {
        const _item = treeDataMap[item]
        arr.push(item)
        if (!isEmptyArray(_item.children)) {
            findAllChildren(_item.children, treeDataMap, arr)
        }
    })
    return arr
}

/**
 * [filterListCheckChildren 搜索功能-过滤列表ID的子节点是否满足搜索条件]
 * @method filterListCheckChildren
 * @param  {[Array]}   _children     [子节点集合]
 * @param  {[HashMap]} treeDataMap   [以ID为键值的Hash表，方便快速查找]
 * @param  {[String]]}  val          [搜索条件]
 * @return {[Boolean]}               [true-满足 / false-不满足]
 *
 */
export const filterListCheckChildren = (_children, treeDataMap, val) => {
    return _children.some((item) => {
        const {title, value, children} = treeDataMap[item];
        if (title.indexOf(val) > -1) {
            return true
        }
        if (!isEmptyArray(children)) {
            return filterListCheckChildren(children, treeDataMap, val)
        }
        return false
    })
}

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
export const getFilterIdList = (idList, treeDataMap, val, filterIdList = [],) => {
    let _filterIdList = filterIdList;
    idList.forEach((item) => {
        const {title, value, children, parentVal} = treeDataMap[item];

        if (title.indexOf(val) > -1 || (!isEmptyArray(children) && filterListCheckChildren(children, treeDataMap, val))) {
            // console.log(value)

            if (parentVal) {
                // 父级展开isExpand
                treeDataMap[parentVal] = {
                    ...treeDataMap[parentVal],
                    isExpand: true
                }
            }
            return _filterIdList.push(value)
        }
    })
    return _filterIdList
}

/**
 * [treeDataMapCheckRenderIdList 根据treeDataMap检查RenderIdList中是否有父级不展开的情况]
 * @method treeDataMapCheckRenderIdList
 * @param  {[HashMap]}  treeDataMap             [以ID为键值的Hash表，方便快速查找]
 * @param  {[Array]}    renderIdList            [渲染的IdList]
 * @return {[Array]}    _renderIdList
 *
 */
export const treeDataMapCheckRenderIdList = (treeDataMap, renderIdList) => {
    const _renderIdList = renderIdList.filter((id) => {
        const parentVal = treeDataMap[id] && treeDataMap[id].parentVal
        if (parentVal) {
            const parentItem = treeDataMap[parentVal];
            if (parentItem && !parentItem.isExpand) {
                return false
            }
        }
        return true
    })
    return _renderIdList
}

/**
 * [checkedCheckedList 根据checkedList检查树种的勾选]
 * @method checkedCheckedList
 * @param  {[HashMap]}  treeDataMap             [以ID为键值的Hash表，方便快速查找]
 * @param  {[Array]}    checkedList             [勾选的IdList]
 * @return {[Object]}    checkbox               [配置]
 *
 */
export const checkedCheckedList = (treeDataMap, checkedList, checkbox) => {
    // 检查checked的List
    checkedList.forEach((value) => {
        const treeItem = treeDataMap[value]
        const parentVal = treeItem.parentVal
        checkbox.parentChain && parentVal && _parentChain(treeDataMap, treeDataMap[parentVal], checkbox, checkedList)
    })
}

/**
 * [_parentChain 初始化时设置父节点checkbox状态]
 * @method _parentChain
 * @param {[HashMap]} treeDataMap  [以ID为键值的Hash表，方便快速查找]
 * @param {[Object]}  parentNode   [当前节点]
 * @return {[null]}   null
 */
export const _parentChain = (treeDataMap, parentNode) => {
    if (parentNode) {
        const isHalf = parentNode.children.some((item)=>{
            const currentNode = treeDataMap[item]
            if(currentNode.checkStatus.checked || currentNode.checkStatus.halfChecked){
                return true
            }
            return false
        })
        parentNode.checkStatus.halfChecked = isHalf
        // 递归
        if ("undefined" !== typeof parentNode.parentVal) {
            _parentChain(treeDataMap, treeDataMap[parentNode.parentVal]);
        }
    }
}