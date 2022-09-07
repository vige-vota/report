import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import './Results.css'
import './Referendum.css'
import { getTitle, getVotesById, getBlankPapers, getComponentById, getPercent, getUpdateDate } from '../Utilities';
import {language} from '../index'
import {ProgressSpinner} from 'primereact/progressspinner'

export class Referendum extends Component {

    renderModalHeader() {
    		return (
        		<div id='headEnti'>
        			<h2>{getTitle()}</h2>
        			<h3><FormattedMessage id='app.table.candidatesandelected' defaultMessage='Candidates and Elected' /></h3>
        		</div>
        )
    }
    
    headerTemplate = (data) => {
        return (
            <React.Fragment>
                <span className="image-text">{data.group}</span>
            </React.Fragment>
        );
    }
    
    renderDataTable() {
    	let dataTable = []
        if (this.props.app.state.votes && this.props.app.state.votingPaper) {
						
            let lists = <FormattedMessage id='app.table.referendum' defaultMessage='Referendum' />
            let votes = <FormattedMessage id='app.table.votes' defaultMessage='Votes' />
        	let vote = this.props.app.state.votes[this.props.app.state.votes.length -1]
        	let bigValues = this.props.app.state.votingPaper.groups
        	let bigValue = bigValues.map((e) => {
        		let numberVotes = getVotesById(e.id, vote)
            	let percent = getPercent(e.id, vote)
        		let jsonValue = {
        			id: e.id,
        			name: e.name,
        			votes: numberVotes,
        			percent: percent
        		}
        		for (let i = 0; i< this.props.app.state.votes.length; i++)
        			jsonValue['percent'+i] = getPercent(e.id, this.props.app.state.votes[i])
        		return jsonValue
        	})
        	
        	let key = 0
            let votings = <FormattedMessage id='app.table.votings' defaultMessage='Votings:' />
            let blankPapers = <FormattedMessage id='app.table.blankpapers' defaultMessage='Blank papers:' />
            let updateDate = <FormattedMessage id='app.table.updatedate' defaultMessage='Data updated to:' />
			let votingValues = getVotesById(this.props.app.state.votingPaper.id, vote)
			let blankPapersValues = getBlankPapers(this.props.app.state.votingPaper.id, vote)
        	let updateDateValues = getUpdateDate(vote)
			let bigFooter = ''
        	bigValue.forEach(f => {
            	let values = getComponentById(f.id, this.props.app.state.votingPaper).parties
            	let sumValue = 0
            	let sumPercent = 0
            	let value = values.map((e) => {
            	    let numberVotes = getVotesById(e.id, vote)
           	     	sumValue += numberVotes
            		let percent = getPercent(e.id, vote)
                	sumPercent += percent
        			let jsonValue = {
        				id: e.id,
        				group: f.name,
        				name: e.name,
        				votes: numberVotes,
        				percent: percent
        			}
        			for (let i = 0; i< this.props.app.state.votes.length; i++)
        				jsonValue['percent'+i] = getPercent(e.id, this.props.app.state.votes[i])
        			return jsonValue
            	})
            	let footer = ''
            	let headerStyle = {display: 'none'}
            	if (key === bigValue.length - 1)
            		bigFooter = <div>{votings} <span className='footer-value'>{votingValues}</span> &nbsp;
							  {blankPapers} <span className='footer-value'>{blankPapersValues}</span> &nbsp;
	    					  {updateDate} <span className='footer-value'>{updateDateValues}</span>
						 		</div>
				if (key === 0)
					headerStyle = ''
            	if (values.length > 1) {
        			let votings =  <FormattedMessage id='app.table.totalvotes' defaultMessage='Total votes' />
            		if (this.props.app.state.activeTabVote.id === 0)
            			footer = <ColumnGroup>
            						<Row>
            							<Column footer={votings} />
            							<Column footer={sumValue} />
            							<Column footer={sumPercent} />
            						</Row>
            				 </ColumnGroup>
            		else {
        				let columns = []
        				for (let i = 0; i< this.props.app.state.votes.length; i++)
        					columns.push(<Column key={'percent-columns-' + i} footer={getVotesById(f.id, vote)} />)
            			footer = <ColumnGroup>
									<Row>
										<Column footer={votings} />
										{columns}
									</Row>
							 </ColumnGroup>
            		}
            	}
            	if (this.props.app.state.activeTabVote.id === 0)
            		dataTable.push(<DataTable key={'referendum-table'+ key++} value={value} sortField='votes' sortOrder={-1} 
            			 footerColumnGroup={footer} className='referendum-table'
            			 rowGroupMode="subheader" groupRowsBy="group" rowGroupHeaderTemplate={this.headerTemplate}
			 			 footer={bigFooter}>
        					<Column field='name' style={{width:'63%'}} header={lists} headerStyle={headerStyle} />
        					<Column field='votes' header={votes} headerStyle={headerStyle} />
        					<Column field='percent' header='%' style={{width:'7%'}} headerStyle={headerStyle} />
        				</DataTable>)
            	else {
    				let columns = []
    				for (let i = 0; i< this.props.app.state.votes.length; i++) {
    					let options = { hour: 'numeric', minute: 'numeric' }
    					let header = <FormattedMessage id='app.tab.ballots.hours' defaultMessage='% hours {0}' values={{0: new Date(this.props.app.state.votes[i].affluence).toLocaleTimeString(language, options)}} />
    					columns.push(<Column key={'percent-columns-' + i} field={'percent'+i} header={header} style={{width:'10%'}} />)
    				}
            		dataTable.push(<DataTable key={'referendum-table'+ key++} value={value} sortField='votes' sortOrder={-1}
			 			 footerColumnGroup={footer} className='referendum-table'
            			 rowGroupMode="subheader" groupRowsBy="group" rowGroupHeaderTemplate={this.headerTemplate}
			 			 footer={bigFooter}>
							<Column field='name' style={{width: '50%' }} />
							{columns}
						</DataTable>)
            	}
        	})
        }
        return dataTable
    }

    render() {
    	let progressSpinner = ''
    	if (!this.props.app.state.votes)
    		progressSpinner = <ProgressSpinner/>
        return (
        	<div className='tableContent'>
        		{progressSpinner}
        		<div id='headEnti'>
        			<h3>{getTitle()}</h3>
        		</div>
            	{this.renderDataTable()}
            </div>
        )
    }
}

export default Referendum