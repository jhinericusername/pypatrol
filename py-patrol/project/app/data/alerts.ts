import { Alert } from '../types';
import { species } from './species';

// Miami area coordinates
const MIAMI_BOUNDS = {
  north: 25.9918,  // North Miami Beach
  south: 25.5916,  // Homestead
  east: -80.1324,  // Miami Beach
  west: -80.8779,  // Everglades
};

// Key locations in Miami for specific species
const KEY_LOCATIONS = {
  'Burmese Python': [
    { name: 'Everglades National Park - Shark Valley', lat: 25.7617, lng: -80.7650 },
    { name: 'Big Cypress National Preserve - Loop Road', lat: 25.8989, lng: -80.8779 },
    { name: 'Everglades Safari Park Area', lat: 25.7623, lng: -80.7045 },
    { name: 'Tamiami Trail West', lat: 25.7580, lng: -80.8234 },
  ],
  'Feral Hogs': [
    { name: 'Homestead Agricultural Area - SW 344th St', lat: 25.5916, lng: -80.5550 },
    { name: 'Kendall-West Agricultural District', lat: 25.7087, lng: -80.5570 },
    { name: 'South Dade Wetlands', lat: 25.5234, lng: -80.5123 },
    { name: 'Florida City Agricultural Zone', lat: 25.4467, lng: -80.4789 },
  ],
  'Cane Toads': [
    { name: 'Miami Springs - Circle Area', lat: 25.8575, lng: -80.2781 },
    { name: 'Coral Gables - Granada Golf Course', lat: 25.7215, lng: -80.2684 },
    { name: 'Pinecrest Gardens', lat: 25.6667, lng: -80.3001 },
    { name: 'Matheson Hammock Park', lat: 25.6803, lng: -80.2744 },
  ],
  'Green Iguana': [
    { name: 'Key Biscayne - Bill Baggs Cape', lat: 25.6891, lng: -80.1628 },
    { name: 'Virginia Key Beach Park', lat: 25.7466, lng: -80.1324 },
    { name: 'South Beach - South Pointe Park', lat: 25.7825, lng: -80.1324 },
    { name: 'Crandon Park Marina', lat: 25.7075, lng: -80.1562 },
  ],
};

const getLocationForSpecies = (speciesName: string) => {
  const locations = KEY_LOCATIONS[speciesName];
  if (locations) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    return {
      latitude: location.lat,
      longitude: location.lng,
      address: location.name,
    };
  }
  
  const randomLoc = {
    latitude: MIAMI_BOUNDS.south + Math.random() * (MIAMI_BOUNDS.north - MIAMI_BOUNDS.south),
    longitude: MIAMI_BOUNDS.west + Math.random() * (MIAMI_BOUNDS.east - MIAMI_BOUNDS.west),
  };
  return {
    ...randomLoc,
    address: 'Miami-Dade County',
  };
};

