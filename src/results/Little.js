import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Button } from 'primereact/button'
import { Candidates } from './Candidates'
import {Dialog} from 'primereact/dialog';
import { Row } from 'primereact/row'
import './Results.css'
import './Little.css'
import { getTitle, getVotesById, getBlankPapers, getComponentById, getPercent, getUpdateDate } from '../Utilities';
import {language} from '../index'
import {ProgressSpinner} from 'primereact/progressspinner'

export class Little extends Component {

    constructor() {
        super()
        this.state = {
            expandedRows: null,
            showCandidates: null,
            selectedParty: null
        }
        this.partyTemplate = this.partyTemplate.bind(this);
        this.listsTemplate = this.listsTemplate.bind(this);
        this.rowExpansionTemplate = this.rowExpansionTemplate.bind(this);
        this.candidatesTemplate = this.candidatesTemplate.bind(this);
    }

    renderModalHeader() {
    		return (
        		<div id='headEnti'>
        			<h2>{getTitle()}</h2>
        			<h3><FormattedMessage id='app.table.candidatesandelected' defaultMessage='Candidates and Elected' /></h3>
        		</div>
        )
    }
    
    candidatesTemplate(data) {
    	let component = getComponentById(data.id, this.props.app.state.votingPaper)
    	if (component.candidates)
    		return <Button label={data.name} className='candidates-button' 
    			onClick={() => this.setState({showCandidates: true, selectedParty: component})} />
    		else return data.name
    }
    
    rowExpansionTemplate(data) {
    	let dataTable = ''
        if (this.props.app.state.votes && this.props.app.state.votingPaper) {
        	let vote = this.props.app.state.votes[this.props.app.state.votes.length -1]
            let values = getComponentById(data.id, this.props.app.state.votingPaper).parties
            let sumValue = 0
            let sumPercent = 0
            let value = values.map((e) => {
                let numberVotes = getVotesById(e.id, vote)
                sumValue += numberVotes
            	let percent = getPercent(e, vote)
                sumPercent += percent
        		let jsonValue = {
        			id: e.id,
        			name: e.name,
        			image: e.image,
        			votes: numberVotes,
        			percent: percent
        		}
        		for (let i = 0; i< this.props.app.state.votes.length; i++) {
        			jsonValue['percent'+i] = getPercent(e, this.props.app.state.votes[i])
        		}
        		return jsonValue
            })
            let footer = ''
            if (values.length > 1) {
        		let votings =  <FormattedMessage id='app.table.totallists' defaultMessage='Total lists' />
            	if (this.props.app.state.activeTabVote.id === 0)
            		footer = <ColumnGroup>
            						<Row>
            							<Column />
            							<Column />
            							<Column footer={votings} />
            							<Column footer={sumValue} />
            							<Column footer={sumPercent} />
            						</Row>
            				 </ColumnGroup>
            	else {
        			let columns = []
        			for (let i = 0; i< this.props.app.state.votes.length; i++)
        				columns.push(<Column key={'percent-columns-' + i} footer={getVotesById(data.id, vote)} />)
            		footer = <ColumnGroup>
									<Row>
										<Column />
										<Column />
										<Column footer={votings} />
										{columns}
									</Row>
							 </ColumnGroup>
            	}
            }
            if (this.props.app.state.activeTabVote.id === 0)
            	dataTable = <DataTable value={value} sortField='votes' sortOrder={-1} 
            			 footerColumnGroup={footer} className='little-sub-header'>
            				<Column style={{width: '4%' }} />
            				<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
        					<Column field='name' style={{width: '70%' }} body={this.candidatesTemplate} />
        					<Column field='votes' />
        					<Column field='percent' style={{width:'8%'}} />
        				</DataTable>
            else {
    			let columns = []
    			for (let i = 0; i< this.props.app.state.votes.length; i++)
    				columns.push(<Column key={'percent-columns-' + i} field={'percent'+i} style={{width:'10%'}} />)
            	dataTable = <DataTable value={value} sortField='votes' sortOrder={-1}
			 			 footerColumnGroup={footer} className='little-sub-header'>
							<Column style={{width:'6%'}} />
							<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
							<Column field='name' style={{width: '50%' }} body={this.candidatesTemplate} />
							{columns}
						</DataTable>
            }
        }
        return dataTable
    }

    partyTemplate(rowData) {
    	if (rowData.image)
    		return <img src={`data:image/jpeg;base64,${rowData.image}`} 
        				alt={rowData.name} 
        				style={{ width:'20%', left:'10%', top:'2px', position:'relative' }} />
    	else return ''
    }

