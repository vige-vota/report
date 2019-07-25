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
                    <div className="container">
                    	<div className="pillsContainer">
                    		<ul className="navbar-nav">
                    			<li className=""> <a href="/europee/votanti/20190526/votantiEI">EUROPEE</a></li>
                    			<li className=" active "> <a href="/regionali/votanti/20190526/votantiRI01000">REGIONALI</a></li>
                    			<li className=""> <a href="/comunali/votanti/20190526/votantiGI">COMUNALI</a></li>
                    		</ul>
                    	</div>  
                    </div>

                    <div className="container">
                    	<TabMenu ref='tabMenu' className={this.state.visible ? 'pillsContainer' : 'disabled'}  model={this.state.items} activeItem={this.state.activeItem} onTabChange={(e) => {
                    		if (this.state.visible) 
                    			this.setState({ activeItem: e.value })
                    		}
                    	} />
                    </div>
                </div>
            </div>
        )
    }
}

export default App