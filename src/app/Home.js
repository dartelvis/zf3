
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
            <Card className="card-main">
                <CardText style={{height: (window.innerHeight - 350), overflowY: 'auto'}}>
                    <img style={{position: "relative", float: "left", margin: "10px"}} 
                        src={window.App.basePath + '/img/plano-empresa.jpg'} />
                    <p><b>Plano empresa:</b></p>
                    <p>Torne-se um parceiro e ganhe vantagens especiais para você e sua equipe.</p>
                    <p style={{marginTop:"67px"}}><b>Frase do dia:</b></p>
                    <p> Ser feliz não é viver apenas momentos de alegria. É ter coragem de enfrentar os momentos de tristeza e sabedoria para transformar os problemas em aprendizado.</p>
                </CardText>
            </Card>
        );
    }
};

export default Home;
