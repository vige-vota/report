import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './Results.css'
import './Referendum.css'
import { getTitle, getVotesById, getBlankPapers, getComponentById, getPercent, getUpdateDate } from '../Utilities';
import { language } from '../index'
import { ProgressSpinner } from 'primereact/progressspinner'
import { config } from '../App'

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
		let dataTableList = []
		let votes = <FormattedMessage id='app.table.votes' defaultMessage='Votes' />
		let votings = <FormattedMessage id='app.table.votings' defaultMessage='Votings:' />
		let blankPapers = <FormattedMessage id='app.table.blankpapers' defaultMessage='Blank papers:' />
		let updateDate = <FormattedMessage id='app.table.updatedate' defaultMessage='Data updated to:' />
		let currentVotes = this.props.app.state.votes
		if (currentVotes)
			config.votingPapers.forEach((e) => {
				if (e.type === 'referendum') {
					let lists = e.name
					let dataTable = []
					dataTableList.push(dataTable)
					let currentVotingPaper = e
					let vote = currentVotes[currentVotes.length - 1]
					let bigValues = currentVotingPaper.groups
					let bigValue = bigValues.map((e) => {
						let numberVotes = getVotesById(e.id, vote)
						let percent = getPercent(e.id, vote)
						let jsonValue = {
							id: e.id,
							name: e.name,
							votes: numberVotes,
							percent: percent
						}
						for (let i = 0; i < currentVotes.length; i++)
							jsonValue['percent' + i] = getPercent(e.id, currentVotes[i])
						return jsonValue
					})

					let key = 0
					let votingValues = getVotesById(currentVotingPaper.id, vote)
					let blankPapersValues = getBlankPapers(currentVotingPaper.id, vote)
					let updateDateValues = getUpdateDate(vote)
					let bigFooter = ''
					bigValue.forEach(f => {
						let values = getComponentById(f.id, currentVotingPaper).parties
						let sumValue = 0
						let value = values.map((e) => {
							let numberVotes = getVotesById(e.id, vote)
							sumValue += numberVotes
							let jsonValue = {
								id: e.id,
								group: f.name,
								name: e.name,
								votes: numberVotes
							}
							return jsonValue
						})
						value.forEach((e) => {
							let percent = e.votes === 0 ? 0 : e.votes / sumValue * 100
							let percentStr = percent.toFixed(2)
							e.percent = percentStr
							for (let i = 0; i < currentVotes.length; i++)
								e['percent' + i] = getPercent(e.id, currentVotes[i])
						})
						let headerStyle = { display: 'none' }
						if (key === bigValue.length - 1)
							bigFooter = <div>{votings} <span className='footer-value'>{votingValues}</span> &nbsp;
								{blankPapers} <span className='footer-value'>{blankPapersValues}</span> &nbsp;
								{updateDate} <span className='footer-value'>{updateDateValues}</span>
							</div>
						if (key === 0)
							headerStyle = ''
						if (this.props.app.state.activeTabVote.id === 0)
							dataTable.push(<DataTable key={'referendum-table' + key++} value={value} sortField='votes' sortOrder={-1}
								className='referendum-table'
								rowGroupMode="subheader" groupRowsBy="group" rowGroupHeaderTemplate={this.headerTemplate}
								footer={bigFooter}>
								<Column field='name' style={{ width: '63%' }} header={lists} headerStyle={headerStyle} />
								<Column field='votes' header={votes} headerStyle={headerStyle} />
								<Column field='percent' header='%' style={{ width: '7%' }} headerStyle={headerStyle} />
							</DataTable>)
						else {
							let columns = []
							for (let i = 0; i < currentVotes.length; i++) {
								let options = { hour: 'numeric', minute: 'numeric' }
								let header = <FormattedMessage id='app.tab.ballots.hours' defaultMessage='% hours {0}' values={{ 0: new Date(currentVotes[i].affluence).toLocaleTimeString(language, options) }} />
								columns.push(<Column key={'percent-columns-' + i} field={'percent' + i} header={header} style={{ width: '10%' }} />)
							}
							dataTable.push(<DataTable key={'referendum-table' + key++} value={value} sortField='votes' sortOrder={-1}
								className='referendum-table'
								rowGroupMode="subheader" groupRowsBy="group" rowGroupHeaderTemplate={this.headerTemplate}
								footer={bigFooter}>
								<Column field='name' style={{ width: '50%' }} />
								{columns}
							</DataTable>)
						}
					})
				}
			})
		return dataTableList
	}

	render() {
		let progressSpinner = ''
		if (!this.props.app.state.votes)
			progressSpinner = <ProgressSpinner />
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