    listsTemplate(rowData) {
    	let images = ''
    	let component = getComponentById(rowData.id, this.props.app.state.votingPaper)
    	images = component.parties.map(e => e.image ? <img key={e.id} src={`data:image/jpeg;base64,${e.image}`} 
								  alt={rowData.name} style={{ width:'15px' }} /> : '')
        return <div>
        		  <div className='border-images'>
        			 <span className='party-images'>{images}</span>
        		  </div>
        	   </div>
    }
	
	renderDataTable() {
    	let dataTable = ''
        if (this.props.app.state.votes && this.props.app.state.votingPaper) {
        	let vote = this.props.app.state.votes[this.props.app.state.votes.length -1]
        	let values = this.props.app.state.votingPaper.groups
        	let value = values.map((e) => {
        		let numberVotes = getVotesById(e.id, vote)
            	let percent = getPercent(e, vote)
        		let jsonValue = {
        			id: e.id,
        			name: e.name,
        			image: e.image,
        			votes: numberVotes,
        			percent: percent
        		}
        		for (let i = 0; i< this.props.app.state.votes.length; i++)
        			jsonValue['percent'+i] = getPercent(e, this.props.app.state.votes[i])
        		return jsonValue
        	})
            let votings = <FormattedMessage id='app.table.votings' defaultMessage='Votings:' />
            let blankPapers = <FormattedMessage id='app.table.blankpapers' defaultMessage='Blank papers:' />
			let votingValues = getVotesById(this.props.app.state.votingPaper.id, vote)
			let blankPapersValues = getBlankPapers(this.props.app.state.votingPaper.id, vote)
            let updateDate = <FormattedMessage id='app.table.updatedate' defaultMessage='Data updated to:' />
        	let updateDateValues = getUpdateDate(vote)
			let footer = <div>{votings} <span className='footer-value'>{votingValues}</span> &nbsp;
							  {blankPapers} <span className='footer-value'>{blankPapersValues}</span> &nbsp;
	    					  {updateDate} <span className='footer-value'>{updateDateValues}</span>
						 </div>
            let premiers = <FormattedMessage id='app.table.premiers' defaultMessage='Premiers' />
            let lists = <FormattedMessage id='app.table.lists' defaultMessage='Lists' />
            let votes = <FormattedMessage id='app.table.votes' defaultMessage='Votes' />
            if (this.props.app.state.activeTabVote.id === 0)
            	dataTable = <DataTable value={value} sortField='votes' sortOrder={-1} 
        				 scrollable={true} scrollHeight='450px' footer={footer}
        				 expandedRows={this.state.expandedRows} 
        				 onRowToggle={(e) => this.setState({expandedRows:e.data})}
        				 rowExpansionTemplate={this.rowExpansionTemplate}
            			 className='little-table'>
            				<Column field='id' expander/>
        					<Column header={lists} body={this.listsTemplate} style={{width:'10%'}} />
        					<Column field='name' header={premiers} style={{width: '70%' }} />
        					<Column field='votes' header={votes} />
        					<Column field='percent' header='%' style={{width:'8%'}} />
        				</DataTable>
        	else {
    			let columns = []
    			for (let i = 0; i< this.props.app.state.votes.length; i++) {
    				let options = { hour: 'numeric', minute: 'numeric' }
    				let header = <FormattedMessage id='app.tab.ballots.hours' defaultMessage='% hours {0}' values={{0: new Date(this.props.app.state.votes[i].affluence).toLocaleTimeString(language, options)}} />
    				columns.push(<Column key={'percent-columns-' + i} field={'percent'+i} header={header} style={{width:'10%'}} />)
    			}
    			dataTable = <DataTable value={value} sortField='votes' sortOrder={-1}
			 			scrollable={true} scrollHeight='450px' footer={footer}
			 			expandedRows={this.state.expandedRows} 
			 			onRowToggle={(e) => this.setState({expandedRows:e.data})}
			 			rowExpansionTemplate={this.rowExpansionTemplate}
			 			className='little-table'>
							<Column field='id' expander style={{width:'6%'}} />
							<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
							<Column field='name' header={lists} style={{width: '50%' }} />
							{columns}
						</DataTable>
        	}
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
            	<Dialog visible={this.state.showCandidates} 
        			modal={true} onHide={() => this.setState({showCandidates: false})}
        			style={{width: '50vw'}} header={this.renderModalHeader()}>
        			<Candidates party={this.state.selectedParty} 
        				votes={this.props.app.state.votes} app={this.props.app} />
        		</Dialog>
            </div>
        )
    }
}

export default Little