
import React from 'react';
import ReactDOM from 'react-dom';
import BigCalendarOriginal from 'react-big-calendar';
import moment from 'moment';
import { Paper, Card, CardTitle, CardText } from 'material-ui';
import Color from "../../util/Color";

BigCalendarOriginal.momentLocalizer(moment);
let allViews = Object.keys(BigCalendarOriginal.views).map(k => BigCalendarOriginal.views[k])

const messages = {
    day: 'Dia',
    date: 'Data',
    time: 'Hora',
    month: 'Mês',
    today: 'Hoje',
    week: 'Semana',
    event: 'Evento',
    next: 'Próximo',
    agenda: 'Agenda',
    tomorrow: 'Amanhã',
    yesterday: 'Ontem',
    previous: 'Anterior',
    allDay: 'Dia inteiro',
    showMore: function(total) {
        return 'mais +' + total;
    }
};

const timeRangeFormat = function(ref, culture, local) {
    return local.format(ref.start, 'HH:mm', culture) + ' — ' + local.format(ref.end, 'HH:mm', culture);
};

const formats = {
    dateFormat: 'DD',
    weekdayFormat: 'ddd',
    dayFormat: 'ddd DD/MM',
    agendaTimeFormat: 'HH:mm',
    timeGutterFormat: 'HH:mm',
    monthHeaderFormat: 'MMMM YYYY',
    dayHeaderFormat: 'dddd MMM DD',
    agendaDateFormat: 'dddd MMM DD',
    selectRangeFormat: timeRangeFormat,
    eventTimeRangeFormat: timeRangeFormat,
    agendaTimeRangeFormat: timeRangeFormat,
    dayRangeHeaderFormat: function(ref, culture, local) {
       return local.format(ref.start, 'MMMM DD', culture) + ' - ' + local.format(ref.end, 'DD', culture);
    },
    agendaHeaderFormat: function(ref, culture, local) {
        return local.format(ref.start, 'DD/MM/YYYY', culture);
    }
};

class BigCalendar extends React.Component
{
    constructor(props)
    {
        super(props);

        this.event = this.event.bind(this);
        this.onView = this.onView.bind(this);
        this.dayOver = this.dayOver.bind(this);
        this.weekOver = this.weekOver.bind(this);
        this.monthOver = this.monthOver.bind(this);
        this.agendaOver = this.agendaOver.bind(this);
        this.eventAgenda = this.eventAgenda.bind(this);
        this.state = {
            paperDisplay: 'none',
            paperContent: '',
            paperColor: '',
            paperLeft: '',
            view: 'month',
            paperTop: ''
        };
    }

    onView(view)
    {
        this.setState({view: view});
        this.props.onNavigate(null, view);
    }

    componentWillReceiveProps(nextProps)
    {
        if (this.state.paperDisplay != nextProps.paperDisplay) {
            this.setState({paperDisplay: nextProps.paperDisplay});
        }
    }

    over(div, evento, recursion, t, l)
    {
        var cumulativeOffset = function(element) {
            var top = 0, left = 0, scroll = 0;

            while (recursion) {
                scroll += element.scrollTop;
                top += element.offsetTop  || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
                recursion--;
            }

            top += div.parentElement.offsetHeight + t - scroll;
            return {top: top, left: left + l};
        },
        pos = cumulativeOffset(div.parentElement);

        this.setState({
            paperDisplay: 'block',
            paperColor: evento.color,
            paperContent: <ul>
                <li style={{fontWeight: 'bold', listStyleType: 'none'}}>{evento.titulo}</li>
                <li style={{listStyleType: 'none'}}>Tipo ação: {evento.acao}</li>
                <li style={{listStyleType: 'none'}}>Responsáveis: {evento.responsaveis}</li>
                <li style={{listStyleType: 'none'}}>Criado por: {evento.pessoa_criado}</li>
                <li style={{listStyleType: 'none'}}>Comentário: {evento.comentario}</li>
                <li style={{listStyleType: 'none'}}>Contato: {(evento.contato) ? evento.contato : 'Não há contato vinculado'}</li>
            </ul>,
            paperLeft: pos.left,
            paperTop: pos.top
        });
    }

    monthOver(e, evento)
    {
        this.over((e.target.tagName === 'LABEL' ? e.target.parentElement : e.target), evento, (e.target.offsetParent.getAttribute('class') === 'rbc-overlay' ? 3 : 4), 5, -5);
    }

    agendaOver(e, evento)
    {
        this.over((e.target.tagName === 'LABEL' ? e.target.parentElement : e.target), evento, 2, 0, 10);
    }

    weekOver(e, evento)
    {
        this.over((e.target.tagName === 'LABEL' ? e.target.parentElement : e.target), evento, 4, 10, -80);
    }

    dayOver(e, evento)
    {
        this.over((e.target.tagName === 'LABEL' ? e.target.parentElement : e.target), evento, 4, 10, -80);
    }

    element(event, style)
    {
        return (
            <div
                style={style}
                onMouseOver={(e) => this[this.state.view + 'Over'](e, event)}
                onMouseOut={() => this.setState({paperDisplay: 'none', paperContent: ''})}
            >
                <label>{event.hora_evento + ' - ' + event.titulo}</label>
            </div>
        );
    }

    event({ event })
    {
        var style = {width: "100%"};
        if (this.state.view === 'week' || this.state.view === 'day') {
            style.position = 'absolute';
            style.paddingLeft = 80;
            style.left = 0;
        }

        return this.element(event, style);
    }

    eventAgenda({ event })
    {
        var style = {
            color: Color.getContrastYiq(event.color),
            background: event.color,
            borderRadius: '4px',
            paddingLeft: 10,
            width: "100%"
        };
        return this.element(event, style);
    }

    render()
    {
        //const {...other} = this.props;
        return (
            <div style={{width: '100%', height: '100%', position: 'relative'}}>
                <Paper style={{
                    zIndex: 9999,
                    opacity: '0.9',
                    padding: '7px',
                    borderRadius: '4px',
                    position: 'absolute',
                    maxWidth: '280px',
                    minWidth: '50px',
                    fontSize: '11px',
                    lineHeight: '12px',
                    top: this.state.paperTop,
                    left: this.state.paperLeft,
                    display: this.state.paperDisplay,
                    background: this.state.paperColor,
                    color: Color.getContrastYiq(this.state.paperColor)
                }} zDepth={1}>{this.state.paperContent}</Paper>

                <BigCalendarOriginal
                    popup
                    selectable
                    culture="pt-BR"
                    views={allViews}
                    formats={formats}

                    defaultView='month'
                    messages={messages}
                    defaultDate={new Date()}
                    scrollToTime={new Date(2000, 1, 1)}
                    onView={(view) => this.onView(view)}
                    components={{ event: this.event, agenda: {event: this.eventAgenda} }}
                />
            </div>
        );
    }
}

export default BigCalendar;
