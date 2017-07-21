import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { messageActions } from '../actions';
import {
    Card,
    Table,
    CardText,
    TableRow,
    CardTitle,
    TableBody,
    TextField,
    FlatButton,
    CardActions,
    TableHeader,
    AutoComplete,
    TableRowColumn,
    TableHeaderColumn,
    FloatingActionButton
} from 'material-ui';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import Crud from '../ui/components/Crud';
import DatePicker from '../ui/components/DatePicker';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

class Cardapio extends React.Component
{
    constructor(props)
    {
        super(props);
        this.handleAdicionar = this.handleAdicionar.bind(this);

        this.onSort = this.onSort.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderItens = this.renderItens.bind(this);
        this.renderFormulario = this.renderFormulario.bind(this);
        this.renderAlimentos = this.renderAlimentos.bind(this);
        this.alimentoAdd = this.alimentoAdd.bind(this);
        this.alimentoRemove = this.alimentoRemove.bind(this);
        this.alimentoChange = this.alimentoChange.bind(this);
        
        this.state = {
            sidx: 'ep.municipio',
            sord: 'asc',
            enderecos : [],
            alimentos : [],
            enderecoSearch : "",
            alimentosSearch : [],
            searchTimeout: null,
            cardapio: {}
        };
    }

    alimentoChange(i, name, value)
    {
        var alimentos = this.state.alimentos;

        alimentos[i][name] = value;
        this.setState({alimentos: alimentos});
    }

    alimentoAdd()
    {
        var alimentos = this.state.alimentos;
        alimentos.push({alimento: {}, quantidade: null, nivel: null});
        this.setState({alimentos: alimentos});
    }

    alimentoRemove(i)
    {
        var alimentos = this.state.alimentos;
        delete alimentos[i];
        // alimentos.splice(i, 1);
        this.setState({alimentos: alimentos});
    }
    
