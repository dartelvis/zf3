
import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/Avatar';
import ImageSettings from 'material-ui/svg-icons/action/settings';
import ImageSair from 'material-ui/svg-icons/action/exit-to-app';
import { Link } from 'react-router';
import { messageActions } from '../../actions';
import { AutoComplete, Badge, Divider, Dialog, CardText } from 'material-ui';

class IconesSuperiores extends React.Component
{
    constructor(props, context)
    {
        super(props, context);

        this.renderSearch = this.renderSearch.bind(this);
        this.goToProspect = this.goToProspect.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onLogin = this.onLogin.bind(this);

        this.state = {
            prospects: [],
            prospectSearch: '',
            showSearch: false,
            iconSearch: false,
            iconSearchShow: false,
            prospect: {},
            searchTimeout: null,
            notificacoes: [],
            dialogInfo: ''
        };

        this.consulta = {
            page: 1,
            rows: 5,
            total: 1,
            info: '',
            sidx: 'e.ts',
            sord: 'desc'
        };

        this.search = null;
    }

    componentWillMount()
    {
    }

    onLogin()
    {
        App.fetch.getJson(window.App.basePath + '/app/index/login').then((resp) => {
            window.App.user = resp.data;
            this.props.onChange(window.App);
        });
    }

    onLogout()
    {
        App.fetch.getJson(window.App.basePath + '/app/index/logout').then(() => {
            window.App.user = {};
            this.props.onChange(window.App);
            this.context.router.push({pathname: '/', state: {
                oportunidade: {}
            }});
        });
    }

    goToProspect(id)
    {
//        this.context.router.push({pathname: '/com-prospect', state: {prospect: id}});
//        this.setState({prospectSearch: ''});
    }

    handleDescricao(value)
    {
//        var searchTimeout = this.state.searchTimeout,
//            prospect = this.state.prospect;
//        prospect.razaosocial = value;
//        prospect.nome = value;
//
//
//        clearTimeout(searchTimeout);
//        searchTimeout = setTimeout(() => {
//            App.fetch.getJson(window.App.basePath + '/app/com-prospect/get-by-descricao', {
//                body: JSON.stringify({descricao: value}),
//                method: "POST"
//            }).then((resp) => {
//                (resp.type === 'success') && this.setState({prospects: resp.data || []});
//            });
//        }, 300);
//        this.setState({searchTimeout: searchTimeout, prospect: prospect, prospectSearch: value});
    }

    render()
    {
        const itens = this.state.notificacoes.map((n, i) => {
            return (
            <div key={i}>
                <a className="lv-item">
                    <div className="media">
                        <div className="pull-left p-t-5">
                            <button className="btn btn-icon btn-flat btn-info"
                                 onClick={() => this.marcarLido(n.idNotifica)}
                                style={{boxShadow:'none'}} title="Marcar como lido">
                                <i className={"md "+ (n.icon) ? n.icon : 'md-flag'}></i>
                            </button>
                        </div>
                        <div className="media-body">
                            <label onClick={() => this.setState({dialogInfo: (n.msg) ? n.msg : n.title})}>
                                <div className="lv-title">{n.app}</div>
                                <small className='lv-small' style={{whiteSpace:'normal'}}>{n.title}</small>
                                há {n.data} dia(s).
                            </label>
                        </div>
                    </div>
                </a>

                <Divider />
            </div>
            );
        });

        return (
            <div style={{float: 'left', textAlign: 'right', width: '370px'}}>
                <div style={{display: 'inline-block', width: '70px'}}>
                    <Toggle
                        defaultToggled={this.props.defaultToggled}
                        onToggle={(e, t) => {
                            this.props.showHideMenu(t);
                            this.setState({iconSearch: !this.state.iconSearch});
                        }}
                    />
                </div>
                {this.state.iconSearch && <IconButton
                    tooltipPosition="bottom-center"
                    onClick={() => {
                        var iconSearchShow = !this.state.iconSearchShow;
                        this.setState({iconSearchShow: iconSearchShow});
                        this.props.setHeight(iconSearchShow ? 116: 66);
                    }}
                    iconStyle={{color: '#fff',fontSize: '24px'}}
                    iconClassName="md md-search" tooltip="Buscar"
                    style={{width: '50px',height: '38px', textAlign: 'center', padding: '0'}}
                />}

                <IconMenu
                    iconButtonElement={
                        <IconButton style={{padding: '0'}}>
                            <Avatar size={30}>{(this.props.user || '').substring(0, 1)}</Avatar>
                        </IconButton>
                    }
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                {this.props.user ?
                    <MenuItem leftIcon={<ImageSair />} onTouchTap={this.onLogout} primaryText="Sair" />
                    : <MenuItem leftIcon={<ImageSair />} onTouchTap={this.onLogin} primaryText="Logar" />
                }
                </IconMenu>
                {this.renderSearch()}
            </div>
        );
    }


