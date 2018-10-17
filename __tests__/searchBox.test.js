import React from 'react';
import {shallow} from 'enzyme';

import SearchBox from '../src/searchBox';

var wrapper,
    searchVal = '',
    onSearch = jest.fn()
beforeAll(() => {
    wrapper = shallow(<SearchBox defaultProps={defaultProps} searchVal={searchVal} onSearch={onSearch}/>);
});

describe('<SearchBox />', () => {
    it('renders <SearchBox /> components', () => {
        expect(wrapper.find(`.${defaultProps.prefixClassName}-SearchBox`)).toHaveLength(1);
    });

    it('input a searchVal', () => {
        const input = wrapper.find(`.${defaultProps.prefixClassName}-SearchBox-input`)
        const searchVal = Math.floor(Math.random() * 100)
        input.simulate('input', {
            target: {
                value: searchVal
            }
        })
        expect(wrapper.state().searchVal).toBe(searchVal);
    });

    it('Trigger twice onSearch', () => {
        const input = wrapper.find(`.${defaultProps.prefixClassName}-SearchBox-input`)
        const inputSuffix = wrapper.find(`.${defaultProps.prefixClassName}-SearchBox-input-suffix`)
        inputSuffix.simulate('click');
        expect(onSearch).toHaveBeenCalledTimes(1);
        // first keyDown
        input.simulate('keyDown', {
            keyCode: 14
        });
        expect(onSearch).toHaveBeenCalledTimes(1);
        // second keyDown
        input.simulate('keyDown', {
            keyCode: 13
        });
        expect(onSearch).toHaveBeenCalledTimes(2);
    });
});