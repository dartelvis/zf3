
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const styleDiv = {
    textAlign: "left",
    padding: "20px"
};

const styleImg = {
    maxWidth: "120px",
    maxHeight: "100px",
    opacity: ".8"
};

class Images extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    next()
    {
        var next = this.props.pagina + 1;
        if (next > this.props.paginas) {
            next = this.props.paginas;
        }
        this.props.onPageChange(next);
    }

    last()
    {
        this.props.onPageChange(this.props.paginas);
    }

    previus()
    {
        var page = this.props.pagina - 1;
        if (page <= 0) {
            page = 1;
        }
        this.props.onPageChange(page);
    }

    first()
    {
        this.props.onPageChange(1);
    }

    render()
    {
        const src = this.props.src || window.App.basePath + '/img/user.png';
        return (
            <div style={styleDiv}>
                <img
                    style={styleImg}
                    src={src}
                />
            </div>
        );
    }
};

Images.propTypes = {
    src: PropTypes.string
};

export default Images;
