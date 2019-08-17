import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './Candidates.css'
import { getVotesById, getBlankPapers, getPercent, getComponentById } from '../Utilities';

export class Candidates extends Component {
	
	renderDataTable() {
    	let dataTable = ''
        if (this.props.party) {
        	console.log(this.props.party)
        	let componentParty = getComponentById(this.props.party)
        	console.log(componentParty)
        	let values = this.props.app.state.votingPaper.groups
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
            let votings = <FormattedMessage id='app.table.votings' defaultMessage='Votings:' />
            let blankPapers = <FormattedMessage id='app.table.blankpapers' defaultMessage='Blank papers:' />
			let votingValues = getVotesById(this.props.app.state.votingPaper.id, this.state.vote)
			let blankPapersValues = getBlankPapers(this.props.app.state.votingPaper.id, this.state.vote)
			let footer = <div>{votings} <span className='footer-value'>{votingValues}</span> &nbsp;
							  {blankPapers} <span className='footer-value'>{blankPapersValues}</span>
						 </div>
            let lists = <FormattedMessage id='app.table.candidatesandlists' defaultMessage='Candidates and Lists' />
            let votes = <FormattedMessage id='app.table.votes' defaultMessage='Votes' />
            dataTable = <DataTable value={value} sortField='votes' sortOrder={-1} 
        				 scrollable={true} scrollHeight='450px' footer={footer}
        				 expandedRows={this.state.expandedRows} 
        				 onRowToggle={(e) => this.setState({expandedRows:e.data})}
        				 rowExpansionTemplate={this.rowExpansionTemplate}
            			 className='candidates-table'>
            				<Column field='id' expander/>
        					<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
        					<Column field='name' header={lists} body={this.listsTemplate} style={{width: '70%' }} />
        					<Column field='votes' header={votes} />
        					<Column field='percent' header='%' style={{width:'8%'}} />
        				</DataTable>
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
            						style={{ width:'66px', left:'10%', top:'2px', position:'relative' }} />
            					<div className='title-for-candidates'>{this.props.party.name}</div>
    					</div>
    				</div>
    			)
    		else return ''
    }
}

export default Candidates