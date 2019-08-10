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

export const setAllZones = (value, votingPaper, list, counter) => {
		value.zones.forEach(zone => { 
			if (zone.zones) {
				if (votingPaper.type === 'little-nogroup' || counter > 0)
					list.push(zone)
				setAllZones(zone, votingPaper, list, counter + 1)
			}
		})
}

export const findZonesByFather = (value, zones, list) => {
	zones.forEach(zone => {
		if (zone.id === value)
			zone.zones.forEach( e => { list.push( { label: e.name, value: e.id})})
		else findZonesByFather(value, zone.zones, list)
	})
}