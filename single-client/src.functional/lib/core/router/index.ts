import { Router} from './router';
import { HistoryAdapter } from './history-adapter'
export * from './route';

export const history = new HistoryAdapter(); 
export const router = new Router(history); 