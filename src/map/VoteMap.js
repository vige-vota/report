import React, { Component } from 'react'
import './VoteMap.css'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { AutoComplete } from 'primereact/autocomplete'
import { FormattedMessage } from 'react-intl'
import { setAllZones, findZonesByFather, findFatherByChild, getZoneById, alphabetic } from '../Utilities'
import { locations } from '../index'

let circumscriptions = []
let regions = []
let provinces = []
let cities = []

class VoteMap extends Component {

	constructor() {
		super()

		this.state = {
			siteSuggestions: null
		}
	}

	suggestSites(event) {
		let results = this.sites.filter((site) => {
			return site.name.toLowerCase().startsWith(event.query.toLowerCase())
		})

		this.setState({ siteSuggestions: results })
	}

	reset() {
		this.setState({
			circumscription: null,
			region: null,
			province: null,
			city: null,
			site: null
		})
	}

	selectComplete(value) {
		this.props.app.results.current.setState({ zone: value })
		let value0 = locations.zones.filter(zone => {
			return zone.id === value.id
		})[0]
		let value1 = locations.zones.flatMap(e => e.zones).filter(zone => {
			return zone.id === value.id
		})[0]
		let value2 = locations.zones.flatMap(e => e.zones).flatMap(e => e.zones).filter(zone => {
			return zone.id === value.id
		})[0]
		let value3 = locations.zones.flatMap(e => e.zones).flatMap(e => e.zones).flatMap(e => e.zones).filter(zone => {
			return zone.id === value.id
		})[0]
		let results
		if (!value2) {
			findFatherByChild(value3 ? value3.id : null, locations.zones, results = [])
			value2 = results.pop()
		}
		if (!value1) {
			findFatherByChild(value2 ? value2.id : value3 ? value3.id : null, locations.zones, results = [])
			value1 = results.pop()
		}
		if (!value0) {
			findFatherByChild(value1 ? value1.id : value2 ? value2.id : value3 ? value3.id : null, locations.zones, results = [])
			value0 = results.pop()
		}
		this.setState({
			circumscription: value0 ? value0.id : null,
			region: value1 ? value1.id : null,
			province: value2 ? value2.id : null,
			city: value3 ? value3.id : null
		})
	}

	renderLocations() {
		if (this.props.votingPaper && locations) {
			if (this.props.votingPaper.type === 'little-nogroup')
				circumscriptions = locations.zones.map(city => {
					return { label: city.name, value: city.id }
				})

			if (this.state.circumscription === null || this.props.votingPaper.type !== 'little-nogroup')
				regions = locations.zones.flatMap(city => city.zones).map(city => {
					return { label: city.name, value: city.id }
				})
			else
				findZonesByFather(this.state.circumscription, locations.zones, regions = [], provinces = [], cities = [])

			if (this.state.circumscription === null || this.state.region !== null)
				if (this.state.region === null)
					provinces = locations.zones.flatMap(city => city.zones).flatMap(city => city.zones).map(city => {
						return { label: city.name, value: city.id }
					})
				else
					findZonesByFather(this.state.region, locations.zones, provinces = [], cities = [])

			if ((this.state.circumscription === null && this.state.region === null) || this.state.province !== null)
				if (this.state.province === null)
					cities = locations.zones.flatMap(city => city.zones).flatMap(city => city.zones).flatMap(city => city.zones).map(city => {
						return { label: city.name, value: city.id }
					})
				else findZonesByFather(this.state.province, locations.zones, cities = [])

			this.sites = []
			setAllZones(locations, this.props.votingPaper, this.sites, 0)
			alphabetic(this.sites)
			alphabetic(cities)
			alphabetic(provinces)
			alphabetic(regions)
			alphabetic(circumscriptions)
		}
	}

