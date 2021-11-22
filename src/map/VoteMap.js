import React, { Component } from 'react'
import './VoteMap.css'
import { FormattedMessage } from 'react-intl'
import { getVotingPaperByZone, getZoneById } from '../Utilities'
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
        this.zoneService = new ZoneService()
	}

    componentDidMount() {
    	let allVotingPapers = this.props.app.props.config.votingPapers
    	this.zoneService.getTreeZones(this.zoneService.zonesFrom(allVotingPapers)).then(data => {
        	this.setState({ zones: data.data.zones, sites: this.zoneService.convert(data.data.zones, allVotingPapers) })
        })
    }

	reset() {
		this.setState({
			site: null
		})
	}

	render() {
		let ballots = ''
    	if (history) {
    		ballots = <TabMenu ref='tabVotes' className='vote-tabvotes' model={this.state.tabvotes} activeIndex={this.state.activeTabVoteIndex} onTabChange={(e) => {
            		this.setState({ activeTabVote: e.value, activeTabVoteIndex: e.index })
            		this.reset()
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
								this.props.app.setState({ votingPaper: getVotingPaperByZone(e.value),
														  zone: result[0] })
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