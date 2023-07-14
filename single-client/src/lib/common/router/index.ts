import { Router} from './router';
export { Route } from './route';
import { HistoryAdapter } from './history-adapter'

export const history = new HistoryAdapter(); 
export const router = new Router(history); 