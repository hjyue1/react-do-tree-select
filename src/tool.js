
// 判断是否为空数组
export const isEmptyArray = (arr) => {
    if (!arr) return true
    if (arr instanceof Array) {
        return arr.length <= 0
    }
    return true
}

// 把条目加入数组中并去重
export const addArrayItem = (arr, node) => {
    const idx = arr.indexOf(node)
    if (idx === -1) {
        arr.push(node);
    }
}


// 删除数组中条目
export const delArrayItem = (arr, node) => {
    const idx = arr.indexOf(node)
    if (idx > -1) {
        arr.splice(idx, 1);
    }
}

// 生成树数据的map
export const generateTreeDataMap = (parent, treeData, defaultConfig, level = 0, _map = {}, _idList = [], _renderIdList = []) => {
    const map = _map
    const _level = level
    const { showlevel } = defaultConfig
    let idList = _idList
    let renderIdList = _renderIdList
    treeData.forEach((item) => {
        if (map[item.value]) {
            throw new Error('The value must be unique')
        }
        const isExpand = showlevel >= level 
        if (isExpand) {
            renderIdList.push(item.value)
            if (!isEmptyArray(item.children) && showlevel === level) {
                item.children.forEach((_item) => renderIdList.push(_item.value))
            }
        }

        idList.push(item.value)

        map[item.value] = {
            ...item,
            level: _level,
            isExpand,
            checkStatus: {
                checked: false,
                halfChecked: false,
            },
            parentVal: (parent && parent.value) || null
        }
        if (!isEmptyArray(item.children)) {
            map[item.value].children = item.children.map((_item) => _item.value)
            generateTreeDataMap(item, item.children, defaultConfig, _level + 1, map, idList, renderIdList)
        }
    })
    return {
        map,
        idList,
        renderIdList
    }
}

/**
 * [childCheckedStatus 检查子节点的选中情况]
 * @method childCheckedStatus
 * @param  {[Array]}   children     [节点的子节点集合]
 * @param {[HashMap]}  TreeDataMap  [以ID为键值的Hash表]
 * @param  {[Object]}  checkbox     [配置]
 * @return {[Object]}               [节点的选中状态]
 * 
 */
export const childCheckedStatus = (children, TreeDataMap, checkbox) => {
    // 子级节点被全部选中影响父级节点半选
    const { halfChain } = checkbox

    let checked = !halfChain;
    let halfChecked = false;
    children.forEach((item)=>{
        const { checkStatus } = TreeDataMap[item];
        if (checkStatus.halfChecked || checkStatus.checked){
            halfChecked = true;
        }
        if (!checkStatus.checked){
            checked = false;
        }
    })

    if(checked && halfChecked) {
        if(halfChain) {
            checked = false;
        }else {
            halfChecked = false;
        }
        
    }
    return {
        checked,
        halfChecked
    };
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
    if (parentNode){
        const checkStatus = childCheckedStatus(parentNode.children, TreeDataMap, config)
        Object.assign(parentNode, {
            checkStatus
        }); 

        // 加入/移除 选中的父节点Value列表
        if(checkStatus.checked) {
            addArrayItem(checkedList, parentNode.value)
        }else {
            delArrayItem(checkedList, parentNode.value)
        }

        // 递归
        if ( "undefined" !== typeof parentNode.parentVal ){
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
    if(!children) {
        // console.log('子节点不存在')
        return
    }
    children.forEach((id) => {
        let node = TreeDataMap[id];
        if(node.disabled) {
            // 被禁用的无法选中
            // return
        }else {
            node.checkStatus = {
                checked: checked,
                halfChecked: false
            }
            if(checked) {
                addArrayItem(checkedList, node.value)
            }else {
                delArrayItem(checkedList, node.value)
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
 * @param  {[String]]}  val            [搜索条件]
 * @return {[Boolean]}               [true-满足 / false-不满足]
 * 
 */
export const filterListCheckChildren = (_children, treeDataMap, val) => {
    return _children.some((item)=>{
        const { title, value, children } = treeDataMap[item];
        if( title.indexOf(val) > -1 ) {
            return true
        }
        if(!isEmptyArray(children)) {
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
export const getFilterIdList = (idList, treeDataMap, val, filterIdList = [], ) => {
    let _filterIdList = filterIdList;
    idList.forEach((item) => {
        const { title, value, children, parentVal, isExpand } = treeDataMap[item];

        if (parentVal) {
            treeDataMap[parentVal] = {
                ...treeDataMap[parentVal],
                isExpand: true
            }
        }

        if (title.indexOf(val) > -1 || (!isEmptyArray(children) && filterListCheckChildren(children, treeDataMap, val))) {
            console.log(value)
            return _filterIdList.push(value)
        }
    })
    return _filterIdList
}