export const alerts: Alert[] = [
  {
    id: '1',
    title: 'URGENT: Large Python Cluster at Shark Valley',
    message: 'FWC Alert: Multiple Burmese Pythons (12-15 individuals) spotted near Shark Valley Visitor Center. Park rangers have confirmed a potential breeding site. Visitors should maintain minimum 50ft distance. Report sightings to 1-888-IVE-GOT1. Area temporarily restricted for public safety. Coordinates: 25.7617°N, 80.7650°W',
    type: 'danger',
    location: KEY_LOCATIONS['Burmese Python'][0],
    timestamp: '2024-02-15T10:30:00Z',
    species: species[0],
    status: 'verified'
  },
  {
    id: '2',
    title: 'Critical: Feral Hog Damage in Homestead',
    message: 'Miami-Dade Agricultural Division Report #2024-089: Extensive crop damage by feral hog group (est. 20-25 animals) in Homestead farming district. Damage radius: ~2.5 miles. Affected crops: tomatoes, squash. Estimated damage: $75,000. Agricultural workers advised to exercise caution. Control measures being implemented. Emergency hotline: 305-248-3311',
    type: 'warning',
    location: KEY_LOCATIONS['Feral Hogs'][0],
    timestamp: '2024-02-14T15:45:00Z',
    species: species[1],
    status: 'verified'
  },
  {
    id: '3',
    title: 'Health Advisory: Cane Toad Surge in Miami Springs',
    message: 'Miami-Dade Health Department Notice: Significant increase in Cane Toad population around Miami Springs Circle Area. 47 specimens counted in recent survey. Pet owners advised to keep animals leashed and avoid dawn/dusk walks. Symptoms of pet exposure: excessive drooling, seizures, heat. Emergency vet contact: 305-666-4142. Report dense populations to Animal Services.',
    type: 'warning',
    location: KEY_LOCATIONS['Cane Toads'][0],
    timestamp: '2024-02-13T20:15:00Z',
    species: species[2],
    status: 'verified'
  },
  {
    id: '4',
    title: 'Infrastructure Alert: Iguana Damage at Key Biscayne',
    message: 'Key Biscayne Public Works Alert #KBI-24-156: Significant seawall erosion detected due to Green Iguana burrowing. Location: Bill Baggs Cape Florida State Park. Multiple burrow systems identified. Structural assessment underway. Public advised to report new burrow sightings to 305-361-5207. Temporary barriers being installed.',
    type: 'warning',
    location: KEY_LOCATIONS['Green Iguana'][0],
    timestamp: '2024-02-12T09:20:00Z',
    species: species[3],
    status: 'verified'
  },
  // Generate additional alerts with more realistic scenarios
  ...Array.from({ length: 26 }, (_, i) => {
    const randomSpecies = species[Math.floor(Math.random() * species.length)];
    const location = getLocationForSpecies(randomSpecies.name);
    
    // Generate realistic alert templates based on species
    let alertTemplate;
    switch (randomSpecies.name) {
      case 'Burmese Python':
        alertTemplate = {
          title: `Python Alert: ${location.address}`,
          message: `FWC Notification #${Math.floor(Math.random() * 1000)}: ${Math.floor(Math.random() * 3) + 1} Burmese Python(s) spotted by park ranger. Size estimate: ${Math.floor(Math.random() * 8) + 8}ft. Last seen near coordinate markers ${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°W. Report sightings to 1-888-IVE-GOT1.`
        };
        break;
      case 'Feral Hogs':
        alertTemplate = {
          title: `Agricultural Damage Report: ${location.address}`,
          message: `Crop Protection Unit Report #${Math.floor(Math.random() * 1000)}: Feral hog activity detected. Group size: ${Math.floor(Math.random() * 15) + 5} animals. Affected area: ${Math.floor(Math.random() * 2) + 1}.5 acres. Current status: ${Math.random() > 0.5 ? 'Active' : 'Recently departed'}. Control teams dispatched.`
        };
        break;
      case 'Cane Toads':
        alertTemplate = {
          title: `Cane Toad Population Alert: ${location.address}`,
          message: `Environmental Health Notice #${Math.floor(Math.random() * 1000)}: ${Math.floor(Math.random() * 30) + 10} Cane Toads identified in residential area. Risk Level: ${Math.random() > 0.5 ? 'Moderate' : 'High'}. Pet owners advised to maintain vigilance. Report concentrations to Animal Services: 305-418-7000.`
        };
        break;
      default:
        alertTemplate = {
          title: `${randomSpecies.name} Activity: ${location.address}`,
          message: `Wildlife Alert #${Math.floor(Math.random() * 1000)}: Increased ${randomSpecies.name} activity reported. Public advised to maintain safe distance and report unusual behavior to FWC at 1-888-404-FWCC.`
        };
    }

    return {
      id: `${i + 5}`,
      title: alertTemplate.title,
      message: alertTemplate.message,
      type: randomSpecies.dangerLevel === 'high' ? 'danger' : 
            randomSpecies.dangerLevel === 'medium' ? 'warning' : 'info',
      location,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      species: randomSpecies,
      status: Math.random() > 0.3 ? 'verified' : 'pending'
    };
  })
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const getRecentAlerts = (count: number = 3) => {
  return alerts.slice(0, count);
};