import type {Career} from './types.js';
export const COUNTRIES=['Deutschland','USA','Großbritannien','Brasilien','Portugal','Frankreich','Japan','Kanada','Australien','Indien'];
export const CAREERS:Career[]=[
 {id:'retail',title:'Verkäufer/in',salary:27000,minAge:18,minSmarts:0,requiresDegree:false},
 {id:'driver',title:'Fahrer/in',salary:32000,minAge:18,minSmarts:0,requiresDegree:false},
 {id:'technician',title:'Techniker/in',salary:49000,minAge:18,minSmarts:40,requiresDegree:false},
 {id:'officer',title:'Polizeibeamte/r',salary:52000,minAge:18,minSmarts:45,requiresDegree:false},
 {id:'engineer',title:'Ingenieur/in',salary:75000,minAge:22,minSmarts:65,requiresDegree:true},
 {id:'teacher',title:'Lehrkraft',salary:58000,minAge:22,minSmarts:55,requiresDegree:true},
 {id:'doctor',title:'Arzt/Ärztin',salary:125000,minAge:22,minSmarts:85,requiresDegree:true},
 {id:'lawyer',title:'Rechtsanwalt/-anwältin',salary:105000,minAge:22,minSmarts:78,requiresDegree:true}
];
export const ITEMS=[{id:'car-small',name:'Gebrauchtwagen',kind:'Auto' as const,price:7500,annualCost:1200},{id:'car-new',name:'Neuwagen',kind:'Auto' as const,price:26000,annualCost:3000},{id:'house-small',name:'Eigentumswohnung',kind:'Haus' as const,price:130000,annualCost:3300},{id:'house-large',name:'Einfamilienhaus',kind:'Haus' as const,price:310000,annualCost:7500}];
export const NAMES=['Alex','Robin','Kim','Sam','Mira','Jamie','Noah','Lea','Emil','Lina','Jules','Mika','Marie','Felix','Jana','Luis'];
export const LAST_NAMES=['Meyer','Schneider','Costa','Lenz','Hoffmann','Becker','Silva','Wagner','Nguyen','Fischer'];
