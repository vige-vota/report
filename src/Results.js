import React, { Component } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { config } from './App'
import './Results.css'

export class Results extends Component {

    constructor() {
        super()
        this.state = {}
    }

    render() {
        return (
        	<div className='tableContent'>
        		<div id='headEnti'>
        			<h3>Regione&nbsp;ABRUZZO</h3>
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