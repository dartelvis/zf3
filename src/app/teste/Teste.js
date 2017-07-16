
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { messageActions } from '../../actions';
import {
    Card,
    CardTitle,
    CardActions,
    FlatButton,
    FloatingActionButton,
    Table,
    TableBody,
    TableHeader,
    TextField,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import Crud from '../../ui/components/Crud';

class Teste extends React.Component
{
    constructor(props)
    {
        super(props);
        this.handleAdicionar = this.handleAdicionar.bind(this);

        this.onSort = this.onSort.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.renderItens = this.renderItens.bind(this);
        this.renderFormulario = this.renderFormulario.bind(this);

        this.state = {
            sidx: 'e.descricao',
            sord: 'asc',
            teste: {}
        };
    }

    onClear()
    {
        this.setState({teste: {}});
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
        this.setState({teste: obj});
        this.getConsulta().setState({form: true, obj: (obj || {})});
    }

    onSort(sidx)
    {
        var sord = (sidx != this.state.sidx || this.state.sord == 'desc' ? 'asc' :  'desc');
        this.setState({sidx: sidx, sord: sord});
    }

    onChange(name, value)
    {
        this.setState(prev => prev['teste'][name] = value);
    }

    onSubmit(e)
    {
        e.preventDefault();

        this.onClear();
        this.getConsulta().setState({form: false, bloqueado: false});

//        var data = this.perfil;
//        data['operacoes'] = this.getOperacoes();
//
//        this.getConsulta().setState({bloqueado: true});
//        App.fetch.getJson(window.App.basePath + '/app/teste/persistir', {
//            body: JSON.stringify(data),
//            method: "POST"
//        }).then((resp) => {
//            if (resp.type === "success") {
//                this.getConsulta().setState({form: false, bloqueado: false});
//                this.getConsulta().consultar(1);
//                this.clear();
//                this.context.store.dispatch(messageActions.showNotify(resp.msg));
//                return;
//            }
//
//            this.getConsulta().setState({bloqueado: false});
//            if (!resp.exception) {
//                this.context.store.dispatch(messageActions.showNotify(resp.msg));
//                return;
//            }
//
//            this.context.store.dispatch(messageActions.showError(resp.msg, resp.exception));
//        }).catch(()  => {
//            this.getConsulta().setState({bloqueado: false});
//        });
    }

    render()
    {
        var campos = [
                {id: "e.descricao", name: "Descrição", type: "string"}
            ],
            filters = [[
                {
                    url: '/app/com-prospect/get-cidades',
                    className: 'col-md-7',
                    type: 'autocomplete',
                    label: 'Cidade',
                    name: 'cidade'
                },
                {label: 'UF',  name: 'uf', className: 'col-md-1'}
            ]
        ];

        return (
            <Crud
                title="Teste"
                campos={campos}
                filters={filters}
                sidx={this.state.sidx}
                sord={this.state.sord}
                resource="teste"
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
                    <TableHeaderColumn onTouchTap={() => this.onSort('descricao')}>Nome</TableHeaderColumn>
                    <TableHeaderColumn  style={{width: '80px'}}>Excluir</TableHeaderColumn>
                    <TableHeaderColumn  style={{width: '100px'}}>Editar</TableHeaderColumn>
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
                    <TableRowColumn>{item.descricao}</TableRowColumn>
                    <TableRowColumn style={{"width": "400px", "textAlign": "right"}}>
                        <FlatButton icon={<ActionDeleteForever />} onTouchTap={this.handlerRemover.bind(this, i)}/>
                        <FlatButton
                            icon={<EditorModeEdit />}
                            onTouchTap={(e) => this.handleAdicionar(item)}
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
                <TextField
                    fullWidth={true}
                    floatingLabelText='Código'
                    value={this.state.teste.id || ''}
                    onChange={(a, v) => this.onChange('id', v)}
                />
                <TextField
                    fullWidth={true}
                    floatingLabelText='Descrição'
                    value={this.state.teste.descricao || ''}
                    onChange={(a, v) => this.onChange('descricao', v)}
                />
            </div>
        );
    }
};

Teste.contextTypes = {
    router: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
};

export default Teste;
