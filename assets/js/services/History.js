
import createBrowserHistory from 'history/lib/createBrowserHistory';

let HistorySingleton = null;
 let History = function() 
 {
     if (HistorySingleton == null)
         HistorySingleton = createBrowserHistory();
     return HistorySingleton;
     
};
export default History;