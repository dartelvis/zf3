
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

class Contato extends React.Component {

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
            <Card className="card-main">
                <CardText style={{height: (window.innerHeight - 250), overflowY: 'auto'}}>
                    <p><b>Dados para contato:</b></p>
                    <p>Rua João pessoa nº 1490 – Centro, Pinhalzinho – Santa catarina – 89870-000</p>
                    <p><b>Fone:</b> (049) 3366-6666</p>
                    <p><b>Fone:</b>(049) 9 8888-8888</p>
                    <p>Filial Orlando</p>
                    <p>West Buena Vista Drive, Orlando, Florida</p>
                    <p><b>Fone:</b>407-939-6244</p>
                </CardText>
            </Card>
        );
    }
};

export default Contato;
