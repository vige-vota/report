import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import './App.css'
import { TabMenu } from 'primereact/tabmenu'
import {getVotingPaperById} from './Utilities'

export var config

class App extends Component {

    constructor(data) {
        super(data)
        config = data.config
        this.state = {
            items: [
                ],
            activeItem: { id: config.votingPapers[0].id, label: config.votingPapers[0].name },
            visible: true
        }
        config.votingPapers.map((votingPaper) => 
        		this.state.items.push({ id: votingPaper.id, label: votingPaper.name })
        )
    }

    render() {
        return (
            <div className='App'>
                <div className='content-section implementation'>
                	<div className="second-row">
        				<div className="container container-live">
                     		<div className="box-live">
                     			<div className="img-responsive inmlive"> </div>
                     		</div>
                     		<div className="box-title">
                     			<FormattedMessage
                     				id='app.title'
                     				defaultMessage='Affluence and Results'>
                     					{(title) => <p><strong>{title}</strong></p>}
                     			</FormattedMessage>
                     		</div>
                     	</div>
                    </div>
                    <div className="container">
                    	<TabMenu ref='tabMenu' className={this.state.visible ? '' : 'disabled'}  model={this.state.items} activeItem={this.state.activeItem} onTabChange={(e) => {
                    		if (config.admin && e.originalEvent.target.className.startsWith('pi')) {
                    			let currentVotingPaper = getVotingPaperById(e.value)
                    			this.refs.modalVotingPaper.setState({
                    				votingPaper: e,
                    				app: this,
                    				operation: 'update',
                    				disjointed: currentVotingPaper.disjointed,
                    				maxCandidates: currentVotingPaper.maxCandidates,
                    				color: currentVotingPaper.color,
                    				cssStyle: currentVotingPaper.cssStyle
                    			})
                    			this.refs.modalVotingPaper.open()
                    		} else if (this.state.visible) {
                    			if (e.value.label === this.state.confirmButtonLabel)
                    				this.refs.confirm.open()
                    				else {
                    					if (e.value.label === '+') {
                    						this.refs.modalVotingPaper.setState({
                    							votingPaper: '',
                    							app: this,
                    							operation: 'insert',
                    							disjointed: false,
                    							maxCandidates: 0,
                    							color: '1976D2',
                    							cssStyle: 'bigger'
                    						})
                    						this.refs.modalVotingPaper.open()
                    					} else 
                    						this.setState({ activeItem: e.value })
                    				}
                    		}
                    	}
                    	} />
                    </div>
                </div>
            </div>
        )
    }
}

export default App