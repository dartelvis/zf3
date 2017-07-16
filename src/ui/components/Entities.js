
import React from 'react';
import PropTypes from 'prop-types';
import { messageActions } from '../../actions';
import { AutoComplete } from 'material-ui';

class Entities extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            entities: window.App.entities,
            entity: window.App.entity,
            user: window.App.user,
            showSearch: false,
            searchText: '',
            close: true
        };
    }

    componentWillMount()
    {
        App.fetch.getJson(window.App.basePath + '/app/index/get-entities', {
            method: "GET"
        }).then((resp) => {
            window.App.entity = (resp.data.entity || window.App.entity);
            window.App.user = (resp.data.user || window.App.user);
            window.App.entities = (resp.data.entities || []);

            this.props.onChange(window.App);

            this.setState({entities: window.App.entities, entity: window.App.entity, user: window.App.user});
        });
    }

    handleSearch()
    {
        this.setState({
            showSearch: (window.App.entities.length && !this.state.showSearch),
            entities: window.App.entities,
            entity: window.App.entity,
            user: window.App.user
        });
    }

    handleUpdateInput(text)
    {
        this.setState({searchText: text});
    }

    handleNewRequest(obj, key)
    {
        if (key === -1) {
            this.setState({searchText: '', showSearch: false});
            return;
        }

        this.setState({close: false});
        App.fetch.getJson(window.App.basePath + '/app/index/change-entity', {
            body: JSON.stringify(obj),
            method: "POST"
        }).then((resp) => {
            if (resp.type === 'success') {
                this.setState({
                    close: true,
                    entity: obj,
                    searchText: '',
                    notClose: false,
                    showSearch: false
                });
                this.props.onChange(this.state);
                this.context.store.dispatch(messageActions.showNotify(resp.msg));
                return;
            }

            this.context.store.dispatch(messageActions.showError(resp.msg, resp.exception));
        });
    }

    render()
    {
        return this.state.showSearch ? (
            <AutoComplete
                openOnFocus={true}
                menuCloseDelay={10}
                hintText="Pesquisar"
                underlineShow={false}
                maxSearchResults={10}
                dataSource={this.state.entities}
                searchText={this.state.searchText}
                inputStyle={{color: 'white', fontSize: 24}}
                dataSourceConfig={{text: 'name', value: 'id'}}
                onNewRequest={this.handleNewRequest.bind(this)}
                onUpdateInput={(text) => this.handleUpdateInput(text)}
                hintStyle={{color: 'rgba(255,255,255, 0.5)', fontSize: 24}}
                ref={(e) => {e && e.refs && e.refs.searchTextField.input.focus(); }}
                filter={AutoComplete.fuzzyFilter}
                onClose={() => {setTimeout(() => {this.state.close && this.setState({showSearch: false})}, 100)}}
            />
        ) : (
            <span onTouchTap={() => this.handleSearch()} style={{cursor: 'pointer'}}>
                {this.state.entity.name}
            </span>
        );

    }
};

Entities.contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

export default Entities;