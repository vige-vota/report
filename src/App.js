import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import './App.css'
import { TabMenu } from 'primereact/tabmenu'
import 'primeflex/primeflex.css'
import VoteMap from './map/VoteMap';
import Results from './Results';
import 'primereact/resources/themes/nova-light/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

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
            <div className='html navbar-is-fixed-top cbp-spmenu-push excludeIE10 enhanced'>
                <div className='content-section implementation'>
                	<div className='second-row'>
        				<div className='container container-live'>
                     		<div className='box-live'>
                     			<div className='img-responsive inmlive'> </div>
                     		</div>
                     		<div className='box-title'>
                     			<FormattedMessage
                     				id='app.title'
                     				defaultMessage='Affluence and Results'>
                     					{(title) => <p><strong>{title}</strong></p>}
                     			</FormattedMessage>
                     		</div>
                     	</div>
                    </div>
                	<TabMenu ref='tabMenu' className={this.state.visible ? '' : 'disabled'}  model={this.state.items} activeItem={this.state.activeItem} onTabChange={(e) => {
                		if (this.state.visible) 
                			this.setState({ activeItem: e.value })
                		}
                	} />
                
                    <div className='my-content p-grid'>
                        <div className='p-col-fixed' style={{ width: '360px', paddingRight: '40px' }}>
                        	<VoteMap />
                        </div>
                        <div className='p-col'>
                            <Results />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App