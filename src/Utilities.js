import React from 'react'
import { config } from './App'
import ReactDOM from 'react-dom'
import { language } from './index'
import { FormattedMessage } from 'react-intl'

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

export const getZoneById = (value, sites) => {
	if (value) {
		let result = ''
		sites.forEach(site => {
			if (site.id === value)
				result = site
		})
		return result
	} else return ''
}

export const getVotesById = (value, votes) => {
	if (value) {
		let result = 0
		votes.votingPapers.forEach(votingPaper => {
		if (votingPaper.id === value)
			result = votingPaper.electors
		else votingPaper.groups.forEach(group => {
			if (group.id === value)
				result = group.electors
			else group.parties.forEach(party => {
				if (party.id === value)
					result = party.electors
				else party.candidates.forEach(candidate => {
					if (candidate.id === value)
						result = candidate.electors
				})
			})
		})
	})
	return result
	} else return 0
}

export const getBlankPapers = (value, votes) => {
	if (value) {
		let result = 0
		votes.votingPapers.forEach(votingPaper => {
			console.log(votingPaper.electors)
			if (votingPaper.id === value) {
				console.log(votingPaper.groups)
				console.log(votingPaper.parties)
				if (!votingPaper.groups && !votingPaper.parties)
					result++
			}
		})
	return result
	} else return 0
}

export const getTitle = (value) => {
	if (value) {
		return <FormattedMessage id={'level_' + value.level}>
					{e => e + ' ' + value.name}
			   </FormattedMessage>
	} else return <FormattedMessage id={language} defaultMessage='Great Britain' />
}

export const setAllZones = (value, votingPaper, list, counter) => {
		value.zones.forEach(zone => { 
			if (zone.zones) {
				if (votingPaper.type === 'little-nogroup' || counter > 0)
					list.push(zone)
				setAllZones(zone, votingPaper, list, counter + 1)
			}
		})
}

export const findZonesByFather = (value, zones, list, list2, list3) => {
	zones.forEach(zone => {
		if (zone.id === value)
			zone.zones.forEach( e => { 
				list.push( { label: e.name, value: e.id})
				if (list2)
					e.zones.forEach( f => {
						list2.push( { label: f.name, value: f.id})
						if (list3)
							f.zones.forEach( g => {
								list3.push( { label: g.name, value: g.id})
							})
					})
			})
		else findZonesByFather(value, zone.zones, list, list2, list3)
	})
}

export const findFatherByChild = (value, objects, result) => {
	objects.forEach(object => {
		object.zones.forEach(zone => {
		if (zone)
			if (zone.id === value) {
				result.push(object)
			} else {
				findFatherByChild(value, object.zones, result)	
			}
		})
	})
}