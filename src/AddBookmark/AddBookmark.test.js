import React from 'react';
import ReactDOM from 'react-dom';
import AddBookmark from './AddBookmark';

it.skip('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddBookmark />, div);
  ReactDOM.unmountComponentAtNode(div);
});
