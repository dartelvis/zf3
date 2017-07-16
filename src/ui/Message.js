
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Dialog, FlatButton } from 'material-ui';

class Message extends React.Component
{
    constructor(props)
    {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose()
    {
        this.props.close();
    }

    handleCloseCallback(key)
    {
        this.props.confirm[key] && this.props.confirm[key]();
        this.props.close();
    }

    render()
    {
        var actions = [];

        if (this.props.confirm) {
            for (var a in this.props.confirm) {
                actions.push((
                    <FlatButton
                        label={a}
                        primary={true}
                        onTouchTap={this.handleCloseCallback.bind(this, a)}
                    />
                ));
            }
        } else {
            actions.push((
                <FlatButton label="Fechar" primary={true} onTouchTap={this.handleClose}/>
            ));
        }

        return (
            <Dialog
                style={{zIndex: 2000}}
                overlayStyle={{zIndex: 2000}}
                contentStyle={{zIndex: 2001}}
                ref={(input) => this.dialog = input}
                title={this.props.title}
                actions={actions}
                modal={true}
                open={this.props.open}
                autoScrollBodyContent={!!this.props.content}
            >
                {this.props.content}
            </Dialog>
        );
    }
};

const mapStateToProps = function(store) {
    return {
        open: store.message.open,
        title: store.message.title,
        content: store.message.content,
        confirm: store.message.confirm
    };
};

const mapDispatchToProps = function(dispatch){
    return {
        close: function() {
            dispatch({
                type: 'MESSAGE',
                data: {
                    open: false,
                    content: null,
                    title: '',
                    confirm: null
                }
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);
