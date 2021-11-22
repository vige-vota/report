import React from 'react'
import { config } from './App'
import ReactDOM from 'react-dom'
import { language } from './index'
import { FormattedMessage } from 'react-intl'

export const getTabs = (component, style) => {
    return ReactDOM.findDOMNode(component).querySelectorAll(style + ' .p-menuitem-link')
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

export const getVotingPaperByZone = (value) => {
	if (value) {
		let result = ''
    	config.votingPapers.forEach(votingPaper => {
			if (votingPaper.zone &&  votingPaper.zone === value)
				result = votingPaper
		})
		return result
	} else return ''
}

export const getZoneById = (result, value, sites) => {
	for (let i = 0; i < sites.length; i++) {
		let site = sites[i]
		if (site.id === value || !value)
			result[0] = site
		else
			getZoneById(result, value, site.zones)
	}
}

export const getComponentById = (value, votingPaper) => {
	let result
	if (votingPaper.id === value)
		result = votingPaper
	else {
		if (votingPaper.groups)
			votingPaper.groups.forEach(group => {
				if (group.id === value)
					result = group
					else group.parties.forEach(party => {
						if (party.id === value)
							result = party
						else if (party.candidates)
							party.candidates.forEach(candidate => {
								if (candidate.id === value)
									result = candidate
							})
					})
			})
		if (votingPaper.parties)
			votingPaper.parties.forEach(party => {
				if (party.id === value)
					result = party
				else if (party.candidates) 
					party.candidates.forEach(candidate => {
						if (candidate.id === value)
							result = candidate
					})
			})
		}
	return result
}

export const getVotesById = (value, votes) => {
	let result = 0
	votes.votingPapers.forEach(votingPaper => {
		let component = getComponentById(value, votingPaper)
		if (component)
			result = component.electors
	})
	return result
}

export const getPercent = (value, votes) => {
	let voteComponent
	let voteVotingPaper
	let result = 0
	votes.votingPapers.forEach(votingPaper => {
		let component = getComponentById(value, votingPaper)
		if (component) {
			voteComponent = component
			voteVotingPaper = votingPaper
		}
	})
	if (voteComponent) {
		let totalElectors = voteVotingPaper.electors - voteVotingPaper.blankPapers
		result = (voteComponent.electors / totalElectors * 100).toFixed(2)
		if (isNaN(result))
			result = 0
	}
	return parseFloat(result)
}

export const getBlankPapers = (value, votes) => {
	let list = votes.votingPapers.filter(votingPaper => votingPaper.id === value)
	if (list.length > 0)
		return list[0].blankPapers
	else return 0
}

export const getUpdateDate = (votes) => {
	let options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }
	if (votes.affluence)
		return new Date(votes.affluence).toLocaleDateString(language, options)
	else return new Date().toLocaleDateString(language, options)
}

export const getTitle = (value) => {
	if (value) {
		return <FormattedMessage id={'level_' + value.level}>
					{e => e + ' ' + value.name}
			   </FormattedMessage>
	} else return <FormattedMessage id={language} defaultMessage='Great Britain' />
}