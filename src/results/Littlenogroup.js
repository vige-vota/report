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
import {history} from '../index'

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
        	voting_url = process.env.REACT_APP_HISTORY_VOTING_URL + window.location.pathname
        }
        axios
    	.get(voting_url)
    	.then(response => {
    	    this.setState({vote: response.data})
    	})
    	.catch(function(error) {
    	    console.log(error)
    	});
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
    	let component = getComponentById(data.id, this.props.app.state.votingPaper)
    	if (component.candidates)
    		return <Button label={data.name} className='candidates-button' 
    			onClick={(e) => this.setState({showCandidates: true, selectedParty: component})} />
    		else return data.name
    }

    partyTemplate(rowData, column) {
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
    	let dataTable = ''
    	if (this.state.vote && this.props.app.state.votingPaper) {
            let votings = <FormattedMessage id='app.table.votings' defaultMessage='Votings:' />
            let blankPapers = <FormattedMessage id='app.table.blankpapers' defaultMessage='Blank papers:' />
    		let votingValues = getVotesById(this.props.app.state.votingPaper.id, this.state.vote)
    		let blankPapersValues = getBlankPapers(this.props.app.state.votingPaper.id, this.state.vote)
            let updateDate = <FormattedMessage id='app.table.updatedate' defaultMessage='Data updated to:' />
    		let updateDateValues = getUpdateDate(this.state.vote)
    		let footer = <div>{votings} <span className='footer-value'>{votingValues}</span> &nbsp; 
    						{blankPapers} <span className='footer-value'>{blankPapersValues}</span> &nbsp;
    						{updateDate} <span className='footer-value'>{updateDateValues}</span>
    					 </div>
    		let values = this.props.app.state.votingPaper.parties
    		let value = values.map((e) => {
    				let numberVotes = getVotesById(e.id, this.state.vote)
                	let percent = getPercent(e.id, this.state.vote)
    				return {
    					id: e.id,
    					name: e.name,
    					image: e.image,
    					votes: numberVotes,
    					percent: percent
    		}})
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
    		else dataTable = <DataTable value={value} sortField='votes' sortOrder={-1} 
			 			scrollable={true} scrollHeight='450px' footer={footer}>
							<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
							<Column field='name' header={lists} body={this.candidatesTemplate} />
							<Column field='percent' header='%' style={{width:'10%'}} />
							<Column field='percent' header='%' style={{width:'10%'}} />
							<Column field='percent' header='%' style={{width:'10%'}} />
							<Column field='percent' header='%' style={{width:'10%'}} />
							<Column field='percent' header='%' style={{width:'10%'}} />
							<Column field='percent' header='%' style={{width:'10%'}} />
						</DataTable>
    	}
        return (
        	<div className='tableContent'>
        		<div id='headEnti'>
        			<h3>{getTitle(this.state.zone)}</h3>
        		</div>
            	{dataTable}
            	<Dialog visible={this.state.showCandidates} 
        			modal={true} onHide={() => this.setState({showCandidates: false})}
        			style={{width: '50vw'}} header={this.renderModalHeader()}>
        			<Candidates zone={this.state.zone} party={this.state.selectedParty} 
        				vote={this.state.vote} app={this.props.app} />
        		</Dialog>
            </div>
        )
    }
}

export default Littlenogroup