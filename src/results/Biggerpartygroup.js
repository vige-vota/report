import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './Results.css'
import './Biggerpartygroup.css'
import axios from 'axios'
import { getTitle, getVotesById, getBlankPapers, getComponentById } from '../Utilities';

export class Biggerpartygroup extends Component {

    constructor() {
        super()
        this.state = {
        	zone: null,
            expandedRows: null
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
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
    }
    
    rowExpansionTemplate(data) {
    	let dataTable = ''
        if (this.state.vote && this.props.app.state.votingPaper) {
            let values = getComponentById(data.id, this.props.app.state.votingPaper).parties
            let value = values.map((e) => {
                let numberVotes = getVotesById(e.id, this.state.vote)
            	let percent = (numberVotes / this.state.vote.electors * 100).toFixed(2)
            	if (isNaN(percent))
            		percent = 0
                return {
                	id: e.id,
                	name: e.name,
                	image: e.image,
                	votes: numberVotes,
                	percent: percent
            }})
            let votings = <FormattedMessage id='app.table.totallists' defaultMessage='Total lists'>
        				   { e => e + ' ' + getVotesById(this.props.app.state.votingPaper.id, this.state.vote) + ' '
        								  + getVotesById(this.props.app.state.votingPaper.id, this.state.vote)
        				   }
        				  </FormattedMessage>
            let footer = <div>{votings}</div>
            dataTable = <DataTable value={value} sortField="votes" sortOrder={-1} 
        			     footer={footer} className='bigger-sub-header'>
                    		<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
        					<Column field='name' style={{width: '70%' }} />
        					<Column field='votes' />
        					<Column field='percent' style={{width:'8%'}} />
        				</DataTable>
        }
        return dataTable
    }

    partyTemplate(rowData, column) {
        return <img src={`data:image/jpeg;base64,${rowData.image}`} 
        			alt={rowData.name} 
        			style={{ width:'66px' }} />;
    }
	
	reset() {
		this.setState({
			zone: null
		})
	}
	
	renderDataTable() {
    	let dataTable = ''
        if (this.state.vote && this.props.app.state.votingPaper) {
        	let values = this.props.app.state.votingPaper.groups
        	let value = values.map((e) => {
        		let numberVotes = getVotesById(e.id, this.state.vote)
    			let percent = (numberVotes / this.state.vote.electors * 100).toFixed(2)
    			if (isNaN(percent))
    				percent = 0
        		return {
        			id: e.id,
        			name: e.name,
        			image: e.image,
        			votes: numberVotes,
        			percent: percent
        	}})
            let votings = <FormattedMessage id='app.table.votings' defaultMessage='Votings'>
					   { e => e + ': ' + getVotesById(this.props.app.state.votingPaper.id, this.state.vote)}
					  </FormattedMessage>
            let blankPapers = <FormattedMessage id='app.table.blankpapers' defaultMessage='Blank papers'>
							   { e => e + ': ' + getBlankPapers(this.props.app.state.votingPaper.id, this.state.vote)}
							  </FormattedMessage>
			let footer = <div>{votings} {blankPapers}</div>
            let lists = <FormattedMessage id='app.table.lists' defaultMessage='Lists' />
            let votes = <FormattedMessage id='app.table.votes' defaultMessage='Votes' />
            dataTable = <DataTable value={value} sortField="votes" sortOrder={-1} 
        				 scrollable={true} scrollHeight='450px' footer={footer}
        				 expandedRows={this.state.expandedRows} 
        				 onRowToggle={(e) => this.setState({expandedRows:e.data})}
        				 rowExpansionTemplate={this.rowExpansionTemplate}>
            				<Column field='id' expander/>
        					<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
        					<Column field='name' header={lists} style={{width: '70%' }} />
        					<Column field='votes' header={votes} />
        					<Column field='percent' header='%' style={{width:'8%'}} />
        				</DataTable>
        }
    	return dataTable
	}

    render() {
        return (
        	<div className='tableContent'>
        		<div id='headEnti'>
        			<h3>{getTitle(this.state.zone)}</h3>
        		</div>
            	{this.renderDataTable()}
            </div>
        )
    }
}

export default Biggerpartygroup