
import React from 'react';

import DatePickerOriginal from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

class DatePicker extends React.Component
{
    constructor(props)
    {
        super(props);

        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.state = {
            date: '',
            time: ''
        };
    }

    componentWillMount()
    {
        this.props.data.value && this.setData(this.props.data.value);
    }

    componentWillReceiveProps(nextProps)
    {
        if (this.getData() != nextProps.data.value) {
            this.setData(nextProps.data.value || '');
        }
    }

    getData()
    {
        return (this.state.date || '') + (this.state.time ? (' ' + this.state.time) : '');
    }

    setData(dataHora)
    {
        var data = (dataHora ? dataHora.split(' ') : []);
        this.setState({
            date: (data[0] ? data[0] : ''),
            time: (data[1] ? data[1] : '')
        });
    }

    onChangeDate(value)
    {
        this.setState({date: value});
        this.props.onChange(this.props.data.name, this.getData());
    }

    onChangeTime(v)
    {
        this.setState({time: moment(v).format(this.props.data.time)});
        this.props.onChange(this.props.data.name, this.getData());
    }

    render()
    {
        var campo = this.props.data,
            styleDate = (campo.time ? {paddingRight: 0} : {}),
            styleTime = (campo.time ? {paddingLeft: 0} : {}),
            date = (<DatePickerOriginal
                okLabel='OK'
                autoOk={true}
                locale="pt-BR"
                hintText="pt-BR"
                fullWidth={true}
                cancelLabel='Cancelar'
                firstDayOfWeek={0}
                floatingLabelText={campo.label}
                DateTimeFormat={Intl.DateTimeFormat}
                onChange={(e, v) => this.onChangeDate(moment(v).format(campo.format))}
                value={this.state.date ? moment(this.state.date, campo.format).toDate() : null}
            />);

        if (!campo.time) {
            return date;
        }

        return (
            <div className="row">
                <div className="col-md-6"  style={styleDate}>
                    {date}
                </div>
                <div className="col-md-6" style={styleTime}>
                    <TimePicker
                        format="24hr"
                        okLabel='OK'
                        autoOk={true}
                        hintText="pt-BR"
                        fullWidth={true}
                container="inline"
                        cancelLabel='Cancelar'
                        floatingLabelText='Hora'
                        value={this.state.time ? moment(this.state.time, campo.time).toDate() : null}
                        onChange={(e, v) => this.onChangeTime(v)}
                    />
                </div>
            </div>
        );
    }
}

export default DatePicker;
