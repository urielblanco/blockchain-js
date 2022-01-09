import { SHA256 } from 'crypto-js';

const hash = (data) => SHA256(JSON.stringify(data)).toString();

export { hash };
