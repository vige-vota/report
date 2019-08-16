import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './Results.css'
import './Littlenogroup.css'
import axios from 'axios'
import { getTitle, getVotesById, getBlankPapers, getPercent } from '../Utilities';

export class Littlenogroup extends Component {

    constructor() {
        super()
        this.state = {
        	zone: null
        }
        axios
    	.get(process.env.REACT_APP_VOTING_URL)
    	.then(response => {
    	    this.setState({vote: response.data})
    	})
    	.catch(function(error) {
    	    console.log(error)
    	});
        this.partyTemplate = this.partyTemplate.bind(this);
    }

    partyTemplate(rowData, column) {
        return <img src={`data:image/jpeg;base64,${rowData.image}`} 
        			alt={rowData.name} 
        			style={{ width:'66px', left:'10%', top:'2px', position:'relative' }} />
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
    		let footer = <div>{votings} <span className='footer-value'>{votingValues}</span> &nbsp; 
    						{blankPapers} <span className='footer-value'>{blankPapersValues}</span>
    					 </div>
    		let value = this.props.app.state.votingPaper.parties.map((e) => {
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
    		dataTable = <DataTable value={value} sortField='votes' sortOrder={-1} 
    					 scrollable={true} scrollHeight='450px' footer={footer}>
    						<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
    						<Column field='name' header={lists} style={{width: '70%' }} />
        					<Column field='votes' header={votes} />
        					<Column field='percent' header='%' style={{width:'8%'}} />
    					</DataTable>
    	}
        return (
        	<div className='tableContent'>
        		<div id='headEnti'>
        			<h3>{getTitle(this.state.zone)}</h3>
        		</div>
            	{dataTable}
            </div>
        )
    }
}

export default Littlenogroup