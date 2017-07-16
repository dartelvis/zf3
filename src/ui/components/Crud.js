
import React from 'react';
import PropTypes from 'prop-types';
import { messageActions } from '../../actions';
import {Pagination} from 'react-bootstrap';
import {
    Card,
    CardText,
    RaisedButton,
    CardTitle,
    CardActions,
    Table,
    TableBody,
    TableHeader
} from 'material-ui';
import CrudSearch from './CrudSearch';

class Crud extends React.Component
{
    constructor(props)
    {
        super(props);

        this.handleConsultar = this.handleConsultar.bind(this);
        this.handleAdicionar = this.handleAdicionar.bind(this);

        this.resource = `${window.App.basePath}/app/${this.props.resource}`;
        this.state = {
            itens: [],
            form: false,
            obj: null
        };

        this.consulta = {
            page: 1,
            rows: 10,
            total: 1,
            info: '',
            filtros: (this.props.filtros || {}),
            sidx: this.props.sidx,
            sord: this.props.sord
        };
    }

    componentWillReceiveProps(nextProps)
    {
        if (this.consulta.sidx != nextProps.sidx || this.consulta.sord != nextProps.sord) {
            this.consulta.sidx = nextProps.sidx;
            this.consulta.sord = nextProps.sord;
            this.consultar(this.consulta.page);
        }
    }

    consultar(page)
    {
//        this.consulta.page = page;
//
//        this.consulta.info = 'pagina 1 de 1';
//        this.consulta.page = 1;
//        this.consulta.total = 10;
//        this.setState({itens: this.state.itens});


        App.fetch.getJson(this.resource + '/consultar', {
            body: JSON.stringify(this.consulta),
            method: "POST"
        }).then((resp) => {

            var inicio = 0,
                info = '',
                fim = 0;

            if (resp.rows.length) {
                inicio = ((resp.page - 1) * 10) + 1;
                fim = inicio + resp.rows.length - 1;
            }

            var info = 'Mostrando ' + inicio + ' até ' + fim + ' de ' + resp.records + ' registros';

            this.consulta.info = info;
            this.consulta.page = resp.page;
            this.consulta.total = resp.total;
            this.setState({itens: resp.rows});
        });
    }

    remover(id)
    {
        this.props.onClear && this.props.onClear();
        var itens = this.state.itens;
        delete itens[id];
        this.setState({itens: itens});

        return;

        App.fetch.getJson(this.resource + '/excluir/' + id).then((data) => {
            if (data.type === "success") {
                this.consultar();
                this.props.onClear && this.props.onClear();
                this.context.store.dispatch(messageActions.showNotify(data.msg));
                return;
            }
            this.consulta.setState({bloqueado: false});
            if (!data.exception) {
                this.context.store.dispatch(messageActions.showNotify(data.msg));
                return;
            }

            this.context.store.dispatch(messageActions.showError(data.msg, data.exception));
        });
    }

    handleConsultar()
    {
        this.consultar(this.consulta.page);
    }

    onPageChange(page)
    {
        this.consultar(page);
    }

    handleAdicionar()
    {
        this.setState({form: true, obj: {}});
    }

    handleCancelar()
    {
        this.props.onClear && this.props.onClear();
        this.setState({form: false, obj: null});
    }

    onSearch(filtros)
    {
        this.consulta.filtros = filtros;
        this.consultar(this.consulta.page);
    }

    render()
    {
        if (this.state.form) {
            const formulario = this.props.renderFormulario && this.props.renderFormulario(this.state.obj);

            if (this.props.onlyClose) {
                return (
                    <Card style={{ margin: '2em'}}>
                        {this.props.title && <CardTitle title={this.props.title}/>}
                        <CardText>{formulario}</CardText>
                        <CardActions style={{  textAlign: 'right' }}>
                            <RaisedButton
                                label="Fechar"
                                secondary={true}
                                onTouchTap={this.handleCancelar.bind(this)}
                                disabled={this.state.bloqueado}
                            />
                        </CardActions>
                    </Card>
                );
            }

            return (
                <Card style={{ margin: '2em'}}>
                    {this.props.title && <CardTitle title={this.props.title}/>}
                    <form ref="form" onSubmit={this.props.onSubmit}>
                        <CardText>{formulario}</CardText>
                        <CardActions style={{  textAlign: 'right' }}>
                            <RaisedButton
                                label="Cancelar"
                                secondary={true}
                                onTouchTap={this.handleCancelar.bind(this)}
                                disabled={this.state.bloqueado}
                            />
                            <RaisedButton label="Salvar" primary={true} type="submit" disabled={this.state.bloqueado}/>
                        </CardActions>
                    </form>
                </Card>
            );
        }

        var itens = this.props.renderItens(this.state.itens);
        return (
            <Card style={{ margin: '2em'}}>
                <CrudSearch
                    title={this.props.title}
                    campos={this.props.campos}
                    filtros={this.consulta.filtros}
                    filters={this.props.filters}
                    onSearch={this.onSearch.bind(this)}
                    handleConsultar={this.handleConsultar}
                    handleAdicionar={this.handleAdicionar}
                />

                <Table ref={(elm) => { this.table = elm; }} wrapperStyle={{'width': '100%'}}>
                    {this.props.tableHeader}
                    <TableBody displayRowCheckbox={false}>{itens}</TableBody>
                </Table>

                <div style={{textAlign: "center"}}>
                    <Pagination
                        prev next first last ellipsis boundaryLinks
                        maxButtons={5}
                        items={this.consulta.total}
                        activePage={this.consulta.page}
                        onSelect={this.onPageChange.bind(this)} />

                    <span style={{'marginLeft': '40px', top: '20px', position: 'relative'}}>{this.consulta.info}</span>
                </div>
            </Card>
        );
    }
};

Crud.propTypes = {
    resource: PropTypes.string.isRequired,
    renderItens: PropTypes.func.isRequired,
    formulario: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    campos: PropTypes.array,
    tableHeader: PropTypes.object
};

Crud.defaultProps = {

};

Crud.contextTypes = {
    router: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
};

export default Crud;
