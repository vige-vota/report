import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography
} from 'react-simple-maps'
import './VoteMap.css'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { AutoComplete } from 'primereact/autocomplete'
import { FormattedMessage } from 'react-intl'
import 'primeflex/primeflex.css'

const colorScale = scaleLinear()
.domain([0, 100000000, 13386129701]) // Max is based on China
.range(['#FFF176', '#FFC107', '#E65100'])

const include = [
  "Italy"
]

const min_zoom = 28
const max_zoom = 128
const wheel_zoom = 1.1
const click_zoom = 2

class VoteMap extends Component {
	
	constructor() {
		super()

		this.state = {
		   zoom: min_zoom,
		   disablePanning: true,
		   siteSuggestions: null
		}
		this.sites = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo']
		this.cities = [
		    {label: 'New York', value: 'NY'},
		    {label: 'Rome', value: 'RM'},
		    {label: 'London', value: 'LDN'},
		    {label: 'Istanbul', value: 'IST'},
		    {label: 'Paris', value: 'PRS'}
		]

		this.handleZoomIn = this.handleZoomIn.bind(this)
		this.handleZoomOut = this.handleZoomOut.bind(this)
		this.handleRefresh = this.handleRefresh.bind(this)
		this.handleWheel = this.handleWheel.bind(this)
		this.handleClick = this.handleClick.bind(this)
	}

	suggestSites(event) {
	    let results = this.sites.filter((site) => {
	         return site.toLowerCase().startsWith(event.query.toLowerCase())
	    })
	    
	    this.setState({ siteSuggestions: results })
	}
		  
	handleRefresh() {
		this.setState({
			zoom: min_zoom
		})
	}
		  
	handleWheel(event) {
	   if (event.deltaY > 0) {
		   let newZoom = this.state.zoom / wheel_zoom
		   this.setState({
				zoom: newZoom > min_zoom ? newZoom : min_zoom,
			})
	   }
	   if (event.deltaY < 0) {
		   let newZoom = this.state.zoom * wheel_zoom
		   this.setState({
				zoom: newZoom < max_zoom ? newZoom : max_zoom,
			})
	   }
	}
		  
	handleZoomIn() {
		let newZoom = this.state.zoom * click_zoom
		this.setState({
			zoom: newZoom < max_zoom ? newZoom : max_zoom,
			disablePanning: false
		})
	}
		  
	handleZoomOut() {
		let newZoom = this.state.zoom / click_zoom
		this.setState({
			zoom: newZoom > min_zoom ? newZoom : min_zoom,
		})
	}
		  
	handleClick() {
		this.handleZoomIn()
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
		          	<ZoomableGroup zoom={ this.state.zoom } center={[ 5, 35 ]} disablePanning={this.state.disablePanning}>
		          		<Geographies geography={ topoMap }>
		          		{(geographies, projection) => geographies.map(geography => 
		          				include.indexOf(geography.properties['NAME']) !== -1 && (
		          				<Geography
		          					key={ geography.properties['NAME'] }
		          					geography={ geography }
		          					projection={ projection }
		          				 	onWheel = {(e) => this.handleWheel(e)}
		          				 	onClick = {(e) => this.handleClick(e)}
		          					style={{
		          						default: {
		          							fill: colorScale(geography.properties.pop_est),
		          							stroke: '#FFF',
		          							strokeWidth: 0.5,
		          							outline: 'none'
		          						},
		                                hover: {
		                                    fill: '#2079d4',
		                                    stroke: '#2079d4',
		                                    strokeWidth: 0.75,
		                                    outline: 'none'
		                                },
		                                pressed: {
		                                    fill: 'blue'
		                                }
		          					}}
		          				/>
		          		))}
		          		</Geographies>
		          	</ZoomableGroup>
		        </ComposableMap>
		        <div id='buttons-zoom'>
	        		<Button id='btnResetZoom' icon='pi pi-refresh' onClick={ this.handleRefresh } />
		        	<Button id='btnZoomIn' icon='pi pi-plus' onClick={ this.handleZoomIn } />
		        	<Button id='btnZoomOut' icon='pi pi-minus' onClick={ this.handleZoomOut } />
		        </div>
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