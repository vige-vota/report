import React, { Component } from 'react'
import './VoteMap.css'
import { FormattedMessage } from 'react-intl'
import { getVotingPaperByZone, setAllZones, getZoneById, alphabetic } from '../Utilities'
import { locations } from '../index'
import { TreeSelect } from 'primereact/treeselect'
import { ZoneService } from '../services/ZoneService'
import { history } from '../index'
import { TabMenu } from 'primereact/tabmenu'

class VoteMap extends Component {

	constructor() {
		super()

		this.state = {
			sites: null,
            tabvotes: [
            	{ id: 0, label: <FormattedMessage id='app.tab.ballots' defaultMessage='BALLOTS' /> },
            	{ id: 1, label: <FormattedMessage id='app.tab.voters' defaultMessage='VOTERS' /> }
                ],
            activeTabVote: { id: 0, label: <FormattedMessage id='app.tab.ballots' defaultMessage='BALLOTS' /> },
            activeTabVoteIndex: 0,
		}
 		this.zoneSelect = React.createRef()
        this.zoneService = new ZoneService();
	}

    componentDidMount() {
        this.zoneService.getTreeZones().then(data => {
        	this.setState({ sites: this.zoneService.convert(data.data.zones) })
        })
    }

	reset() {
		this.setState({
			site: null
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
		let ballots = ''
		this.renderLocations()
    	if (history) {
    		ballots = <TabMenu ref='tabVotes' className='vote-tabvotes' model={this.state.tabvotes} activeIndex={this.state.activeTabVoteIndex} onTabChange={(e) => {
            		this.setState({ activeTabVote: e.value, activeTabVoteIndex: e.index })
            		this.reset()
            		if (this.props.app.results.current)
            			this.props.app.results.current.reset()
            		}
            	} />
    	}
    	let chooseZone = ''
    	if (this.props.votingPaper && (this.props.votingPaper.type === 'bigger' || this.props.votingPaper.type === 'bigger-partygroup'))
    		chooseZone = <FormattedMessage
            				id='app.choosezone'
            				defaultMessage='Choose zone'>
							{(chooseZone) => <TreeSelect ref={this.zoneSelect} value={this.state.site} 
									options={this.state.sites} onChange={(e) =>  { this.setState(
								{
									site: e.value
								})
								this.props.app.results.current.setState({ zone: getZoneById(e.value, this.sites) })
								this.props.app.setState({ votingPaper: getVotingPaperByZone(e.value) })
								console.log(this.props.app.votingPaper)
							}
						} filter placeholder={chooseZone[0]}>
							</TreeSelect>}
							</FormattedMessage>
		return (
			<div>
				<div className='p-grid'>
					<div className='p-col-2'>
    					{chooseZone}
						{ballots}
					</div>
				</div>
			</div>
		)
	}
}

export default VoteMap