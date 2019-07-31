import React, { Component } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { config } from './App'
import './Results.css'
import axios from 'axios'
import { getResultById } from './Utilities';

export class Results extends Component {

    constructor() {
        super()
        this.state = {}
        axios
    	.get(process.env.REACT_APP_VOTING_URL)
    	.then(response => {
    	    this.setState({vote: response.data})
    	})
    	.catch(function(error) {
    	    console.log(error)
    	});
    }

    render() {
        return (
        	<div className='tableContent'>
        		<div id='headEnti'>
        			<h3>{getResultById(this.state.vote, this.props.votingPaper)}</h3>
        		</div>
            	<DataTable value={config.votingPapers}>
            		<Column field='id' expander/>
            		<Column field='id' header='Id' />
            		<Column field='name' header='Name' />
            		<Column field='type' header='Type' />
            		<Column field='color' header='Color' />
            	</DataTable>
            </div>
        )
    }
}

export default Results