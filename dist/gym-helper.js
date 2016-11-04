/* exported ajax */
/** Represents an ajax request.
* @constructor
*/
function ajax() {
    'use strict';

    var service = {
        get: get,
        post: post
    };

    return service;

    /** Sends a get request to a given url and returns a promise. */
    function get(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            setupRequest(req, resolve, reject);
            req.send();
        });
    }

    /** Send a post with form data.
     *  Note: Data must be in key value url style.
     *  i.e. -  foo=bar&foobar=taco*/
    function post(url, data) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('POST', url);
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            setupRequest(req, resolve, reject);
            req.send(data);
        });
    }

    /** Sets up the request object to use the promise when it returns.
     *  @param {XMLHttpRequest} request object
     *  @param {method} method to call when success happens
     *  @param {method} method to call when things don't go as planned
     */
    function setupRequest(req, resolve, reject) {
        req.onload = function() {
            if (req.status === 200) {
                resolve(req.response);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function() {
            reject(Error('Network Error'));
        };
    }
};/* exported constants */
var constants = {
    WEEKS: [10,8,5,3],
    PHASES: ['Acumulation', 'Intensification', 'Realization']
};;(function () {
    'use strict';
    
    /** Move an item from index a to index b 
     *  var arr = [ 'a', 'b', 'c', 'd', 'e'];
     *  arr.move(3,1);//["a", "d", "b", "c", "e"]
     *  @param {number} starting index, or index of the item to move
     *  @param {number} ending index, or item destination
    */
    if(typeof Array.prototype.move !== 'function'){
        Array.prototype.move = function(from, to) {
            this.splice(to, 0, this.splice(from, 1)[0]);
        };
    }
    
}());;/* exported LoadingWeights */
var LoadingWeights = (function() {
    'use strict';

    // Pair values of available weights to load on the bar (i.e a 45 on each side is 90)    
    var AVAILABLE_WEIGHTS = [90, 70, 50, 20, 10, 5];
    var LOWEST_AVAILABLE_WEIGHT = 4; 
    var BAR_WEIGHT = 45; //olympic bar standard is what we base the load on.
    var load = {};

    var service = {
        getLoad: getLoadString,
        getNewMax: getNewMax
    };
    return service;

    /** Formula to progress through program. This can increment, decrement, or stay the same
     *  depending on the number of reps achieved.
     *  @param {number} wave (i.e. 10's wave, 8's wave, etc)
     *  @param {number} reps completed on AMAP
     *  @param {number} current max for the lift
     *  @param {number} amount to increment (typically 2.5 for arms and 5 for legs)
     */
    function getNewMax(minimumOptimalReps, repsAchieved, currentMax, inrement) {
        var repsPastMinimum = repsAchieved - minimumOptimalReps;
        repsPastMinimum = (repsPastMinimum > 10) ? 10 : repsPastMinimum;
        return ((repsPastMinimum * inrement) + currentMax);
    }

    /** Make a string to dispaly the optimal order of weights to load on the bar.
     *  This will get as close as possible to the weight with the given weights
     */
    function getLoadString(weight) {
        resetLoad();
        weight -= BAR_WEIGHT;
        calculatePlates(weight);
        return makeOutputString();
    }

    /** Create output string for interface. */
    function makeOutputString() {
        var output = '';
        for (var i = 0; i < AVAILABLE_WEIGHTS.length; i++) {
            var plate = load[AVAILABLE_WEIGHTS[i]];
            if (plate.count > 0) {
                output += plate.count + 'x' + plate.plate;
                if (plate.count > 1) {
                    output += '\'s';
                }
                output += ', ';
            }
        }

        // Chop of trailing comma and space (cleaner than logic in the loop, and simpler than another function)        
        output = output.substring(0, output.length - 2); 
        return output;
    }     

    /** Get the optimal load order for the weights. */    
    function calculatePlates(weight) {  
        var sanity = 25; // Don't want an edge case to lock up the browser.              
        while (weight > LOWEST_AVAILABLE_WEIGHT && sanity > 0) {
            sanity--;
            // Find the first amount of weight that will fit, and then stop and break;
            for (var plateIndex = 0; plateIndex < AVAILABLE_WEIGHTS.length; plateIndex++) {
                if (weight - AVAILABLE_WEIGHTS[plateIndex] >= 0) {
                    weight -= AVAILABLE_WEIGHTS[plateIndex];
                    load[AVAILABLE_WEIGHTS[plateIndex]].count++;
                    break;
                }
            }
        }
    }

    /** Set the load object back to it's initial state. */    
    function resetLoad() {
        load = {
            90: { plate: 45, count: 0 },
            70: { plate: 35, count: 0 },
            50: { plate: 25, count: 0 },
            20: { plate: 10, count: 0 },
            10: { plate: 5, count: 0 },
            5: { plate: 2.5, count: 0 }
        };
    }
} ());

;window.About = React.createClass({
    render: function() {
        return (
            <h2>About page</h2>
        )
    }
});;window.Configure = React.createClass({
    componentDidMount: function(){
        ConfigurationUtils.get(this);
    },
    getInitialState: function(){
        return{
           waves: constants.WEEKS ,
           phases: constants.PHASES,
           data: null,
           loaded:false
        };
    },
    itemChanged: function(lift, index){
        var data = this.state.data;
        data.lifts[index] = lift;
        console.log(data);
        ConfigurationUtils.post(data);
        this.setState({
            data: data
        });
    },
    deleteLift: function(index){
      if(confirm("Are you sure you want to delete this item ?")){
        var data = this.state.data;
        data.lifts.splice(index,1);
        ConfigurationUtils.post(data);
        this.setState({
            data: data
        });  
      }
    },
    reorderLifts: function(order, index){
        var data = this.state.data;
        data.lifts.move(index, order);
        ConfigurationUtils.post(data);
        this.setState({
            data: data
        });
    },
    waveChange: function(newData){
        var data = this.state.data;
        data.phase = newData;
        ConfigurationUtils.post(data);
        this.setState({
            data: data
        });
    },
    weekChange: function(newData){
        var data = this.state.data;
        data.week = newData;
        ConfigurationUtils.post(data);
        this.setState({
            data: data
        });
    },
    addNew: function () {
        var liftName = prompt("Name of the new lift:", "New Lift");
        if (liftName === null || liftName === undefined) {
            return;
        }
        var newLift = {
            name: liftName,
            max: 45,
            increment: 5,
            type: "Legs",
            done: false
        };
        var data = this.state.data;
        data.lifts = data.lifts.concat(newLift);
        data.lifts.move(data.lifts.length - 1, 0);
        ConfigurationUtils.post(data);
        this.setState({
            data: data
        });
    },
    render: function() {
        if(this.state.loaded === false){
            return (<div className='well'><p>Loading....</p></div>);
        }
        var self = this;
        var exercises = this.state.data.lifts.map(function(l,index){
            return(<Exercise reorderLifts={self.reorderLifts} deleteLift={self.deleteLift} 
                    itemChanged={self.itemChanged} lift={l} index={index} order={index} />);
        });
        return (
            <div>
                <div className='form-group'>
                    <WaveSelection waveChange={this.waveChange} waves={this.state.waves} currentWave={this.state.data.phase} />
                </div>
                <div className='form-group'>
                    <PhaseSelection weekChange={this.weekChange} phases={this.state.phases} currentWeek={this.state.data.week} />
                </div>
                <div className='form-group'>
                    <button className='btn btn-primary form-control' onClick={this.addNew}>
                        <span>Add Exercise</span>
                        <span className='pull-right glyphicon glyphicon-plus-sign'></span>
                    </button>
                </div>
                {exercises}
            </div>
        )
    }
});;window.Exercise = React.createClass({
   onCompletedChange: function(event){
       var lift = this.props.lift;
       lift.done = !lift.done;
       this.props.itemChanged(lift, this.props.index);
   },
   onMaxChange: function(event){
       var lift = this.props.lift;
       lift.max = event.target.value;
       this.props.itemChanged(lift, this.props.index);
   },
   onIncrementChange: function(event){
       var lift = this.props.lift;
       lift.increment = event.target.value;
       this.props.itemChanged(lift, this.props.index);
   },
   onTypeChange: function(event){
       var lift = this.props.lift;
       lift.type = event.target.value;
       this.props.itemChanged(lift, this.props.index);
   },
   removeLift: function(event){
       this.props.deleteLift(this.props.index);
   },
   /* may want to change this to up/down arrow to move in list. It updates super fast. */
   reorder: function(event){
       this.props.reorderLifts(event.target.value, this.props.index);
   },
   render: function(){
       var lift = this.props.lift;
       return(
           <div className='form-group'>
                <div className='panel panel-primary'>
                    <div className='panel-heading'>
                        {lift.name}
                    </div>
                    <div className='panel-body'>
                        <div className='form-group'>
                            <label>Order/Sort</label>
                            <input type='number' className='form-control' value={this.props.order} onChange={this.reorder}/>
                        </div>
                        <div className='form-group'>
                            <label>Max</label>
                            <input type='number' className='form-control' value={lift.max} onChange={this.onMaxChange}/>
                        </div>
                        <div className='form-group'>
                            <label>Increment</label>
                            <input type='number' className='form-control' value={lift.increment} onChange={this.onIncrementChange}/>
                        </div>
                        <div className='form-group'>
                            <label>Type &nbsp;</label>
                            <select className='form-control' onChange={this.onTypeChange} value={lift.type}>
                                <option value='Arms'>Arms</option>
                                <option value='Legs'>Legs</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <div class="checkbox">
                                <label>
                                Completed &nbsp;<input type="checkbox" value="" onClick={this.onCompletedChange}  checked={lift.done} />
                                </label>
                            </div>
                        </div>
                        <div className='form-group'>
                            <button className='pull-right btn btn-danger btn-xs' onClick={this.removeLift}>Remove</button>
                        </div>
                    </div>
                </div>  
            </div>              
       );
   } 
});;
window.PhaseSelection = React.createClass({
    change: function(event){
        this.props.weekChange(event.target.value);
    },
   render:function(){
       var phases = this.props.phases.map(function(phase){
          return(<option value={phase}>{phase} Phase</option>) 
       });
       return (
           <select className='form-control' onChange={this.change} value={this.props.currentWeek}>
           {phases}
           </select>
       );
   } 
});;/* global ajax */
window.ConfigurationUtils = (function () {
    'use strict';
    
    var API_PAGE = 'test.php';
    var PAGE_DATA_ENDPOINT = 'page-data';
    
    var service = {
        post: postData,
        get: getData
    };
    return service;
    
    /** Post updated data to api. */
    function postData(data){
        var post = new ajax();
        post.post(API_PAGE + '/' + PAGE_DATA_ENDPOINT , 'data=' + JSON.stringify(data));
    }
    
    /** Get workout data and ruleset from api. */
    function getData(caller){
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
}());;window.WaveSelection = React.createClass({
    change: function(event){
        this.props.waveChange(event.target.value);
    },
   render:function(){
       var waves = this.props.waves.map(function(wave){
           return (<option value={wave}>{wave}'s Wave</option>);
       });
       return(
           <select className='form-control' onChange={this.change} value={this.props.currentWave}>
            {waves}
           </select>
       );
   } 
});;
window.ProgramDisplay = React.createClass({
    getInitialState: function() {
        return {
            liftData: {},
            thisLift: {},
            rules: {},
            liftIndex: 0,
            maxReps: 0,
            phases: constants.WEEKS,
            weeks: constants.PHASES,
            loaded: false
        }
    },
    componentDidMount: function() {
        LiftProgramUtils.get(this);
    },
    undoLift: function() {
        var liftIndex = this.state.liftIndex;
        var liftData = this.state.liftData;
        liftData.lifts[liftIndex].done = false;
        if (liftIndex == 0) {
            liftIndex = this.state.liftData.lifts.length;
            
            var phaseIndex = this.state.phases.indexOf(liftData.phase);        
            var weekIndex = this.state.weeks.indexOf(liftData.week);

            weekIndex--;
            if (weekIndex <= 0) {
                weekIndex = 0;
                liftIndex = 1; 
                /* don't allow backing up to a new phase (so phase index logic is missing intentionally)*/
            }
            liftData.week = this.state.weeks[weekIndex];
            liftData.phase = this.state.phases[phaseIndex];            
        }
        liftIndex--;
        liftData.lifts[liftIndex].done = false;
        LiftProgramUtils.post(liftData);
        this.setState({
            liftData: liftData,
            liftIndex: liftIndex,
        });
    },
    updateLift: function(e) {
        e.preventDefault(); //stop form post
        var liftIndex = this.state.liftIndex;
        var liftData = this.state.liftData;
        var isLastLift = (liftIndex >= liftData.lifts.length - 1);
        liftData.lifts[liftIndex].done = true;
        var maxReps = this.state.maxReps;         
        var thisRule = this.state.rules.Rules[liftData.phase][liftData.week];
        
        if (LiftProgramUtils.getReps(thisRule) === 0) { 
            liftData.lifts[liftIndex].max = LoadingWeights.getNewMax(liftData.phase, maxReps, liftData.lifts[liftIndex].max, liftData.lifts[liftIndex].increment);
        }

        if (isLastLift) {
            var phaseIndex = this.state.phases.indexOf(liftData.phase);        
            var weekIndex = this.state.weeks.indexOf(liftData.week);
            weekIndex++;
            if(weekIndex > this.state.weeks.length - 1){
                weekIndex = 0;
                phaseIndex++;
                if(phaseIndex > this.state.phases.length - 1){
                    phaseIndex = 0; 
                }
            }
            LiftProgramUtils.setAllLiftsFalse(liftData);
            liftData.week = this.state.weeks[weekIndex];
            liftData.phase = this.state.phases[phaseIndex];
            liftIndex = -1;
        }
        
        maxReps = liftData.phase;        
        LiftProgramUtils.post(liftData);

        this.setState({
            liftData: liftData,
            liftIndex: ++liftIndex,
            maxReps: maxReps,
        });
    },
    handleRepsChange: function(event) {
        this.setState({
            maxReps: event.target.value,
        });
    },
    render: function() {
        var sets = [];
        var thisLift = { name: 'Loading' };
        if (this.state.loaded === true) {
            var workout = this.state.liftData;
            var liftObj = this.state.rules.Rules[workout.phase][workout.week];
            var lastReps = LiftProgramUtils.getReps(liftObj);
            var input  = null;
            if(lastReps === 0){
                input = <input type="number" className="form-control" value={this.state.maxReps} onChange={this.handleRepsChange} />
            }
            thisLift = this.state.liftData.lifts[this.state.liftIndex];
            for (var key in liftObj) {
                var lift = liftObj[key];
                sets.push(<Set workout={workout} liftObj={lift} thisLift={thisLift} />);
            }
        }

       return (
            <div className="panel panel-primary">
                <div className="panel-heading"><span>{thisLift.name}</span>
                    <span className='label label-info pull-right'>
                        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                        <span className="sr-only"></span>
                        <span>{this.state.liftData.phase}'s Week &nbsp;</span>
                        <span>{this.state.liftData.week} Phase</span>
                    </span>
                </div>
                <div className="panel-body">
                    <ul className="list-group">
                        {sets}
                    </ul>
                    <button disabled={this.state.liftIndex == 0} onClick={this.undoLift} className='btn btn-danger btn-xs'>
                        <span className='glyphicon glyphicon-arrow-left'></span
                        >&nbsp; Back
                    </button>
                    <form className="pull-right">
                        <div className="form-group">
                           {input}
                        <button onClick={this.updateLift} className='btn btn-success btn-xs pull-right'>
                            Complete Exercise &nbsp;
                            <span className='glyphicon glyphicon-ok'></span>
                        </button>
                        </div>
                        
                    </form>
                    
                </div>
           </div>
        )
    }
});
;var Set = React.createClass({
    render: function() {
        var weight = parseInt(this.props.thisLift.max * this.props.liftObj.percent);
        var loadUp = LoadingWeights.getLoad(weight);
        var reps = this.props.liftObj.reps;
        reps = (reps === 0) ? "AMAP" : reps;

        return (
            <li className='list-group-item'>
                <span className="badge">{weight} lbs</span>
                <span className="label label-primary">{reps}  Reps</span>
                &nbsp; &nbsp; <span className="label label-info">{loadUp}</span>
            </li>
        )
    }
});

window.Set = Set;;/* global ajax */
window.LiftProgramUtils = (function () {
    'use strict';
    
    var API_PAGE = 'test.php';
    var PAGE_DATA_ENDPOINT = 'page-data';
    var RULES_ENDPOINT = 'jugg-rules';
    
    var service = {
        post: postData,
        get: getData,
        getLiftIndex: getLiftIndex,
        setAllLiftsFalse: setAllLiftsUndone,
        getReps: getReps
    };
    return service;
    
    /** Post updated data to api. */
    function postData(data){
        var post = new ajax();
        post.post(API_PAGE + '/' + PAGE_DATA_ENDPOINT, 'data=' + JSON.stringify(data));
    }
    
    /** Get workout data and ruleset from api. */
    function getData(caller){
        var request = new ajax();
        request.get(API_PAGE + '/' + PAGE_DATA_ENDPOINT)
            .then(function(data) {
                var liftData = JSON.parse(data);
                request.get(API_PAGE + '/' + RULES_ENDPOINT)
                    .then(function(response) {
                        var rules = JSON.parse(response);
                        var liftIndex = getLiftIndex(liftData);
                        caller.setState({
                            liftData: liftData,
                            maxReps: liftData.phase,
                            rules: rules,
                            liftIndex: liftIndex,
                            loaded: true
                        });
                    });
            });
    }
    
    /** Find the index of the first incomplete lift. */
    function getLiftIndex(liftData){
        for (var i = 0; i < i < liftData.lifts.length; i++) {
            if (liftData.lifts[i].done === false) {
                return i;
            }
        }
    }
    
    /** Set all the lifts done property to false. Useful when moving from one way to another. */
    function setAllLiftsUndone(liftData){
        for(var i = 0; i < liftData.lifts.length; i++){
            liftData.lifts[i].done = false;
        }
    }
    
    /** Get the reps from the last set in a given rule.
     *  @param {Object} rules object for program
     */
    function getReps(rule){
        return rule[Object.keys(rule).sort().pop()].reps;
    }
}());;
var ContentAreas = {
    Home: <ProgramDisplay />,
    About: <About />,
    Review: <Review />,
    Configure: <Configure />
};

var Location = React.createClass({
    render: function() {
        return (ContentAreas[this.props.location]);
    }
});

var Main = React.createClass({
    getInitialState: function() {
        var locations = Object.keys(ContentAreas);
        return {
            locations: locations,            
            content: locations[0]
        }
    },
    setContentArea: function(where) {
        this.setState({ content: where });
    },
    render: function() {
        return (
            <div>
                <nav id='site-navigation' className="navbar navbar-default navbar-static-top">
                    <Navigation setContentArea={this.setContentArea}
                        locations={this.state.locations} active={this.state.content}/>
                </nav>
                <div className='container'>
                    <Location location={this.state.content}/>
                </div>
            </div>
        );
    }
});

React.render(<Main />, document.getElementById('view'));;
var Item = React.createClass({
    render: function() {
        return (
            <li className={this.props.activeClass}>
                <a href='#' onClick={this.props.updateNavigation}>{this.props.text}</a>
            </li>
        );
    }
});

window.Navigation = React.createClass({
    getInitialState: function() {
        return {
            active: this.props.active,
        };
    },
    updateActiveLink: function(event) {
        event.preventDefault();
        var thisValue = event.target.text;
        if (this.state.active !== thisValue) {
            this.setState({ active: thisValue });
        }
        this.props.setContentArea(thisValue);
    },
    render: function() {
        var self = this;
        var links = this.props.locations.map(function(item) {
            var active = (item === self.state.active) ? 'active' : '';
            return (
                <Item activeClass={active} text={item} updateNavigation={self.updateActiveLink}/>
            );
        });
        return (
            <div>
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false"
                        aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#">Workout Program</a>
                </div>
                <div id="navbar" className="navbar-collapse collapse">

                    <ul className="nav navbar-nav">
                        {links}
                    </ul>

                    <ul className="nav navbar-nav navbar-right">
                    </ul>
                </div>
            </div>
        )
    }
});

;window.Review = React.createClass({
    render: function() {
        return (
            <h2>Review page</h2>
        )
    }
});