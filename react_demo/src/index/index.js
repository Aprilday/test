'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import './index.less'

class Search extends React.Component {
    constructor() {
        super(...arguments);
        
        this.state = {
            Text: null
        }
    }

    loadComponent() {
        // import('./test').then(Text => {
        //     this.setState({
        //         Text: Text.default
        //     })
        // })
    }

    render() {
        const { Text } = this.state;

        return <div>
            search text
            {
                Text ? <Text /> : null
            }
        </div>
    }
}

ReactDom.render(
    <Search></Search>,
    document.getElementById('root')
)