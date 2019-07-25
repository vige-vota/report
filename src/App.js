import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import './App.css'
import { TabMenu } from 'primereact/tabmenu'

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
                	<TabMenu ref='tabMenu' className={this.state.visible ? 'container' : 'disabled'}  model={this.state.items} activeItem={this.state.activeItem} onTabChange={(e) => {
                		if (this.state.visible) 
                			this.setState({ activeItem: e.value })
                		}
                	} />
                </div>
            </div>
        )
    }
}

export default App