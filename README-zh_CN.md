# react-do-tree-select
一个选择树[React]组件.


[![NPM version](https://img.shields.io/npm/v/react-do-tree-select.svg?style=flat)](https://www.npmjs.com/package/react-do-tree-select)
![NPM license](https://img.shields.io/npm/l/react-do-tree-select.svg?style=flat)
[![NPM total downloads](https://img.shields.io/npm/dt/react-do-tree-select.svg?style=flat)](https://www.npmjs.com/package/react-do-tree-select?minimal=true)

[English document](./README.md)

## 安装
```bash
npm install react-do-tree-select --save

# or

yarn install react-do-tree-select
```
react-do-tree-select 基于 React

##例子
下面是一个简单的例子


```js
import React from 'react';
import TreeSelect from 'react-do-tree-select';

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            selectVal: '',
            showlevel: 0,
        }
        this.onSelect = this.onSelect.bind(this);
        this.onChecked = this.onChecked.bind(this);
        this.customTitleRender = this.customTitleRender.bind(this);
    }

    componentDidMount() {
        const treeData = Data;
        this.setState({treeData});
    }
  
    customTitleRender(item) {
        return item.title
    }

    onSelect(val, e) {
        console.log(val);
    }

    onChecked(val, e) {
        console.log(val);
    }


  render() {
    return (
        const { treeData, showlevel } = this.state;
        const checkbox = {
            enable: true,
            parentChain: true,              // child Affects parent nodes;
            childrenChain: true,            // parent Affects child nodes;
            halfChain: true,                // The selection of child nodes affects the semi-selection of parent nodes.
            initCheckedList: []             // Initialize check multiple lists
        }
        return (
            <div className="App">
                <TreeSelect
                    treeData = {treeData}
                    style = {{
                        width: 320,
                        height: 600,
                    }}
                    selectVal = {this.state.selectVal}
                    onSelect = {this.onSelect}
                    onChecked = {this.onChecked}
                    checkbox = {checkbox}
                    showlevel = {showlevel}
                    customTitleRender = {this.customTitleRender}/>
            </div>
        );
    );
  }
}
```
Data.js
```js
export default [
    {
        title: '广东省',
        value: '1',
        children: [
            {
                title: '广州市',
                value: '1-1',
                children: [
                    {
                        title: '越秀区',
                        value: '1-1-1',
                    },{
                        title: '白云区',
                        value: '1-1-2',
                    }
                ]
            },{
                title: '珠海市',
                value: '1-2',
                disabled: true,
            },{
                title: '深圳市',
                value: '1-3',
            }
        ]
    },{
        title: '广西省',
        value: '2',
        children: [
            {
                title: '南宁市',
                value: '2-1',
            },{
                title: '桂林市',
                value: '2-2',
            },{
                title: '玉林市',
                value: '2-3',
            }
        ]
    }
]
```

## API

| 参数 | 说明 | 类型 | 默认值 | 是否必需 |
| -------- | ----------- | ---- | ------- | -------- |
| treeData | 组件的源数据 [配置](#treeData) | array | - | true |
| showlevel | 树组件展开的层级  | number | 0 |
| checkbox | 复选功能 [配置](#checkbox) | object | - |
| wrapperClassName | 扩展类名 | string | - |
| selectVal | 初始化选中的条目 | string | - |
| style | 自定义样式 | object | {width: 320, height: 800} |
| onSelect | 条目被点击的回调函数 | function( item, event ) | - |
| onChecked | 勾选的回调函数 | function( items, event ) | - |
| customIconRender | 自定义图标，位置在标题后面渲染 | function(item) : DOM | - |
| customTitleRender | 自定义标题 | function(item) : DOM | - |

### treeData
| 参数 | 说明 | 类型 | 默认值 | 是否必需 |
| -------- | ----------- | ---- | ------- | -------- |
| title | 标题 | string | - |
| value | 唯一标识 | string | - |
| disabled | 是否禁用 | bool | false |
| children | 子级 | array | - |

### checkbox

| 参数 | 说明 | 类型 | 默认值 | 是否必需 |
| -------- | ----------- | ---- | ------- | -------- |
| enable | 复选功能的开关 | bool | false |
| parentChain | 子级影响父级联动 | bool | true |
| childrenChain | 父级影响子级联动 | bool | true |
| halfChain | 子级节点被全部选中影响父级节点半选 | bool | true |
| initCheckedList | 初始化勾选的条目 | array | - |

[React]: https://github.com/facebook/react