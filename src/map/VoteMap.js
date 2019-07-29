import React, { Component } from 'react'
import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
} from 'react-simple-maps'
import './VoteMap.css'

class VoteMap extends Component {
	
	render() {
		let topoMap = require('./topo.json')
		return(
		   <div style={{ height: '100vh', width: '100%' }}>
		     <ComposableMap>
		          <ZoomableGroup>
		          	<Geographies geography={ topoMap }>
		          		{(geographies, projection) => geographies.map(geography => (
		          				<Geography
		          					key={ geography.properties['NAME'] }
		          					geography={ geography }
		          					projection={ projection }
		          				/>
		          		))}
		          	</Geographies>
		          </ZoomableGroup>
		     </ComposableMap>
		   </div>
		)
	}
}

export default VoteMap