import { config } from './App'
import ReactDOM from 'react-dom'

export const getTabs = (component) => {
    return ReactDOM.findDOMNode(component).querySelectorAll('.p-menuitem-link')
}

export const getVotingPaperById = (value) => {
	if (value) {
		let result = ''
    	config.votingPapers.forEach(votingPaper => {
			if (votingPaper.id === value.id)
				result = votingPaper
		})
		return result
	} else return ''
}

export const getResultById = (vote, value) => {
	if (value && vote) {
		let result = ''
		let votingPapers = vote.votingPapers
		votingPapers.forEach(votingPaper => {
			if (votingPaper.id === value.id)
				result = votingPaper
		})
		return result
	} else return ''
}