    renderSearch()
    {

        return (this.state.iconSearch ?
            <div style={{
                height: '40px',
                marginBottom: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.26)',
                display: (this.state.iconSearchShow ? 'block' : 'none')
            }}>
                <AutoComplete
                    hintText="Buscar"
                    menuCloseDelay={10}
                    textFieldStyle={{
                        top: '-18px',
                        left: '0',
                        color: '#fff',
                        position:'absolute',
                        width: '300px',
                        paddingLeft: '40px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '10px center',
                        backgroundImage: 'url("' + window.App.basePath + '/img/icons/search.png")'
                    }}
                    listStyle={{
                        margin: '0',
                        cursor: 'pointer'
                    }}
                    openOnFocus={true}
                    maxSearchResults={5}
                    underlineShow={false}
                    fullWidth={true}
                    dataSource={this.state.prospects}
                    searchText={this.state.prospectSearch}
                    onUpdateInput={(v) => this.handleDescricao(v)}
                    inputStyle={{color: 'white', fontSize: 18, width: '100%'}}
                    onNewRequest={(a) => this.goToProspect(a.idComProspect)}
                    dataSourceConfig={{text: 'descricao', value: 'idComProspect'}}
                    filter={() => {return true;}}
                    hintStyle={{color: 'rgba(255,255,255, 0.5)', fontSize: 18, width: '100%', textAlign: 'left'}}
                />
            </div>
            :
            <div style={{
                top: '12px',
                height: '40px',
                width: '500px',
                textAlign: 'center',
                position: 'absolute',
                left: 'calc(50% - 250px)',
                backgroundColor: 'rgba(255, 255, 255, 0.26)'
            }}>
                <AutoComplete
                    hintText="Buscar"
                    menuCloseDelay={10}
                    textFieldStyle={{
                        top: '-4px',
                        left: '-5px',
                        width: '500px',
                        paddingLeft: '40px',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '10px center',
                        backgroundImage: 'url("' + window.App.basePath + '/img/icons/search.png")'
                    }}
                    openOnFocus={true}
                    listStyle={{
                        margin: '0',
                        cursor: 'pointer',
                    }}
                    fullWidth={true}
                    maxSearchResults={5}
                    underlineShow={false}
                    dataSource={this.state.prospects}
                    searchText={this.state.prospectSearch}
                    onUpdateInput={(v) => this.handleDescricao(v)}
                    inputStyle={{color: 'white', fontSize: 18, width: '100%'}}
                    onNewRequest={(a) => this.goToProspect(a.idComProspect)}
                    dataSourceConfig={{text: 'descricao', value: 'idComProspect'}}
                    filter={() => {return true;}}
                    hintStyle={{color: 'rgba(255,255,255, 0.5)', fontSize: 18, width: '100%', textAlign: 'left'}}
                />
            </div>
        );
    }
}

IconesSuperiores.contextTypes = {
    router: PropTypes.object.isRequired
};


export default IconesSuperiores;