	render() {
		this.renderLocations()
		return (
			<div>
				<FormattedMessage
					id='app.search'
					defaultMessage='Search site...'>
					{(placeholder) => <AutoComplete field='name' className='searchsites' value={this.state.site} onChange={(e) =>
						this.setState({
							site: e.value
						})
					} onSelect={(e) => {
						this.selectComplete(e.value)
					}}
						placeholder={placeholder[0]}
						suggestions={this.state.siteSuggestions}
						completeMethod={this.suggestSites.bind(this)} size={38} />}
				</FormattedMessage>
				<Button id='btnSearch' icon='pi pi-search' />
				{this.props.votingPaper && this.props.votingPaper.type === 'little-nogroup' && <div className='p-grid'>
					<div className='p-col-2'>
						<FormattedMessage id='app.circumscription'
							defaultMessage='Circumscription'>
							{(city) => <label><b>{city}</b></label>}
						</FormattedMessage>
						<FormattedMessage id='app.choosecircumscription'
							defaultMessage='Choose circumscription...'>
							{(placeholder) => <Dropdown value={this.state.circumscription} className='city'
								onChange={(e) => {
									this.setState({
										circumscription: e.value,
										region: null,
										province: null,
										city: null,
										site: null
									})
									this.props.app.results.current.setState({ zone: getZoneById(e.value, this.sites) })
								}}
								placeholder={placeholder[0]}
								options={circumscriptions}
							/>}
						</FormattedMessage>
					</div>
				</div>}
				<div className='p-grid'>
					<div className='p-col-fixed' style={{ width: '160px' }}>
						<FormattedMessage id='app.region'
							defaultMessage='Region'>
							{(region) => <label><b>{region}</b></label>}
						</FormattedMessage>
						<FormattedMessage id='app.chooseregion'
							defaultMessage='Choose region...'>
							{(placeholder) => <Dropdown value={this.state.region} className='choose'
								onChange={(e) => {
									let resultCircumscriptions = []
									findFatherByChild(e.value, locations.zones, resultCircumscriptions)
									let ci = resultCircumscriptions.pop()
									this.setState({
										circumscription: this.state.circumscription !== null ? this.state.circumscription : ci.id,
										region: e.value,
										province: null,
										city: null,
										site: null
									})
									this.props.app.results.current.setState({ zone: getZoneById(e.value, this.sites) })
								}}
								placeholder={placeholder[0]}
								options={regions}
							/>}
						</FormattedMessage>
					</div>
					<div className='p-col-2'>
						<FormattedMessage id='app.province'
							defaultMessage='Province'>
							{(province) => <label><b>{province}</b></label>}
						</FormattedMessage>
						<FormattedMessage id='app.chooseprovince'
							defaultMessage='Choose province...'>
							{(placeholder) => <Dropdown value={this.state.province} className='choose'
								onChange={(e) => {
									let resultRegions = []
									findFatherByChild(e.value, locations.zones, resultRegions)
									let re = resultRegions.pop()
									let resultCircumscriptions = []
									findFatherByChild(re.id, locations.zones, resultCircumscriptions)
									let ci = resultCircumscriptions.pop()
									this.setState({
										circumscription: this.state.circumscription !== null ? this.state.circumscription : ci.id,
										region: this.state.region !== null ? this.state.region : re.id,
										province: e.value,
										city: null,
										site: null
									})
									this.props.app.results.current.setState({ zone: getZoneById(e.value, this.sites) })
								}}
								placeholder={placeholder[0]}
								options={provinces}
							/>}
						</FormattedMessage>
					</div>
				</div>
				<div className='p-grid'>
					<div className='p-col-2'>
						<FormattedMessage id='app.city'
							defaultMessage='City'>
							{(city) => <label><b>{city}</b></label>}
						</FormattedMessage>
						<FormattedMessage id='app.choosecity'
							defaultMessage='Choose city...'>
							{(placeholder) => <Dropdown value={this.state.city} className='city'
								onChange={(e) => {
									let resultProvince = []
									findFatherByChild(e.value, locations.zones, resultProvince)
									let pr = resultProvince.pop()
									let resultRegion = []
									findFatherByChild(pr.id, locations.zones, resultRegion)
									let re = resultRegion.pop()
									let resultCircumscriptions = []
									findFatherByChild(re.id, locations.zones, resultCircumscriptions)
									let ci = resultCircumscriptions.pop()
									this.setState({
										circumscription: this.state.circumscription !== null ? this.state.circumscription : ci.id,
										region: this.state.region !== null ? this.state.region : re.id,
										province: this.state.province !== null ? this.state.province : pr.id,
										city: e.value,
										site: null
									})
									this.props.app.results.current.setState({ zone: getZoneById(e.value, this.sites) })
								}}
								placeholder={placeholder[0]}
								options={cities}
							/>}
						</FormattedMessage>
					</div>
				</div>
			</div>
		)
	}
}

export default VoteMap