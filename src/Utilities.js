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