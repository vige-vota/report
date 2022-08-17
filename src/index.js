import React from 'react'

import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App'
import {IntlProvider} from 'react-intl'
import * as serviceWorker from './serviceWorker'
import messages_it from './translations/it.json'
import axios from 'axios'
import {ProgressSpinner} from 'primereact/progressspinner'
import ErrorBoundary from './errors/ErrorBoundary'

const messages = {
    'it': messages_it
}

export const language = navigator.language.split(/[-_]/)[0]  // language without region code
export var history = ''

let voting_papers_url = process.env.REACT_APP_VOTING_PAPERS_URL
if (window.location.search.startsWith('?date=')) {
	history = window.location.search.split('=')[1]
	voting_papers_url = process.env.REACT_APP_HISTORY_VOTING_PAPERS_URL + '/' + history
}
const root = createRoot(document.getElementById('root'));
root.render(<ProgressSpinner/>)
axios
	.get(voting_papers_url)
	.then(function(papers) {
	    root.render(<IntlProvider locale={language} messages={messages[language]}><App config={papers.data} /></IntlProvider>)
	    // If you want your app to work offline and load faster, you can change
	    // unregister() to register() below. Note this comes with some pitfalls.
	    // Learn more about service workers: http://bit.ly/CRA-PWA
		serviceWorker.register()
	})
	.catch(function(error) {
		root.render(<IntlProvider locale={language} messages={messages[language]}><ErrorBoundary error={error} errorInfo={error}/></IntlProvider>)
	    console.log(error)
	})
