import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './Candidates.css'
import { getVotesById } from '../Utilities';
import { language } from '../index'

export class Candidates extends Component {

    candidateTemplate(rowData, column) {
    	if (rowData.image)
    		return <img src={`data:image/jpeg;base64,${rowData.image}`} 
        				alt={rowData.name} 
        				style={{ width:'66px', left:'10%', top:'2px', position:'relative' }} />
    	else return ''
    }
    
	renderDataTable() {
    	let dataTable = ''
        if (this.props.party) {
        	let values = this.props.party.candidates
        	let value = values.map((e) => {
        		let numberVotes = getVotesById(e.id, this.props.votes[this.props.votes.length -1])
        		let jsonValue = {
        			id: e.id,
        			name: e.name,
        			image: e.image,
        			votes: numberVotes
        		}
        		for (let i = 0; i< this.props.votes.length; i++)
        			jsonValue['votes'+i] = getVotesById(e.id, this.props.votes[i])
        		return jsonValue
        	})
            let lists = <FormattedMessage id='app.table.candidate' defaultMessage='Candidate' />
            let votes = <FormattedMessage id='app.table.preferences' defaultMessage='Preferences' />
            if (this.props.app.state.activeTabVote.id === 0)
            	dataTable = <DataTable value={value} sortField='votes' sortOrder={-1} 
        				 scrollable={true} scrollHeight='450px'
            			 className='candidates-table'>
        					<Column field='image' body={this.candidateTemplate} style={{width:'14%'}} />
        					<Column field='name' header={lists} style={{width:'70%'}} />
        					<Column field='votes' header={votes} />
        				</DataTable>
        	else {
    			let columns = []
    			for (let i = 0; i< this.props.votes.length; i++) {
    				let options = { hour: 'numeric', minute: 'numeric' }
    				let header = <FormattedMessage id='app.tab.ballots.numbers' defaultMessage='hours {0}' values={{0: new Date(this.props.votes[i].affluence).toLocaleTimeString(language, options)}} />
    				columns.push(<Column key={'percent-columns-' + i} field={'votes'+i} header={header} />)
    			}
    			dataTable = <DataTable value={value} sortField='votes' sortOrder={-1}
			 				scrollable={true} scrollHeight='450px'
			 				className='candidates-table'>
								<Column field='image' body={this.candidateTemplate} style={{width:'14%'}} />
								<Column field='name' header={lists} style={{width:'50%'}} />
								{columns}
							</DataTable>
        	}
        }
    	return dataTable
	}

    render() {
    		if (this.props.party)
    			return (
    				<div className='tableContent'>
    					<div className='party-for-candidates'>
    						<img src={`data:image/jpeg;base64,${this.props.party.image}`}
            						alt={this.props.party.name} 
            						style={{ width:'66px', left:'2%', bottom:'6px', position:'relative' }} />
            					<div className='title-for-candidates'>{this.props.party.name}</div>
    					</div>
    					{this.renderDataTable()}
    				</div>
    			)
    		else return ''
    }
}

export default Candidates