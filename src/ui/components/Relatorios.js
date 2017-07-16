
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
import RelatoriosSearch from './RelatoriosSearch';

class Relatorios extends React.Component
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
            rows: 15,
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
        this.consulta.page = page;

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
        App.fetch.getJson(this.resource + '/excluir/' + id).then((data) => {
            if (data.type === "success") {
                this.consultar();
                this.props.clear && this.props.clear();
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
        this.props.clear && this.props.clear();
        this.setState({form: false, obj: null});
    }

    onSearch(filtros)
    {
        this.consulta.filtros = filtros;
        this.consultar(this.consulta.page);
    }

    handleKeyPress(e)
    {
        var types = ['TEXTAREA', 'textarea', 'BUTTON', 'submit', 'button'];
        if(jQuery.inArray(e['target'].type, types) === -1 && jQuery.inArray(e.charCode, [10, 13]) !== -1 ) {
            e.preventDefault();
        }
    }

    render()
    {
       var itens = this.props.renderItens(this.state.itens);
        return (
            <Card style={{ margin: '2em'}}>
                <RelatoriosSearch
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

Relatorios.propTypes = {
    resource: PropTypes.string.isRequired,
    renderItens: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    campos: PropTypes.array,
    tableHeader: PropTypes.object
};

Relatorios.defaultProps = {

};

Relatorios.contextTypes = {
    router: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
};

export default Relatorios;
