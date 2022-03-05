import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Button } from 'primereact/button'
import { Row } from 'primereact/row'
import { Candidates } from './Candidates'
import {Dialog} from 'primereact/dialog';
import './Results.css'
import './Biggerpartygroup.css'
import { getTitle, getVotesById, getBlankPapers, getComponentById, getPercent, getUpdateDate } from '../Utilities';
import {language} from '../index'
import {ProgressSpinner} from 'primereact/progressspinner'

export class Biggerpartygroup extends Component {

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
        			<h2>{getTitle(this.props.app.state.zone)}</h2>
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
            let sumPercentBallots = []
            let value = values.map((e) => {
                let numberVotes = getVotesById(e.id, vote)
                sumValue += numberVotes
            	let percent = getPercent(e.id, vote)
                sumPercent += percent
        		let jsonValue = {
        			id: e.id,
        			name: e.name,
        			image: e.image,
        			votes: numberVotes,
        			percent: percent
        		}
        		for (let i = 0; i< this.props.app.state.votes.length; i++) {
        			jsonValue['percent'+i] = getPercent(e.id, this.props.app.state.votes[i])
        			sumPercentBallots += jsonValue['percent'+i]
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
        				columns.push(<Column key={'percent-columns-' + i} footer={sumPercentBallots[i]} />)
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
            			 footerColumnGroup={footer} className='biggernogroup-sub-header'>
            				<Column />
            				<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
        					<Column field='name' style={{width: '70%' }} body={this.candidatesTemplate} />
        					<Column field='votes' />
        					<Column field='percent' style={{width:'8%'}} />
        				</DataTable>
            else {
        			let columns = []
        			let namePercent = 0
        			for (let i = 0; i< this.props.app.state.votes.length; i++)
        				columns.push(<Column key={'percent-columns-' + i} field={'percent'+i} style={{width:'10%'}} />)
            		namePercent = 80 - this.props.app.state.votes.length * 10
        			dataTable = <DataTable value={value} sortField='votes' sortOrder={-1}
			 			footerColumnGroup={footer} className='biggernogroup-sub-header'>
							<Column style={{width:'6%'}} />
							<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
							<Column field='name' body={this.candidatesTemplate} style={{width: namePercent + '%'}} />
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
								  alt={rowData.name} style={{ width:'25px' }} /> : '')
        return <div>{rowData.name} 
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
            	let percent = getPercent(e.id, vote)
        		let jsonValue = {
        			id: e.id,
        			name: e.name,
        			image: e.image,
        			votes: numberVotes,
        			percent: percent
        		}
        		for (let i = 0; i< this.props.app.state.votes.length; i++)
        			jsonValue['percent'+i] = getPercent(e.id, this.props.app.state.votes[i])
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
            let lists = <FormattedMessage id='app.table.candidatesandlists' defaultMessage='Candidates and Lists' />
            let votes = <FormattedMessage id='app.table.votes' defaultMessage='Votes' />
            if (this.props.app.state.activeTabVote.id === 0)
            	dataTable = <DataTable value={value} sortField='votes' sortOrder={-1} 
        				 scrollable={true} scrollHeight='450px' footer={footer}
        				 expandedRows={this.state.expandedRows} 
        				 onRowToggle={(e) => this.setState({expandedRows:e.data})}
        				 rowExpansionTemplate={this.rowExpansionTemplate}
            			 className='biggernogroup-table'>
            				<Column field='id' expander/>
        					<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
        					<Column field='name' header={lists} body={this.listsTemplate} className='padding-name' style={{width: '70%' }} />
        					<Column field='votes' header={votes} />
        					<Column field='percent' header='%' style={{width:'8%'}} />
        				</DataTable>
        	else {
    			let columns = []
    			let namePercent = 0
    			for (let i = 0; i< this.props.app.state.votes.length; i++) {
    				let options = { hour: 'numeric', minute: 'numeric' }
					let header = <FormattedMessage id='app.tab.ballots.hours' defaultMessage='% hours {0}' values={{0: new Date(this.props.app.state.votes[i].affluence).toLocaleTimeString(language, options)}} />
    				columns.push(<Column key={'percent-columns-' + i} field={'percent'+i} header={header} style={{width:'10%'}} />)
        		}
    			namePercent = 80 - this.props.app.state.votes.length * 10
    			dataTable = <DataTable value={value} sortField='votes' sortOrder={-1}
            			scrollable={true} scrollHeight='450px' footer={footer}
			 			expandedRows={this.state.expandedRows} 
			 			onRowToggle={(e) => this.setState({expandedRows:e.data})}
			 			rowExpansionTemplate={this.rowExpansionTemplate}
			 			className='biggernogroup-table'>
							<Column field='id' expander style={{width:'6%'}} />
							<Column field='image' body={this.partyTemplate} style={{width:'10%'}} />
							<Column field='name' header={lists} className='padding-name' style={{width: namePercent + '%' }} />
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
        			<h3>{getTitle(this.props.app.state.zone)}</h3>
        		</div>
            	{this.renderDataTable()}
            	<Dialog visible={this.state.showCandidates} 
        			modal={true} onHide={() => this.setState({showCandidates: false})}
        			style={{width: '50vw'}} header={this.renderModalHeader()}>
        			<Candidates zone={this.props.app.state.zone} party={this.state.selectedParty} 
        				votes={this.props.app.state.votes} app={this.props.app} />
        		</Dialog>
            </div>
        )
    }
}

export default Biggerpartygroup