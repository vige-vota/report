import React from 'react'

import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {IntlProvider, addLocaleData} from 'react-intl'
import * as serviceWorker from './serviceWorker'
import locale_en from 'react-intl/locale-data/en'
import locale_it from 'react-intl/locale-data/it'
import messages_it from './translations/it.json'
import axios from 'axios'
import {ProgressSpinner} from 'primereact/progressspinner'
import ErrorBoundary from './errors/ErrorBoundary'

addLocaleData([...locale_en, ...locale_it])

const messages = {
    'it': messages_it
}

export const language = navigator.language.split(/[-_]/)[0]  // language without region code
export var history = ''
export var locations = ''

let voting_papers_url = process.env.REACT_APP_VOTING_PAPERS_URL
let cities_generator_url = process.env.REACT_APP_CITIES_GENERATOR_URL
if (window.location.search.startsWith('?date=')) {
	history = window.location.search.split('=')[1]
	voting_papers_url = process.env.REACT_APP_HISTORY_VOTING_PAPERS_URL + '/' + history
}
console.log(voting_papers_url)
ReactDOM.render(<ProgressSpinner/>, document.getElementById('root'))
axios
	.get(voting_papers_url)
	.then(function(papers) {
		axios
			.get(cities_generator_url)
			.then(function (cities) {
				locations = cities.data
	    		ReactDOM.render(<IntlProvider locale={language} messages={messages[language]}><App config={papers.data} /></IntlProvider>, document.getElementById('root'))
	    		// If you want your app to work offline and load faster, you can change
	    		// unregister() to register() below. Note this comes with some pitfalls.
	    		// Learn more about service workers: http://bit.ly/CRA-PWA
				serviceWorker.register()
			})
	})
	.catch(function(error) {
		ReactDOM.render(<IntlProvider locale={language} messages={messages[language]}><ErrorBoundary error={error} errorInfo={error}/></IntlProvider>, document.getElementById('root'))
	    console.log(error)
	})
