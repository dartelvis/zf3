
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

class Produtos extends React.Component {

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
                <CardText style={{height: (window.innerHeight - 150), overflowY: 'auto'}}>
                    <p><b>Nossos Produtos</b></p>
                    <p>"Monte sua marmita" possui várias opções de produtos com o objetivo de melhor atender você e sua família.</p>
                    <p>Confira abaixo algumas de nossas opções de "quentinhas":</p>
                    <p><b>Baby:</b> Se você come bem pouquinho, nós também pensamos em você</p>
                    <p><b>Quentinha:</b> Porção para 1 pessoa</p>
                    <p><b>Super Quentinha:</b> Um extra da nossa comida para você que precisa de mais força e energia</p>
                    <p><b>Dupla Quentinha:</b> Comer em dois vai ficar mais prático ainda</p>
                    <p>Temos também opções de marmitas que servem para você e sua família:</p>
                    <p><b>Familiar III:</b> A comida pro papai, mamãe e filhinho</p>
                    <p><b>Familiar IV:</b> Opa! temos um convidado</p>
                    <p><b>Familiar V:</b> Aqui serve para cinco pessoas</p>
                    <p>Pratos especiais:</p>
                    <p><b>Levinha:</b> Quentinha light preparada para você que está em dieta</p>
                    <p><b>Tropicallia:</b> A quentinha de saladas, acompanhada de um grelhado</p>
                </CardText>
            </Card>
        );
    }
};

export default Produtos;
