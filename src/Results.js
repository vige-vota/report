import React, { Component } from 'react'
import { TreeTable } from 'primereact/treetable'
import { Column } from 'primereact/column'
import { config } from './App'

export class Results extends Component {

    constructor() {
        super()
        this.state = {}
    }

    render() {
        return (
            <TreeTable value={config.votingPapers}>
                <Column field="id" header="Id" />
                <Column field="name" header="Name" />
                <Column field="cssStyle" header="CssStyle" />
                <Column field="color" header="Color" />
            </TreeTable>
        )
    }
}

export default Results