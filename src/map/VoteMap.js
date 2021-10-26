import React, { Component } from 'react'
import './VoteMap.css'
import { FormattedMessage } from 'react-intl'
import { setAllZones, getZoneById, alphabetic } from '../Utilities'
import { locations } from '../index'
import { TreeSelect } from 'primereact/treeselect'
import { ZoneService } from '../services/ZoneService'

class VoteMap extends Component {

	constructor() {
		super()

		this.state = {
			bubbusettetes: null
		}
 		this.zoneSelect = React.createRef()
        this.zoneService = new ZoneService();
	}

    componentDidMount() {
        this.zoneService.getTreeZones().then(data => {
        	this.setState({ bubbusettetes: this.zoneService.convert(data.data.zones) })
        })
    }

	reset() {
		this.setState({
			bubbusettete: null
		})
	}

	renderLocations() {
		if (this.props.votingPaper && locations) {
			this.sites = []
			setAllZones(locations, this.props.votingPaper, this.sites, 0)
			alphabetic(this.sites)
		}
	}

	render() {
		this.renderLocations()
		return (
			<div>
				<div className='p-grid'>
					<div className='p-col-2'>
    				<FormattedMessage
            				id='app.choosezone'
            				defaultMessage='Choose zone'>
							{(chooseZone) => <TreeSelect ref={this.zoneSelect} value={this.state.bubbusettete} 
									options={this.state.bubbusettetes} onChange={(e) =>  { this.setState(
								{
									bubbusettete: e.value
								})
								this.props.app.results.current.setState({ zone: getZoneById(e.value, this.sites) })
							}
						} filter placeholder={chooseZone[0]}>
							</TreeSelect>}
							</FormattedMessage>
					</div>
				</div>
			</div>
		)
	}
}

export default VoteMap