
import React from 'react';

import {TreeNode, Utils} from 'react-tree-menu';
import Tree from 'react-tree-menu';

class TreeMenu extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data: props.data
        };
    }

    handleTreeChange(propName, lineage)
    {
        this.setState(Utils.getNewTreeState(lineage, this.state.data, propName));
    }

    render()
    {
        const {...other} = this.props;
        return (
            <Tree
                expandIconClass="glyphicon glyphicon-chevron-down"
                collapseIconClass="glyphicon glyphicon-chevron-up"
                onTreeNodeCollapseChange={this.handleTreeChange.bind(this, "collapsed")}
                onTreeNodeCheckChange={this.handleTreeChange.bind(this, "checked")}
                {...other}
            />
        );
    }
}

export default TreeMenu;
