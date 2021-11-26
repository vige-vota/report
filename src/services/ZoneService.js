import axios from 'axios';

export class ZoneService {

    getTreeZones(votingPapers) {
    	let url = process.env.REACT_APP_CITIES_GENERATOR_URL + votingPapers + '?all'
        return axios.get(url)
    }
    
    convert(zones, votingPapers) {
    	let convertedZones =  zones.map((e) => {
    		return {
    					key: e.id,
    					data: e.id,
    					label: e.name,
    					icon: 'pi pi-fw pi-cog',
    					selectable: votingPapers.filter((f) => f.zone === e.id).length > 0,
    					children: this.convert(e.zones, votingPapers)
    				}
    	})
    	return convertedZones 
    }
    
    zonesFrom(votingPapers) {
    	let zones = votingPapers.filter((e) => e.zone).map((f) => f.zone).sort().join()
    	return zones
    }
}