    handleAlimento(i, value)
    {
        var searchTimeout = this.state.searchTimeout;

        var alimentos = this.state.alimentos;
        alimentos[i].alimentoSearch = value;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            App.fetch.getJson(window.App.basePath + '/app/alimentos/get-by-descricao', {
                body: JSON.stringify({descricao: value}),
                method: "POST"
            }).then((resp) => {
                if ((resp.type === 'success')) {
                    this.setState({alimentosSearch: resp.data || []});
                }
            });
        }, 300);
        this.setState({searchTimeout: searchTimeout, alimentos: alimentos});
    }
    
    handleEndereco(value)
    {
        var searchTimeout = this.state.searchTimeout;

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            App.fetch.getJson(window.App.basePath + '/app/enderecos/get-by-municipio', {
                body: JSON.stringify({municipio: value}),
                method: "POST"
            }).then((resp) => {
                (resp.type === 'success') && this.setState({enderecos: resp.data || []});
            });
        }, 300);
        this.setState({searchTimeout: searchTimeout, enderecoSearch: value});
    }

    onClear()
    {
        this.setState({cardapio: {}});
    }

    getConsulta()
    {
        return this.consulta;
    }

    handlerRemover(id)
    {
        this.context.store.dispatch(messageActions.showConfirm('Deseja realmente excluir?', null, {
            'Não': null,
            'Sim': () => {this.getConsulta().remover(id);}
        }));
    }

    handleAdicionar(obj)
    {
        if (obj) {
            return;
        }
        this.setState({cardapio: obj});
        this.getConsulta().setState({form: true, obj: (obj || {})});
    }

    onSort(sidx)
    {
        var sord = (sidx != this.state.sidx || this.state.sord == 'desc' ? 'asc' :  'desc');
        this.setState({sidx: sidx, sord: sord});
    }

    onChange(name, value)
    {
        this.setState(prev => prev['cardapio'][name] = value);
    }

    onSubmit(e)
    {
        e.preventDefault();

        this.onClear();
        this.getConsulta().setState({form: false, bloqueado: false});

        var data = this.state.cardapio;
        data['alimentos'] = this.state.alimentos;
        console.log(data);
        this.getConsulta().setState({bloqueado: true});
        App.fetch.getJson(window.App.basePath + '/app/cardapios/persistir', {
            body: JSON.stringify(data),
            method: "POST"
        }).then((resp) => {
            if (resp.type === "success") {
                this.getConsulta().setState({form: false, bloqueado: false});
                this.getConsulta().consultar(1);
                this.clear();
                this.context.store.dispatch(messageActions.showNotify(resp.msg));
                return;
            }

            this.getConsulta().setState({bloqueado: false});
            if (!resp.exception) {
                this.context.store.dispatch(messageActions.showNotify(resp.msg));
                return;
            }

            this.context.store.dispatch(messageActions.showError(resp.msg, resp.exception));
        }).catch(()  => {
            this.getConsulta().setState({bloqueado: false});
        });
    }

    render()
    {
        var campos = [
                {id: "e.datahora", name: "Horario", type: "date"},
                {id: "e.valor", name: "Valor", type: "decimal"},
                {id: "ep.municipio", name: "Municipio", type: "string"}
            ],
            filters = [];

        return (
            <Crud
                title="Cardapio"
                campos={campos}
                filters={filters}
                sidx={this.state.sidx}
                sord={this.state.sord}
                resource="cardapios"
                onClear={this.onClear}
                onSubmit={this.onSubmit}
                renderItens={this.renderItens}
                tableHeader={this.renderTableHeader()}
                handleAdicionar={this.handleAdicionar}
                renderFormulario={this.renderFormulario}
                ref={(child) => { this.consulta = child; }}
            />
        );
    }

    renderTableHeader()
    {
        return (
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                    <TableHeaderColumn onTouchTap={() => this.onSort('e.datahora')}>Horario</TableHeaderColumn>
                    <TableHeaderColumn onTouchTap={() => this.onSort('e.valor')}>Valor</TableHeaderColumn>
                    <TableHeaderColumn onTouchTap={() => this.onSort('ep.municipio')}>Municipio</TableHeaderColumn>
                    <TableHeaderColumn style={{width: '80px'}}>Excluir</TableHeaderColumn>
                    <TableHeaderColumn style={{width: '100px'}}>Editar</TableHeaderColumn>
                </TableRow>
            </TableHeader>
        );
    }

    renderItens(itens)
    {
        if (!itens) {
            return;
        }
        return itens.map((item, i) => {
            return (
                <TableRow key={item.id}>
                    <TableRowColumn>{item.datahora}</TableRowColumn>
                    <TableRowColumn>{item.valor}</TableRowColumn>
                    <TableRowColumn>{item.municipio}</TableRowColumn>
                    <TableRowColumn style={{width: '80px'}}>
                        <FlatButton
                            secondary={true}
                            icon={<ActionDeleteForever />}
                            style={{minWidth: '50px', width: '50px'}}
                            onTouchTap={this.handlerRemover.bind(this, item.id)}
                        />
                    </TableRowColumn>
                    <TableRowColumn style={{width: '100px'}}>
                        <FlatButton
                            primary={true}
                            icon={<EditorModeEdit />}
                            style={{minWidth: '50px', width: '50px'}}
                            onTouchTap={() => this.handleAdicionar(item)}
                        />

                    </TableRowColumn>
                </TableRow>
            );
        });
    }

    renderFormulario()
    {
        return (
            <div>
                <AutoComplete
                    hintText="Endereço"
                    menuCloseDelay={10}
                    openOnFocus={true}
                    maxSearchResults={5}
                    fullWidth={true}
                    dataSource={this.state.enderecos}
                    searchText={this.state.enderecoSearch}
                    onUpdateInput={(v) => this.handleEndereco(v)}
                    onNewRequest={(a) => this.onChange("endereco", a.id)}
                    dataSourceConfig={{text: 'municipio', value: 'id'}}
                    filter={() => {return true;}}
                />
                <DatePicker
                    data={{
                        name: "datahora",
                        label: "Data de entrega",
                        format: "DD/MM/YYYY",
                        time: "HH:mm",
                        value: this.state.cardapio.datahora || ""
                    }}
                    fullWidth={true}
                    onChange={this.onChange}
                />
                {this.renderAlimentos()}
                <CardActions style={{ marginTop: "11px", display: 'inline-block', float: 'left' }}>
                    <FloatingActionButton mini={true} onTouchTap={this.alimentoAdd}>
                        <ContentAdd/>
                    </FloatingActionButton>
                </CardActions>
            </div>
        );
    }

    renderAlimentos()
    {
        return this.state.alimentos.map((alimento, i) => {
            return (
                <Card>
                    <CardText>
                        <AutoComplete
                            hintText="Alimento"
                            menuCloseDelay={10}
                            openOnFocus={true}
                            maxSearchResults={5}
                            fullWidth={true}
                            dataSource={this.state.alimentosSearch || []}
                            searchText={alimento.alimentoSearch || ""}
                            onUpdateInput={(v) => this.handleAlimento(i, v)}
                            onNewRequest={(a) => this.alimentoChange(i, "alimento", a)}
                            dataSourceConfig={{text: 'descricao', value: 'id'}}
                            filter={() => {return true;}}
                        />
                        <label style={{width: "20%"}}>
                            Porção: {alimento.alimento.peso}
                        </label>
                        <label style={{width: "20%"}}>
                            Valor: R$ {alimento.alimento.valor}
                        </label>
                        <TextField
                            ref={'quantidade_' + i}
                            floatingLabelText='Quantidade'
                            value={alimento.quantidade || ''}
                            onChange={(a, v) => this.alimentoChange(i, "quantidade", v)}
                        />
                        <FloatingActionButton mini={true} onTouchTap={() => this.alimentoRemove(i)}>
                            <ContentRemove/>
                        </FloatingActionButton>
                    </CardText>
                </Card>
            );
        });
    }

};

Cardapio.contextTypes = {
    router: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
};

export default Cardapio;
