import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import 'materialize-css/dist/css/materialize.min.css'; // not ./, JS will assume import is from node modules
import reduxThunk from "redux-thunk";

import App from "./components/App";
import reducers from "./reducers";

//For development testing
import axios from 'axios';
window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
);