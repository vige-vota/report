import React, { Component } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { config } from './App'
import './Results.css'
import axios from 'axios'
import { getTitle } from './Utilities';

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
    	if (this.props.app.state.votingPaper) {
    		let value = this.props.app.state.votingPaper.groups
    		if (this.props.app.state.votingPaper.type === 'little-nogroup')
    			value = this.props.app.state.votingPaper.groups[0].parties
    		dataTable = <DataTable value={value}>
    						<Column field='id' expander/>
    						<Column field='image' body={this.partyTemplate} />
    						<Column field='name' header='Name' />
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