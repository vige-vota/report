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
import { getTabs, getVotingPaperById } from './Utilities';
import 'primereact/resources/themes/nova/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import logo from './images/logo.ico'
import {history, language} from './index'

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
        }
        config.votingPapers.map((votingPaper) => 
        		this.state.items.push({ id: votingPaper.id, label: votingPaper.name })
        )
 	   this.voteMap = React.createRef();
 	   this.results = React.createRef();
    }

    componentDidMount() {
		const tabs = getTabs(this, '.vote-tabmenu')
		if (tabs && tabs[0]) {
			tabs[0].click()
		}
    }

    render() {
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
    	if (!history)
    		boxLive = <div className='box-live'>
                     		<div className='img-responsive inmlive' />
                      </div>
		return (
            <div className='html navbar-is-fixed-top cbp-spmenu-push excludeIE10 enhanced'>
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
                		this.voteMap.current.reset()
                		if (this.results.current)
                			this.results.current.reset()
                		}
                	} />
                	
                    <div className='my-content p-grid'>
                        <div className='p-col-fixed' style={{ width: '100%', paddingRight: '40px' }}>
                        	<VoteMap ref={this.voteMap} votingPaper={this.state.votingPaper} app={this} />
                        </div>
                        <div className='p-col'>
                            {results}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App