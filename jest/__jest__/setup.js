const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

global.defaultProps = {
    style: {
        width: 320,
        height: 800,
        overflow: 'auto'
    },
    showlevel: 0,
    checkbox: {
        enable: false,
        parentChain: true,      // 影响父级节点；
        childrenChain: true,    // 影响子级节点;
        halfChain: true,        // 即使子级节点被全部选中影响父级节点半选；
        initCheckedList: []     // 初始化多选数组
    },
    prefixClassName: 'do',
    paddingLeftLevel: 20
}

window.innerWidth = 320
window.innerHeight = 800