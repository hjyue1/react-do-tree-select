import React, { Component } from 'react';
import './style/search.css';


class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: props.searchVal
        }
        this.clickSearchIcon = this.clickSearchIcon.bind(this);
        this.onKeyDown       = this.onKeyDown.bind(this);
        this.onInput         = this.onInput.bind(this);
    }

    componentDidCatch(err) {
        console.log(err)
    }

    clickSearchIcon() {
        this.props.onSearch(this.state.searchVal)
    }

    onKeyDown(e) {
        const evt = e || window.event ; 
        if (evt.keyCode === 13){
            //回车事件
            this.clickSearchIcon()
        }
    }

    onInput(e) {
        this.setState({
            searchVal: e.target.value
        })
    }

    render() {
        const { defaultProps } = this.props;
        const prefixClassName =     defaultProps.prefixClassName;
        const _className =          `${prefixClassName}-SearchBox`
        return (
            <div className={_className}>
                <input className={`${prefixClassName}-SearchBox-input`} type="text" onInput={this.onInput} onKeyDown={this.onKeyDown}/>
                <span className={`${prefixClassName}-SearchBox-input-suffix`} onClick={this.clickSearchIcon}>
                    <i className={`${prefixClassName}-icon-search`}></i>
                </span>
            </div>
        );
    }
}

export default SearchBox;
