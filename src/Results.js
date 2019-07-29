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
            <DataTable value={config.votingPapers}>
            	<Column field="id" expander/>
                <Column field="id" header="Id" />
                <Column field="name" header="Name" />
                <Column field="cssStyle" header="CssStyle" />
                <Column field="color" header="Color" />
            </DataTable>
        )
    }
}

export default Results