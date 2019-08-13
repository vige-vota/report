import React, { Component } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './Results.css'
import axios from 'axios'
import { getTitle, getVotesById } from './Utilities';

export class Results extends Component {

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
        			style={{ width:'40%' }} />;
    }
	
	reset() {
		this.setState({
			zone: null
		})
	}

    render() {
    	let dataTable = ''
    	if (this.state.vote && this.props.app.state.votingPaper) {
    		let value = this.props.app.state.votingPaper.groups.map((e) => { 
    			let numberVotes = getVotesById(e.id, this.state.vote)
    			return {
    			id: e.id,
    			name: e.name,
    			image: e.image,
    			votes: numberVotes,
    			percent: (numberVotes / this.state.vote.electors * 100).toFixed(2)
    		}})
    		if (this.props.app.state.votingPaper.type === 'little-nogroup')
    			value = this.props.app.state.votingPaper.groups[0].parties.map((e) => { 
    				let numberVotes = getVotesById(e.id, this.state.vote)
    				return {
        			id: e.id,
        			name: e.name,
        			image: e.image,
        			votes: numberVotes,
        			percent: (numberVotes / this.state.vote.electors * 100).toFixed(2)
    			}})
    		dataTable = <DataTable value={value} sortField="votes" sortOrder={-1}>
    						<Column field='id' expander/>
    						<Column field='image' body={this.partyTemplate} />
    						<Column field='name' header='Name' />
        					<Column field='votes' header='Votes' />
        					<Column field='percent' header='%' />
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

export default Results