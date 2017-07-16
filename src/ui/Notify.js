
import React from 'react';
import { connect } from 'react-redux';
import { Snackbar } from 'material-ui';

class Notify extends React.Component
{
    constructor(props)
    {
        super(props);
        this.onSnackbarClose = this.onSnackbarClose.bind(this);
    }

    onSnackbarClose()
    {
        this.props.close();
    }

    render()
    {
        return (
            <Snackbar
                open={this.props.snackbar}
                message={this.props.msg}
                autoHideDuration={4000}
                onRequestClose={this.onSnackbarClose}
            />
        );
    }
};

const mapStateToProps = function(store) {
    return {
        snackbar: !!store.notify.msg,
        msg: store.notify.msg
    };
};

const mapDispatchToProps = function(dispatch){
    return {
        close: function() {
            dispatch({
                type: 'NOTIFY',
                data: {
                    msg: ''
                }
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notify);
