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

const colorScale = scaleLinear()
.domain([0, 100000000, 13386129701]) // Max is based on China
.range(["#FFF176", "#FFC107", "#E65100"])

class VoteMap extends Component {
	
	constructor() {
		super()

		this.state = {
		   zoom: 3,
		}

		this.handleZoomIn = this.handleZoomIn.bind(this)
		this.handleZoomOut = this.handleZoomOut.bind(this)
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
		        <ComposableMap>
		          	<ZoomableGroup zoom={ this.state.zoom }>
		          		<Geographies geography={ topoMap }>
		          		{(geographies, projection) => geographies.map(geography => (
		          				<Geography
		          					key={ geography.properties['NAME'] }
		          					geography={ geography }
		          					projection={ projection }
		          					style={{
		          						default: {
		          								fill: colorScale(geography.properties.pop_est),
		          								stroke: "#FFF",
		          								strokeWidth: 0.5,
		          								outline: "none"
		          						},
		          					}}
		          				/>
		          		))}
		          		</Geographies>
		          	</ZoomableGroup>
		        </ComposableMap>
		        <div id='bottoni-zoom'>
		        	<Button id='btnZoomIn' icon='pi pi-plus' className='fa fa-plus-circle fa-3x' onClick={ this.handleZoomIn } />
		        	<Button id='btnZoomOut' icon='pi pi-minus' className='fa fa-minus-circle fa-3x' onClick={ this.handleZoomOut } />
		        </div>
		    </div>
		)
	}
}

export default VoteMap