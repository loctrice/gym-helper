import ajax from '../../js/ajax'

const API_PAGE = 'test.php';
const PAGE_DATA_ENDPOINT = 'page-data';

export default class ConfigurationUtils {
    post(data){
        var post = new ajax();
        post.post(API_PAGE + '/' + PAGE_DATA_ENDPOINT , 'data=' + JSON.stringify(data));
    }
    
    /** Get workout data and ruleset from api. */
    get(caller){
        var request = new ajax();
        request.get(API_PAGE + '/' + PAGE_DATA_ENDPOINT)
            .then(function(data) {
                var liftData = JSON.parse(data);
                caller.setState({
                    data: liftData,
                    loaded: true
                });
            });
    }
}