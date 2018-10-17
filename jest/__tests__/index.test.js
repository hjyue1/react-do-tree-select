'use strict';
import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Index from '../../src/index';
import treeData from '../../data'

var wrapper;
beforeAll(() => {
    sinon.spy(Index, 'getDerivedStateFromProps');
    wrapper = mount(<Index treeData={treeData} checkbox={{
        enable: true,
        parentChain: true,              // child Affects parent nodes;
        childrenChain: true,            // parent Affects child nodes;
        halfChain: true,                // The selection of child nodes affects the semi-selection of parent nodes.
        initCheckedList: ['1', '1-1-1', '3']             // Initialize check multiple lists
    }}/>);
});


describe('<Index />', () => {
    it('renders <Index /> components', () => {
        expect(Index.getDerivedStateFromProps.callCount).toEqual(1)
        expect(wrapper.find(`.${defaultProps.prefixClassName}-TreeSelect`)).toHaveLength(1);
        expect(wrapper.find('AutoSizer')).toHaveLength(1);
    });

    it('simulation of the click', () => {
        // 点击收缩 广东省
        const treeNode = wrapper.find(`.${defaultProps.prefixClassName}-TreeNode`).at(0)
        const prevSelectVal = wrapper.state().selectVal
        treeNode.simulate('click');
        expect(wrapper.state().selectVal).not.toBe(prevSelectVal)
        // 点击展开 广东省
        treeNode.simulate('click');

        // 广州市 
        const treeNodeCheckbox_Guangzhou = wrapper.find(`.${defaultProps.prefixClassName}-TreeNode`).at(1)
        treeNodeCheckbox_Guangzhou.simulate('click');
        expect(wrapper.find(`.${defaultProps.prefixClassName}-TreeNode`).at(2).text()).toEqual('越秀区')
    })


    it('simulation of the check', () => {
        // 广东省 复选框
        const treeNodeCheckbox = wrapper.find(`.${defaultProps.prefixClassName}-checkbox-inner`).at(0)
        treeNodeCheckbox.simulate('click');
        expect(wrapper.state().checkedList.size).toEqual(0)
        treeNodeCheckbox.simulate('click');
        expect(wrapper.state().checkedList.size).toEqual(5)
        // 广州市 复选框
        const treeNodeCheckbox_Guangzhou = wrapper.find(`.${defaultProps.prefixClassName}-checkbox-inner`).at(1)
        treeNodeCheckbox_Guangzhou.simulate('click');
        // 越秀区 复选框
        const treeNodeCheckbox_Yuexiu = wrapper.find(`.${defaultProps.prefixClassName}-checkbox-inner`).at(2)
        treeNodeCheckbox_Yuexiu.simulate('click');
    })

    it('simulation of the search', ()=>{
        const input = wrapper.find(`.${defaultProps.prefixClassName}-SearchBox-input`)
        const searchVal = '越秀区'
        const simulationSearch = (val = "")=> {
            input.simulate('input', {
                target: {
                    value: val
                }
            })
            input.simulate('keyDown', {
                keyCode: 13
            });
        }
        simulationSearch(searchVal)
        expect(wrapper.state().searchVal).toBe(searchVal);

        simulationSearch()
        expect(wrapper.state().searchVal).toBe('');

    })
});