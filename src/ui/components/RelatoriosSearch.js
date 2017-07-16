
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {CardActions, FloatingActionButton, CardTitle, CardText, Card, CardHeader, RaisedButton, TextField, MenuItem, GridList, GridTile, AutoComplete } from 'material-ui';
import moment from 'moment';
import ActionSearch from 'material-ui/svg-icons/action/search';

import DatePicker from "../../ui/components/DatePicker";
import SelectField from "../../ui/components/SelectField";

const tipos = {
    boolean: {
        'it': 'verdadeiro',
        'if': 'falso',
        'nu': 'nulo',
        'nn': 'não nulo'
    },
    varchar: {
        eq: 'igual',
        ne: 'diferente',
        bw: 'inicia com',
        bn: 'não inicia com',
        ew: 'termina com',
        en: 'não termina com',
        cn: 'contém',
        nc: 'não contém',
        nu: 'nulo',
        nn: 'não nulo',
        in: 'está em',
        ni: 'não está em'
    },
    numeric: {
        eq: 'igual',
        ne: 'diferente',
        lt: 'menor',
        le: 'menor ou igual',
        gt: 'maior',
        ge: 'maior ou igual',
        nu: 'nulo',
        nn: 'não nulo',
        in: 'está em',
        ni: 'não está em'
    },
    integer: {
        eq: 'igual',
        ne: 'diferente',
        lt: 'menor',
        le: 'menor ou igual',
        gt: 'maior',
        ge: 'maior ou igual',
        nu: 'nulo',
        nn: 'não nulo',
        in: 'está em',
        ni: 'não está em'
    }
};

class RelatoriosSearch extends React.Component
{
    constructor(props)
    {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setFiltros = this.setFiltros.bind(this);
        this.handleAutoComplete = this.handleAutoComplete.bind(this);
        this.state = {
            operadores: [],
            responsaveis: []
        };  
        var dataIni = moment.utc().subtract(1, 'month').format("DD/MM/YYYY"),
        dataFim = moment.utc().add(2, 'day').format("DD/MM/YYYY");
        this.filtros = {
            dataFinal: dataFim,
            dataInicial: dataIni,
            operadores: [],
            responsaveis: []
        }
    }
    
    componentWillMount()
    {
        this.setFiltros(null);
    }

    onChange(name, value)
    {
        var filtros = this.state.filtros;
        filtros[name] = value;

        this.setState({filtros: filtros});
        if (name === 'campo') {
            this.setFiltros(value);
        }
        this.filtros[name] = value;
        (name === 'dataCadastro') && this.setState({dataCadastro: value});
    }

    handleAutoComplete(name, value, url, dataSource)
    {
        this.onChange(name, value);
        App.fetch.getJson(window.App.basePath + url, {
            body: JSON.stringify({search: value}),
            method: "POST"
        }).then((resp) => {
            if (resp.type !== 'success') {
                return;
            }
            var state = {};
            state[dataSource] = resp.data;
            this.setState(state);
        });
    }

    setFiltros(campo)
    {
        var type = '',
            operadores = [],
            campos = this.props.campos || [],
            filtros = (campo ? this.state.filtros : (this.props.filtros || {})),
            changeCampo = (campo !== undefined),
            getTipos = function (c) {
                campos.forEach(function (d) {
                    if ((!c && d.selected) || d.id == c) {
                        type = d.type;
                        campo = d.id;
                    }
                });
                    
                if (type && tipos[type]) {
                    return tipos[type];
                }

                type = 'varchar';
                return tipos[type];
            },
            prms = getTipos(campo);

        (!filtros.campo) && (filtros.campo = campo);
        (!filtros.operador || changeCampo) && (filtros.operador = (type === 'varchar' ? 'cn' : 'eq'));

        for (var b in prms) {
            operadores.push({id: b, name: prms[b]});
        }
        
        this.setState({filtros: filtros, operadores: operadores});
    }

    onSubmit(e)
    {
        e.preventDefault();
        e.stopPropagation();
        this.props.onSearch(this.state.filtros);
    }

