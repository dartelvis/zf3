import React from 'react';
import PropTypes from 'prop-types';
import VMasker from 'vanilla-masker';
import * as UI from 'material-ui';

/**
 * https://medium.com/@lawrentiy/react-material-ui-vmasker-24d0940e3930#.d0wrzweh1
 */
class MaskedTextField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: props.value || ''}; // set initial value from default value in props
    }

    componentWillReceiveProps(nextProps)
    {
        if (this.state.value != nextProps.value) {
            this.setState({value: nextProps.value || ''});
        }
    }

    onChange(mask, e) {
        var value = '';
        switch (mask) {
            case 'money':
                value = VMasker.toMoney(e.target.value, {separator: '.', delimiter: ','}).replace(/[,]/g, '');
                break;

            case 'number':
                value = VMasker.toNumber(e.target.value);
                break;

            default:
                value = VMasker.toPattern(e.target.value, mask);
                break;
        }

        this.setState({ value });
        if (this.props.onChange) {
            this.props.onChange(value, e);
        }
    }

    render() {
        delete other.defaultValue; // remove default value from TextField input (see link below)
        other.onChange = this.onChange.bind(this, mask);
        other.value = this.state.value;
        return (<UI.TextField  />);
    }
}

MaskedTextField.propTypes = {
    mask: PropTypes.string
};

export default MaskedTextField;
