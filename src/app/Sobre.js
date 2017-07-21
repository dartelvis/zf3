
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

class Sobre extends React.Component {

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
                <CardText style={{height: (window.innerHeight - 350), overflowY: 'auto'}}>
                    <p>Trabalhamos com agendamento de entregas de refeições em sua casa.</p> 
                    <p>Com a ideia de facilitar a vida e sem perda de tempo, com uma alternativa mais saudável e fácil.</p>
                    <p>Cardápios variados a sua escolha, podendo fazer o seu pedido online.</p> 
                    <p>Escolhendo todos os seus pratos preferidos, para todos os dias o que desejar, no horário marcado, entregue na sua localização.</p>
                </CardText>
            </Card>
        );
    }
};

export default Sobre;