    getFilter()
    {   
        var filtersElm = [];
        const filters = this.props.filters || [];

        filters.map((filter, i) => {
            filtersElm.push(
                <div key={i} className="row">{
                    filter.map((campo) => {
                        switch (campo.type) {
                            case 'select':
                                if (!this.state.filtros[campo.name] && campo['value']) {
                                    this.state.filtros[campo.name] = campo['value'];
                                }
                                campo['value'] = this.state.filtros[campo.name];
                                return (
                                    <div key={campo.name} className={campo.className}>
                                        <SelectField data={campo} onChange={this.onChange}/>
                                    </div>
                                );
                                break;

                            case 'date':
                                return (
                                    <div key={campo.name} className={campo.className}>
                                        <DatePicker data={campo} onChange={this.onChange}/>
                                    </div>
                                );
                                break;

                            case 'autocomplete':
                                return (
                                    <div key={campo.name} className={campo.className}>
                                        <AutoComplete
                                            fullWidth={true}
                                            floatingLabelText={campo.label}
                                            searchText={this.state.filtros[campo.name]}
                                            filter={AutoComplete.fuzzyFilter}
                                            dataSource={this.state.cidades || []}
                                            dataSourceConfig={{text: 'name', value: 'id'}}
                                            onNewRequest={(a) => this.onChange(campo.name, a.id)}
                                        />
                                    </div>
                                );
                                break;

                            default:
                                return (
                                    <div key={campo.name} className={campo.className}>
                                        <TextField
                                            fullWidth={true}
                                            floatingLabelText={campo.label}
                                            value={this.state.filtros[campo.name]}
                                            onChange={(a, v) => this.onChange(campo.name, v)}
                                        />
                                    </div>
                                );
                                break;
                        }
                    })
                }</div>
            );
        });

        return filtersElm;
    }

    render()
    {
        if (!this.props.campos) {
            return null;
        }

        var campo = {
                name: 'campo',
                label: 'Campo',
                items: this.props.campos,
                value: this.state.filtros.campo
            },
            operador = {
                name: 'operador',
                label: 'Operador',
                items: this.state.operadores,
                value: this.state.filtros.operador
            },
            colaborador = {
                name: 'colaborador',
                label: 'Colaboradores',
                items: this.state.responsaveis,
                value: this.filtros.responsaveisConta || [],
                multiple: true
            },
            dataInicial = {
                name: "dataInicial",
                label: 'Data Inicial',
                value: this.filtros.dataInicial || '',
                format: 'DD/MM/YYYY'
            },
            dataFinal = {
                name: "dataFinal",
                label: 'Data Final',
                value: this.filtros.dataFinal || '',
                format: 'DD/MM/YYYY'
            };
            
        return (
            <form ref={(f) => {this.form = f; }} onSubmit={this.onSubmit}>
                <div style={{position: 'relative'}}>
                    <CardActions style={{ zIndex: 2, display: 'inline-block', position: 'absolute', top: 0, right: 0}}>
                        <FloatingActionButton secondary={true} mini={false} onTouchTap={this.props.handleConsultar}>
                            <ActionSearch/>
                        </FloatingActionButton>
                    </CardActions>

                </div>
                <Card>
                    <CardHeader
                        style={{padding: 0, marginRight: '150px'}}
                        actAsExpander={true}
                        showExpandableButton={true}
                        children={this.props.title && <CardTitle style={{marginTop: '-4px', paddingTop: 0, fontWeight: 'normal'}} title={this.props.title}/>}
                    />
                    <CardText expandable={true}>
                        <div className="row">
                            <div className="col-md-3">
                                <SelectField data={campo} onChange={this.onChange}/>
                            </div>
                            <div className="col-md-3">
                                <SelectField data={operador} onChange={this.onChange}/>
                            </div>
                            <div className="col-md-6">
                                <TextField
                                    fullWidth={true}
                                    onChange={(a,v) => this.onChange('valor', v)}
                                    value={this.state.filtros.valor}
                                    floatingLabelText="Pesquisa"
                                />
                            </div>
                            {this.getFilter()}
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <DatePicker onChange={this.onChange} data={dataInicial} />
                            </div>
                            <div className="col-md-4">
                                <DatePicker onChange={this.onChange} data={dataFinal} />
                            </div>
                            <div className="col-md-4">
                                <SelectField data={colaborador} onChange={this.onChange}/>
                            </div>
                            {this.getFilter()}
                        </div>
                    </CardText>
                </Card>
            </form>
        );
    }
};

RelatoriosSearch.propTypes = {
    campos: PropTypes.array.isRequired,
    onSearch: PropTypes.func.isRequired
};

export default RelatoriosSearch;
