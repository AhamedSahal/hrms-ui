import React, { Component } from 'react';
import { BrowserRouter as Router, Route,HashRouter } from 'react-router-dom';
import App from '../initialpage/App';

const MainApp = () => (
   <Router>
         <Route path="/" component={App} />
	</Router>
);

export default MainApp;