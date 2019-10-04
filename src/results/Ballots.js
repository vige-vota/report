import React, { Component } from 'react'
import './Ballots.css'
import { getTitle } from '../Utilities';
import axios from 'axios'

export class Ballots extends Component {

    constructor() {
        super()
        this.state = {
        	zone: null
        }
        let voting_url = process.env.REACT_APP_HISTORY_VOTING_URL + window.location.pathname
        axios
    	.get(voting_url)
    	.then(response => {
    	    this.setState({vote: response.data})
    	})
    	.catch(function(error) {
    	    console.log(error)
    	});
    }
	
    renderDataTable() {
    	
    }
    
	render() {
        return (
            	<div className='tableContent'>
            		<div id='headEnti'>
            			<h3>{getTitle(this.state.zone)}</h3>
            		</div>
                	{this.renderDataTable()}
                </div>
            )
	}
}

export default Ballots