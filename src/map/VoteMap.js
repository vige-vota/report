import React, { Component } from 'react'
import './VoteMap.css'
import { FormattedMessage } from 'react-intl'
import { getVotingPaperByZone, getZoneById, getZoneIdsToExpand, getFirstZoneId } from '../Utilities'
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
                ]
		}
 		this.zoneSelect = React.createRef()
        this.zoneService = new ZoneService()
	}

    componentDidMount() {
    	let allVotingPapers = this.props.app.props.config.votingPapers
    	let zones = this.zoneService.zonesFrom(allVotingPapers)
    	if (zones)
    		this.zoneService.getTreeZones(zones).then(data => {
    			let site = getFirstZoneId(data.data.zones)
			
				let result = []
				getZoneById(result, site, data.data.zones)
				let votingPaperByZone = getVotingPaperByZone(site)
				this.props.app.setState({ votingPaper: votingPaperByZone,
									  zone: result[0] })
    			let expandedKeys = {}
    			getZoneIdsToExpand(expandedKeys, data.data.zones)
        		this.setState({ site: site, expandedKeys: expandedKeys, zones: data.data.zones, sites: this.zoneService.convert(data.data.zones, allVotingPapers) })
       	    })
    }

    componentDidUpdate() {
		if (this.zoneSelect.current)
			this.zoneSelect.current.setState({
				expandedKeys: this.state.expandedKeys
			})
    }

	render() {
		let ballots = ''
    	if (history) {
    		ballots = <TabMenu ref='tabVotes' className='vote-tabvotes' model={this.state.tabvotes} activeIndex={this.props.app.state.activeTabVoteIndex} onTabChange={(e) => {
            		this.props.app.setState({ activeTabVote: e.value, activeTabVoteIndex: e.index })
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
								let result = []
								getZoneById(result, e.value, this.state.zones)
								let votingPaperByZone = getVotingPaperByZone(e.value)
								this.props.app.setState({ votingPaper: votingPaperByZone,
														  zone: result[0] })
								this.props.app.state.items[0].id = votingPaperByZone.id
								this.props.app.state.items[0].label = votingPaperByZone.name
							}
						} filter placeholder={chooseZone[0]}>
							</TreeSelect>}
						 </FormattedMessage>
		return (
			<div>
				<div className='grid'>
					<div className='col-2'>
    					{chooseZone}
						{ballots}
					</div>
				</div>
			</div>
		)
	}
}

export default VoteMap