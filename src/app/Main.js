import React from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blueGrey900} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ImageHome from 'material-ui/svg-icons/navigation/apps';
import ImageEmpresa from 'material-ui/svg-icons/communication/business';
import Admin from 'material-ui/svg-icons/action/build';
import ImageCadastros from 'material-ui/svg-icons/content/add-circle-outline';
import ImageRelatorios from 'material-ui/svg-icons/content/content-paste';
import ImageSettings from 'material-ui/svg-icons/action/settings';
import ImageIntegracao from 'material-ui/svg-icons/action/autorenew';
import ImageCalendar from 'material-ui/svg-icons/action/event';
import ImageDehaze from 'material-ui/svg-icons/image/dehaze';
import { Link } from 'react-router';
import {AppBar, Divider, Popover, Drawer} from 'material-ui';
import Entities from '../ui/components/Entities'
import Notify from '../ui/Notify';
import Message from '../ui/Message';
import IconesSuperiores from '../ui/components/IconesSuperiores';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blueGrey900
    }
});

class Main extends React.Component
{
    constructor(props, context)
    {
        super(props, context);
        this.handleListItemTouchTap = this.handleListItemTouchTap.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleMenuIcon = this.handleMenuIcon.bind(this);
        this.handleTouchTap = this.handleTouchTap.bind(this);
        this.onChange = this.onChange.bind(this);
        this.showHideMenu = this.showHideMenu.bind(this);
        this.setHeight = this.setHeight.bind(this);

        this.state = {
            showMenu: true,
            drawer: false,
            mainColor: '#2196F3',
            toggle: true,
            open: false,
            height: 66,
            root: false,
            user: ''
        };
    }

    handleMenuIcon()
    {
        !this.state.showMenu && this.setState({drawer: true});
    }

    setHeight(height)
    {
        this.setState({height: height});
    }

    handleListItemTouchTap()
    {
        this.state.drawer && this.setState({drawer: false});
    }

    updateDimensions()
    {
        this.setState({
            showMenu: (window.innerWidth > 1024 && this.state.toggle)
        });
    }

    componentWillMount()
    {

        this.updateDimensions();
    }

    componentDidMount()
    {
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount()
    {
        window.removeEventListener("resize", this.updateDimensions);
    }

    handleTouchTap(event)
    {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
          anchorEl: event.currentTarget,
          open: true
        });
    }

    onChange(app)
    {
        this.setState({mainColor: app.entity.mainColor, user: app.user.name, root: (app.user.id == 1)});
    };

    showHideMenu(toggle)
    {
        this.setState({showMenu: (window.innerWidth > 1024 && toggle), toggle: toggle});
    };

    render()
    {

        const showMenu = (this.state.showMenu ? 'block' : 'none');

        const iconeMenu = this.state.showMenu
                ? <IconButton disabled={true}></IconButton>
                : <IconButton onTouchTap={this.handleMenuIcon}><ImageDehaze/></IconButton>;

        const menuList = (
            <div>
                <List>
                    <ListItem
                        key="inicial"
                        primaryText="Inicial"
                        leftIcon={<ImageHome/>}
                        containerElement={<Link to="/"/>}
                        onTouchTap={this.handleListItemTouchTap}
                    />
                    {this.state.user &&
                        <ListItem
                            primaryText="Cadastros"
                            leftIcon={<ImageCadastros />}
                            initiallyOpen={false}
                            primaryTogglesNestedList={true}
                            nestedItems={[
                                <ListItem
                                    key="teste"
                                    primaryText="Testes"
                                    containerElement={<Link to="/teste"/>}
                                    onTouchTap={this.handleListItemTouchTap}
                                />
                            ]}
                        />
                    }
                </List>
            </div>
        );

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Notify />
                    <Message />
                    <AppBar
                        style={{zIndex: 1030, backgroundColor: this.state.mainColor}}
                        title={<Entities onChange={this.onChange}/>}
                        showMenuIconButton={true}
                        iconElementLeft={iconeMenu}
                        iconElementRight={
                            <IconesSuperiores
                                onChange={this.onChange}
                                defaultToggled={this.state.showMenu}
                                showHideMenu={this.showHideMenu}
                                setHeight={this.setHeight}
                                user={this.state.user}
                            />
                        }
                    />
                    <div className="body" style={{ display: 'flex', flex: '1', backgroundColor: '#edecec' }}>
                        {this.state.showMenu &&
                            <div style={{flex: '0 0 20em', height: (window.innerHeight - this.state.height), overflow: 'auto'}}>
                                <Paper style={{'minHeight': (window.innerHeight - this.state.height)}}>
                                    {menuList}
                                </Paper>
                            </div>
                        }
                        <div style={{ flex: 1, height: (window.innerHeight - this.state.height), overflow: 'auto'}}>
                            {this.props.children}
                        </div>
                    </div>
                    {!this.state.showMenu &&
                        <Drawer
                            open={this.state.drawer}
                            docked={false}
                            onRequestChange={(open) => this.setState({drawer: open})}>
                            {menuList}
                        </Drawer>
                    }
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Main;
