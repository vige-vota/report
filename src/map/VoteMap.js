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
		this.handleRefresh = this.handleRefresh.bind(this)
		this.handleWheel = this.handleWheel.bind(this)
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
		        <div id='bottoni-zoom'>
	        		<Button id='btnRefresh' icon='pi pi-refresh' className='fa fa-3x' onClick={ this.handleRefresh } />
		        	<Button id='btnZoomIn' icon='pi pi-plus' className='fa fa-3x' onClick={ this.handleZoomIn } />
		        	<Button id='btnZoomOut' icon='pi pi-minus' className='fa fa-3x' onClick={ this.handleZoomOut } />
		        </div>
		    </div>
		)
	}
}

export default VoteMap