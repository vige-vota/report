import React, { Component } from 'react'
import { scaleLinear } from "d3-scale"
import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
} from 'react-simple-maps'
import './VoteMap.css'
import { Button } from 'primereact/button'
import { AutoComplete } from 'primereact/autocomplete'
import { FormattedMessage } from 'react-intl'
import 'primeflex/primeflex.css'

const colorScale = scaleLinear()
.domain([0, 100000000, 13386129701]) // Max is based on China
.range(["#FFF176", "#FFC107", "#E65100"])

class VoteMap extends Component {
	
	constructor() {
		super()

		this.state = {
		   zoom: 3,
		   siteSuggestions: null
		}
		this.sites = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo'];

		this.handleZoomIn = this.handleZoomIn.bind(this)
		this.handleZoomOut = this.handleZoomOut.bind(this)
		this.handleRefresh = this.handleRefresh.bind(this)
		this.handleWheel = this.handleWheel.bind(this)
	}

	suggestSites(event) {
	    let results = this.sites.filter((site) => {
	         return site.toLowerCase().startsWith(event.query.toLowerCase());
	    });
	    
	    this.setState({ siteSuggestions: results });
	}
		  
	handleRefresh() {
		this.setState({
			zoom: 3,
		})
	}
		  
	handleWheel(event) {
	   if (event.deltaY > 0)
		   if (this.state.zoom > 1)
				this.setState({
					zoom: this.state.zoom / 1.1,
				})
	   if (event.deltaY < 0)
		   if (this.state.zoom < 128)
				this.setState({
					zoom: this.state.zoom * 1.1,
				})
	}
		  
	handleZoomIn() {
		if (this.state.zoom < 128)
			this.setState({
				zoom: this.state.zoom * 2,
			})
	}
		  
	handleZoomOut() {
		if (this.state.zoom > 1)
			this.setState({
				zoom: this.state.zoom / 2,
			})
	}
	
	render() {
		let topoMap = require('./topo.json')
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
				<ComposableMap>
		          	<ZoomableGroup zoom={ this.state.zoom }>
		          		<Geographies geography={ topoMap }>
		          		{(geographies, projection) => geographies.map(geography => (
		          				<Geography
		          					key={ geography.properties['NAME'] }
		          					geography={ geography }
		          					projection={ projection }
		          				 	onWheel = {(e) => this.handleWheel(e)}
		          					style={{
		          						default: {
		          							fill: colorScale(geography.properties.pop_est),
		          							stroke: "#FFF",
		          							strokeWidth: 0.5,
		          							outline: "none"
		          						},
		                                hover: {
		                                    fill: "#607D8B",
		                                    stroke: "#607D8B",
		                                    strokeWidth: 0.75,
		                                    outline: "none"
		                                }
		          					}}
		          				/>
		          		))}
		          		</Geographies>
		          	</ZoomableGroup>
		        </ComposableMap>
		        <div id='buttons-zoom'>
	        		<Button id='#btnResetZoom' icon='pi pi-refresh' onClick={ this.handleRefresh } />
		        	<Button id='btnZoomIn' icon='pi pi-plus' onClick={ this.handleZoomIn } />
		        	<Button id='btnZoomOut' icon='pi pi-minus' onClick={ this.handleZoomOut } />
		        </div>
	        	<div className='p-grid'>
	        		<div className='p-col-fixed' style={{ width: '160px' }}>
	        			<FormattedMessage id='app.region'
		        			defaultMessage='Region'>
							{(region) => <label><b>{region}</b></label> }
						</FormattedMessage>
	        			<FormattedMessage id='app.chooseregion'
	        				defaultMessage='Choose region...'>
							{(placeholder) => <AutoComplete value={this.state.site} onChange={(e) => this.setState({site: e.value})}
							placeholder={placeholder} 
							suggestions={this.state.siteSuggestions} 
							completeMethod={this.suggestSites.bind(this)} size={19} /> }
							</FormattedMessage>
					</div>
					<div className='p-col-2'>
						<FormattedMessage id='app.province'
		        			defaultMessage='Province'>
							{(province) => <label><b>{province}</b></label> }
						</FormattedMessage>
		        		<FormattedMessage id='app.chooseprovince'
		        			defaultMessage='Choose province...'>
							{(placeholder) => <AutoComplete value={this.state.site} onChange={(e) => this.setState({site: e.value})}
							placeholder={placeholder} 
							suggestions={this.state.siteSuggestions} 
							completeMethod={this.suggestSites.bind(this)} size={19} /> }
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
							{(placeholder) => <AutoComplete value={this.state.site} onChange={(e) => this.setState({site: e.value})}
							placeholder={placeholder} 
							suggestions={this.state.siteSuggestions} 
							completeMethod={this.suggestSites.bind(this)} size={42} /> }
						</FormattedMessage>
					</div>
	        	</div>
		    </div>
		)
	}
}

export default VoteMap