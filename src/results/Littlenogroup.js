import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Candidates } from './Candidates'
import {Dialog} from 'primereact/dialog';
import './Results.css'
import './Littlenogroup.css'
import axios from 'axios'
import { getTitle, getVotesById, getBlankPapers, getComponentById, getPercent, getUpdateDate } from '../Utilities';
import {history, language} from '../index'
import SockJsClient from '../SockJsClient'

export class Littlenogroup extends Component {

    constructor() {
        super()
        this.state = {
        	zone: null,
        	showCandidates: null,
            selectedParty: null
        }
        let voting_url = process.env.REACT_APP_VOTING_URL
        if (history) {
        	voting_url = process.env.REACT_APP_HISTORY_VOTING_URL + '/' + history
        }
        axios
    	.get(voting_url)
    	.then(response => {
    	    this.setState({
    	    		votes: response.data.votings,
    	    		votingPaper: this.props.app.state.votingPaper
    	    	})
    	})
    	.catch(function(error) {
    	    console.log(error)
    	})
        this.partyTemplate = this.partyTemplate.bind(this);
        this.candidatesTemplate = this.candidatesTemplate.bind(this);
    }

    renderModalHeader() {
    		return (
        		<div id='headEnti'>
        			<h2>{getTitle(this.state.zone)}</h2>
        			<h3><FormattedMessage id='app.table.candidatesandelected' defaultMessage='Candidates and Elected' /></h3>
        		</div>
        )
    }
    
    candidatesTemplate(data) {
    	let component = getComponentById(data.id, this.state.votingPaper)
    	if (component.candidates)
    		return <Button label={data.name} className='candidates-button' 
    			onClick={() => this.setState({showCandidates: true, selectedParty: component})} />
    		else return data.name
    }

    partyTemplate(rowData) {
    	if (rowData.image)
    		return <img src={`data:image/jpeg;base64,${rowData.image}`} 
        				alt={rowData.name} 
        				style={{ width:'66px', left:'10%', top:'2px', position:'relative' }} />
    	else return ''
    }
	
	reset() {
		this.setState({
			zone: null
		})
	}

    render() {
    	let realTimeVotingPapers = ''
    	let realTimeVotes = ''
    	let dataTable = ''
    	if (this.state.votes && this.state.votingPaper) {
        	if (!history) {
    			realTimeVotingPapers = <SockJsClient url={process.env.REACT_APP_VOTING_PAPERS_REALTIME_URL} topics={['/topic/votingpaper']}
    										onMessage={(msg) => {
        	            					this.setState({
        	            						votingPaper: msg.votingPapers.filter(((e) => e.id === this.state.votingPaper.id))[0]
        	            					})
    								   }} />
        	    realTimeVotes = <SockJsClient url={process.env.REACT_APP_VOTING_REALTIME_URL} topics={['/topic/vote']}
        	            			onMessage={(msg) => { 
        	            				this.setState({
        	            					votes: msg.votings
        	            				})
        	            		}} />
        	}
    		let vote = this.state.votes[this.state.votes.length -1]
            let votings = <FormattedMessage id='app.table.votings' defaultMessage='Votings:' />
            let blankPapers = <FormattedMessage id='app.table.blankpapers' defaultMessage='Blank papers:' />
    		let votingValues = getVotesById(this.state.votingPaper.id, vote)
    		let blankPapersValues = getBlankPapers(this.state.votingPaper.id, vote)
            let updateDate = <FormattedMessage id='app.table.updatedate' defaultMessage='Data updated to:' />
    		let updateDateValues = getUpdateDate(vote)
    		let footer = <div>{votings} <span className='footer-value'>{votingValues}</span> &nbsp; 
    						{blankPapers} <span className='footer-value'>{blankPapersValues}</span> &nbsp;
    						{updateDate} <span className='footer-value'>{updateDateValues}</span>
    					 </div>
    		let values = this.state.votingPaper.parties
    		let value = values.map((e) => {
    				let numberVotes = getVotesById(e.id, vote)
                	let percent = getPercent(e.id, vote)
            		let jsonValue = {
            			id: e.id,
            			name: e.name,
            			image: e.image,
            			votes: numberVotes,
            			percent: percent
            		}
            		for (let i = 0; i< this.state.votes.length; i++)
            			jsonValue['percent'+i] = getPercent(e.id, this.state.votes[i])
            		return jsonValue
    		})
    		let lists = <FormattedMessage id='app.table.lists' defaultMessage='Lists' />
    		let votes = <FormattedMessage id='app.table.votes' defaultMessage='Votes' />
            if (this.props.app.state.activeTabVote.id === 0)
            	dataTable = <DataTable value={value} sortField='votes' sortOrder={-1} 
    					 scrollable={true} scrollHeight='450px' footer={footer}>
    						<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
    						<Column field='name' header={lists} body={this.candidatesTemplate} style={{width: '70%' }} />
        					<Column field='votes' header={votes} />
        					<Column field='percent' header='%' style={{width:'8%'}} />
    					</DataTable>
    		else {
    			let columns = []
    			for (let i = 0; i< this.state.votes.length; i++) {
    				let options = { hour: 'numeric', minute: 'numeric' }
    				let header = <FormattedMessage id='app.tab.ballots.hours' defaultMessage='% hours {0}' values={{0: new Date(this.state.votes[i].affluence).toLocaleTimeString(language, options)}} />
    				columns.push(<Column key={'percent-columns-' + i} field={'percent'+i} header={header} style={{width:'10%'}} />)
    			}
    			dataTable = <DataTable value={value} sortField='votes' sortOrder={-1}
			 			scrollable={true} scrollHeight='450px' footer={footer}>
							<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
							<Column field='name' header={lists} body={this.candidatesTemplate} />
							{columns}
						</DataTable>
    		}
    	}
        return (
        	<div className='tableContent'>
        		{realTimeVotingPapers}
    			{realTimeVotes}
        		<div id='headEnti'>
        			<h3>{getTitle(this.state.zone)}</h3>
        		</div>
            	{dataTable}
            	<Dialog visible={this.state.showCandidates} 
        			modal={true} onHide={() => this.setState({showCandidates: false})}
        			style={{width: '50vw'}} header={this.renderModalHeader()}>
        			<Candidates zone={this.state.zone} party={this.state.selectedParty} 
        				votes={this.state.votes} app={this.props.app} />
        		</Dialog>
            </div>
        )
    }
}

export default Littlenogroup