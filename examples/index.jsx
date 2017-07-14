import React from 'react';
import ReactDOM from 'react-dom';

import { ProductComponent, CustomerComponent } from './components.jsx'


ReactDOM.render(React.createElement(ProductComponent), document.getElementById('product'));
ReactDOM.render(React.createElement(CustomerComponent), document.getElementById('customer'));
