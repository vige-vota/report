import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import './App.css'
import { TabMenu } from 'primereact/tabmenu'
import 'primeflex/primeflex.css'
import VoteMap from './map/VoteMap';
import Littlenogroup from './results/Littlenogroup';
import Biggerpartygroup from './results/Biggerpartygroup';
import Bigger from './results/Bigger';
import Little from './results/Little';
import Referendum from './results/Referendum';
import { getTabs, getVotingPaperById } from './Utilities';
import 'primereact/resources/themes/nova/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import logo from './images/logo.ico'
import {history, language} from './index'
import axios from 'axios'
import SockJsClient from './SockJsClient'

export var config

class App extends Component {

    constructor(data) {
        super(data)
        config = data.config
        let activeItem = {}
        if (config.votingPapers && config.votingPapers[0])
        	activeItem = { id: config.votingPapers[0].id, label: config.votingPapers[0].name }
        this.state = {
            items: [
                ],
            activeItem: activeItem,
            activeItemIndex: 0,
            zone: null,
            activeTabVote: { id: 0, label: <FormattedMessage id='app.tab.ballots' defaultMessage='BALLOTS' /> },
            activeTabVoteIndex: 0
        }
        let voting_url = process.env.REACT_APP_VOTING_URL
        if (history) {
        	voting_url = process.env.REACT_APP_HISTORY_VOTING_URL + '/' + history
        }
        axios
    	.get(voting_url)
    	.then(response => {
    	    this.setState({
    	    		votes: response.data.votings
    	    	})
    	})
    	.catch(function(error) {
    	    console.log(error)
    	})
 	   	this.voteMap = React.createRef();
 	   	this.results = React.createRef();
    }

    componentDidMount() {
        let i = 0
        let iR = 0
        if (config.votingPapers.length > 1)
        	config.votingPapers.sort(function(a, b) {
  				let nameA = a.type.toUpperCase();
  				let nameB = b.type.toUpperCase();
  				if (nameA < nameB) {
    				return -1;
  				}
  				if (nameA > nameB) {
    				return 1;
  				}

  				return 0;
			})
        config.votingPapers.map((votingPaper) => {
        	if (votingPaper.type !== 'bigger' && votingPaper.type !== 'bigger-partygroup') {
				if (votingPaper.type !== 'referendum')
        			this.state.items.push({ id: votingPaper.id, label: votingPaper.name })
        		else if (iR === 0) {
        			this.state.items.push({ id: votingPaper.id, label: <FormattedMessage id='app.table.referendum' defaultMessage='Referendum' /> })
        			iR++;
				}
        	} else if (i === 0) {
        		this.state.items.push({ id: votingPaper.id, label: votingPaper.name })
        		i++;
        	}
        	return votingPaper
        })
 	   
 	   this.setState({
 	   		votingPaper: config.votingPapers[0]
 	   })
	   const tabs = getTabs(this, '.vote-tabmenu')
	   if (tabs && tabs[0]) {
			tabs[0].click()
	   }
    }

    render() {
    	let realTimeVotingPapers = ''
    	let realTimeVotes = ''
    	if (!history) {
    		realTimeVotingPapers = <SockJsClient url={process.env.REACT_APP_VOTING_PAPERS_REALTIME_URL} topics={['/topic/votingpaper']}
    									onMessage={(msg) => {
        	            					this.setState({
        	            						votingPaper: msg.votingPapers.filter(((e) => e.id === this.state.votingPaper.id))[0]
        	            					})
    							   }} />
        	realTimeVotes = <SockJsClient url={process.env.REACT_APP_VOTING_REALTIME_URL} topics={['/topic/vote']}
        	            		onMessage={(msg) => { 
        	            			this.setState({
        	            				votes: msg.votings
        	            			})
        	            	}} />
    	}
    	if (this.state.zone && (this.state.votingPaper.type === 'bigger-partygroup' || this.state.votingPaper.type === 'bigger')) {
			let changedItem = this.state.items[0]
			changedItem.id = this.state.votingPaper.id
			changedItem.label = this.state.votingPaper.name
		}
    	let results = ''
        if (this.state.votingPaper) {
        	if (this.state.votingPaper.type === 'bigger-partygroup')
        		results = <Biggerpartygroup ref={this.results} votingPaper={this.state.votingPaper} app={this} />
        	else if (this.state.votingPaper.type === 'little')
        		results = <Little ref={this.results} votingPaper={this.state.votingPaper} app={this} />
        	else if (this.state.votingPaper.type === 'bigger')
        		results = <Bigger ref={this.results} votingPaper={this.state.votingPaper} app={this} />
        	else if (this.state.votingPaper.type === 'little-nogroup')
        		results = <Littlenogroup ref={this.results} votingPaper={this.state.votingPaper} app={this} />
        	else if (this.state.votingPaper.type === 'referendum')
        		results = <Referendum ref={this.results} votingPaper={this.state.votingPaper} app={this} />
        }
    	let subtitle = ''
    	if (history) {
    		let options = { year: 'numeric', month: 'long', day: 'numeric' }
    		subtitle = <FormattedMessage
							id='app.subtitle'
							values = {{0: new Date(history).toLocaleDateString(language, options)}}
							defaultMessage=' for {0}' />
    	}
    	let boxLive = ''
    	if (!history) {
    		const imlive = './icona_live.png';
    		boxLive = <div className='box-live img-responsive inmlive'>
    						<img alt='Online' src={imlive} />
                      </div>
        }
		return (
            <div className='html navbar-is-fixed-top cbp-spmenu-push excludeIE10 enhanced'>
            	{realTimeVotingPapers}
            	{realTimeVotes}
            	<div className='content-section implementation'>
                	<div className='second-row'>
        				<div className='container container-live'>
                     		{boxLive}
                     		<div className='box-title'>
                     			<FormattedMessage
                     				id='app.title'
                     				defaultMessage='Affluence and Results'>
                     					{(title) => <p><strong>{title}{subtitle}</strong></p>}
                     			</FormattedMessage>
                     		</div>
                     		<div className='powered'>
                     			<img alt='logo' className='logo' src={logo} />
             					<FormattedMessage
             					id='app.powered'
             						defaultMessage='Powered by'>
         							{(title) => <span><p>{title}&nbsp;</p><a href='http://www.vige.it'>Vige</a></span>}
         							</FormattedMessage>
         					</div>
                     	</div>
                    </div>
                	<TabMenu ref='tabMenu' className='vote-tabmenu' model={this.state.items} activeIndex={this.state.activeItemIndex} onTabChange={(e) => {
                		this.setState({ activeItem: e.value,
                					votingPaper: getVotingPaperById(e.value),
                						activeItemIndex: e.index })
                		}
                	} />
                	
                    <div className='my-content grid'>
                        <div className='col-fixed' style={{ width: '100%', paddingRight: '40px' }}>
                        	<VoteMap ref={this.voteMap} votingPaper={this.state.votingPaper} app={this} />
                        </div>
                        <div className='col'>
                            {results}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App