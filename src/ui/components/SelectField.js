
import React from 'react';

import { MenuItem } from 'material-ui';
import SelectFieldOriginal from 'material-ui/SelectField';

class SelectField extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onChange = this.onChange.bind(this);
        var value = this.props.data.value;

        // string caso (multiple === false)
        this.state = {value: (value && typeof value === 'object' ? value : (value || '').toString())};
    }

    componentWillReceiveProps(nextProps)
    {
        if (this.state[nextProps.data.name] != nextProps.data.value) {
            var value = nextProps.data.value;
            // string caso (multiple === false)
            this.setState({value: (value && typeof value === 'object' ? value : (value || '').toString())});
        }
    }

    onChange(value)
    {
        this.props.onChange(this.props.data.name, value);
        this.setState({value: value});
    }

    render()
    {
        var select = this.props.data,
            value = this.state.value,
            menusElm = [];

        if (typeof value === 'object' && !value.length) {
            value = '';
        }

        select.items.map((item) => {
            item.id = item.id.toString();
            menusElm.push(
                <MenuItem
                    key={item.id}
                    value={item.id}
                    insetChildren={true}
                    primaryText={item.name}
                    checked={(item.id && value && value.includes(item.id)) || false}
                />
            );
        });

        return (
            <SelectFieldOriginal
                fullWidth={true}
                value={value || ''}
                floatingLabelText={select.label}
                multiple={select.multiple || false}
                required={select.required || false}
                disabled={select.disabled || false}
                errorText={select.required ? ' ' : ''}
                onChange={(a, b, v) => this.onChange(v)}
            >
                {menusElm}
            </SelectFieldOriginal>
        );
    }
}

export default SelectField;
