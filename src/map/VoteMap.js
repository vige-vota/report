import React, { Component } from 'react'
import './VoteMap.css'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { AutoComplete } from 'primereact/autocomplete'
import { FormattedMessage } from 'react-intl'

class VoteMap extends Component {
	
	constructor() {
		super()

		this.state = {
		   siteSuggestions: null
		}
		this.cities = [
		    {label: 'New York', value: 'NY'},
		    {label: 'Rome', value: 'RM'},
		    {label: 'London', value: 'LDN'},
		    {label: 'Istanbul', value: 'IST'},
		    {label: 'Paris', value: 'PRS'}
		]
		this.sites = this.cities.map(city => city.label)
	}

	suggestSites(event) {
	    let results = this.sites.filter((site) => {
	         return site.toLowerCase().startsWith(event.query.toLowerCase())
	    })
	    
	    this.setState({ siteSuggestions: results })
	}
	
	render() {
		return(
			<div>
				<FormattedMessage
        			id='app.search'
        				defaultMessage='Search site...'>
					{(placeholder) => <AutoComplete className='searchsites' value={this.state.site} onChange={(e) => this.setState({site: e.value})}
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
							{(placeholder) => <Dropdown value={this.state.city} className='city' 
								onChange={(e) => this.setState({city: e.value})}
								placeholder={placeholder} 
								options={this.cities}
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
							{(placeholder) => <Dropdown value={this.state.city} className='choose' 
								onChange={(e) => this.setState({city: e.value})}
								placeholder={placeholder} 
								options={this.cities} 
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
							{(placeholder) => <Dropdown value={this.state.city} className='choose' 
								onChange={(e) => this.setState({city: e.value})}
								placeholder={placeholder} 
								options={this.cities} 
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
								onChange={(e) => this.setState({city: e.value})}
								placeholder={placeholder} 
								options={this.cities} 
							/> }
						</FormattedMessage>
					</div>
	        	</div>
		    </div>
		)
	}
}

export default VoteMap