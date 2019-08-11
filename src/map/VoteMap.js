import React, { Component } from 'react'
import './VoteMap.css'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { AutoComplete } from 'primereact/autocomplete'
import { FormattedMessage } from 'react-intl'
import { language } from '../index'
import { setAllZones, findZonesByFather, findFatherByChild } from '../Utilities'

var circumscriptions = []
var regions = []
var provinces = []
var cities = []

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
	
	render() {
		let objects = require('../cities/' + language + '.json')
		if (this.props.votingPaper) {
			if (this.props.votingPaper.type === 'little-nogroup')
				circumscriptions = objects.zones.map(city => {
					return { label: city.name, value: city.id}})
					
			if (!this.state.circumscription)
				regions = objects.zones.flatMap(city => city.zones).map(city => {
					return { label: city.name, value: city.id}})
			else 
				findZonesByFather(this.state.circumscription, objects.zones, regions = [], provinces = [], cities = [])
			
			if (!this.state.circumscription || this.state.region)
				if (!this.state.region)
					provinces = objects.zones.flatMap(city => city.zones).flatMap(city => city.zones).map(city => {
						return { label: city.name, value: city.id}})
				else 
					findZonesByFather(this.state.region, objects.zones, provinces = [], cities = [])
			
			if ((!this.state.circumscription && !this.state.region) || this.state.province)
				if (!this.state.province)
					cities = objects.zones.flatMap(city => city.zones).flatMap(city => city.zones).flatMap(city => city.zones).map(city => {
						return { label: city.name, value: city.id}})
				else findZonesByFather(this.state.province, objects.zones, cities = [])
			
			this.sites = []
			setAllZones(objects, this.props.votingPaper, this.sites, 0)
		}
		return(
			    <div>
				<FormattedMessage
        			id='app.search'
        				defaultMessage='Search site...'>
					{(placeholder) => <AutoComplete field='name' className='searchsites' value={this.state.site} onChange={(e) => 
							this.setState({site: e.value})
						}
						placeholder={placeholder} 
						suggestions={this.state.siteSuggestions} 
						completeMethod={this.suggestSites.bind(this)} size={38} /> }
				</FormattedMessage>
				<Button id='btnSearch' icon='pi pi-search' />
				{this.props.votingPaper && this.props.votingPaper.type === 'little-nogroup' && <div className='p-grid'>
					<div className='p-col-2'>
						<FormattedMessage id='app.circumscription'
		        			defaultMessage='Circumscription'>
							{(city) => <label><b>{city}</b></label> }
						</FormattedMessage>
						<FormattedMessage id='app.choosecircumscription'
							defaultMessage='Choose circumscription...'>
							{(placeholder) => <Dropdown value={this.state.circumscription} className='city' 
								onChange={(e) =>
									this.setState({circumscription: e.value, 
												   region: null, 
												   province: null, 
												   city: null})
									}
								placeholder={placeholder} 
								options={circumscriptions}
							/> }
						</FormattedMessage>
					</div>
	        	</div>}
	        	<div className='p-grid'>
	        		<div className='p-col-fixed' style={{ width: '160px' }}>
	        			<FormattedMessage id='app.region'
		        			defaultMessage='Region'>
							{(region) => <label><b>{region}</b></label> }
						</FormattedMessage>
	        			<FormattedMessage id='app.chooseregion'
	        				defaultMessage='Choose region...'>
							{(placeholder) => <Dropdown value={this.state.region} className='choose' 
								onChange={(e) => {
									let resultCircumscriptions = []
									findFatherByChild(e.value, objects.zones, resultCircumscriptions)
									let ci = resultCircumscriptions.pop()
									this.setState({circumscription: this.state.circumscription ? this.state.circumscription : ci.id,
												   region: e.value, 
												   province: null, 
												   city: null})
									}
								}
								placeholder={placeholder}
								options={regions} 
							/> }
							</FormattedMessage>
					</div>
					<div className='p-col-2'>
						<FormattedMessage id='app.province'
		        			defaultMessage='Province'>
							{(province) => <label><b>{province}</b></label> }
						</FormattedMessage>
		        		<FormattedMessage id='app.chooseprovince'
		        			defaultMessage='Choose province...'>
							{(placeholder) => <Dropdown value={this.state.province} className='choose' 
								onChange={(e) => {
									let resultRegions = []
									findFatherByChild(e.value, objects.zones, resultRegions)
									let re = resultRegions.pop()
									let resultCircumscriptions = []
									findFatherByChild(re.id, objects.zones, resultCircumscriptions)
									let ci = resultCircumscriptions.pop()
									this.setState({circumscription: this.state.circumscription ? this.state.circumscription : ci.id, 
												   region: this.state.region ? this.state.region : re.id, 
										   		   province: e.value, 
												   city: null})
									}
								}
								placeholder={placeholder} 
								options={provinces} 
							/> }
						</FormattedMessage>
					</div>
				</div>
				<div className='p-grid'>
					<div className='p-col-2'>
						<FormattedMessage id='app.city'
		        			defaultMessage='City'>
							{(city) => <label><b>{city}</b></label> }
						</FormattedMessage>
						<FormattedMessage id='app.choosecity'
							defaultMessage='Choose city...'>
							{(placeholder) => <Dropdown value={this.state.city} className='city' 
								onChange={(e) => {
									let resultProvince = []
									findFatherByChild(e.value, objects.zones, resultProvince)
									let pr = resultProvince.pop()
									let resultRegion = []
									findFatherByChild(pr.id, objects.zones, resultRegion)
									let re = resultRegion.pop()
									let resultCircumscriptions = []
									findFatherByChild(re.id, objects.zones, resultCircumscriptions)
									let ci = resultCircumscriptions.pop()
									this.setState({circumscription: this.state.circumscription ? this.state.circumscription : ci.id, 
												   region: this.state.region ? this.state.region : re.id, 
												   province: this.state.province ? this.state.province : pr.id, 
												   city: e.value})
									}
								}
								placeholder={placeholder} 
								options={cities} 
							/> }
						</FormattedMessage>
					</div>
	        	</div>
		    </div>
		)
	}
}

export default VoteMap