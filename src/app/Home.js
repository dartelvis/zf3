
import React from 'react';
import ReactDOM from 'react-dom';
import {
    Tab,
    Tabs,
    Card,
    CardText,
    TextField,
    CardHeader,
    CardActions,
    AutoComplete,
    RaisedButton,
    FloatingActionButton
} from 'material-ui';

class Home extends React.Component {

    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
    }

    render()
    {
        return (
            <Card style={{ margin: '2em'}}>
                <CardText style={{height: (window.innerHeight - 350), overflowY: 'auto'}}>
                    Pagina inicial
                </CardText>
            </Card>
        );
    }
};

export default Home;
