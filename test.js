var Set = React.createClass({
    render: function() {
        var weight = parseInt(this.props.thisLift.max, 10) * parseFloat(this.props.liftObj.percent);
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
})
var Test = React.createClass({
    getInitialState: function() {
        return {
            liftData: {},
            thisLift: {},
            rules: {},
            liftIndex: 0,
            maxReps: 0,
            phases: [10, 8, 5, 3],
            weeks: [ "Acumulation", "Intensification", "Realization"],
            loaded: false
        }
    },
    componentDidMount: function() {
        var self = this;
        var request = new ajax();
        request.get('test.php/page-data')
            .then(function(data) {
                var liftData = JSON.parse(data);
                request.get('test.php/jugg-rules')
                    .then(function(response) {
                        var rules = JSON.parse(response);
                        var thisLift;
                        for (var i = 0; i < i < liftData.lifts.length; i++) {
                            if (liftData.lifts[i].done === false) {
                                thisLift = liftData.lifts[i];
                                break;
                            }
                        }
                        self.setState({
                            liftData: liftData,
                            maxReps: liftData.phase,
                            rules: rules,
                            liftIndex: i,
                            loaded: true
                        });
                    });
            });
    },
    undoLift: function() {
        var index = this.state.liftIndex;
        var liftData = this.state.liftData;
        liftData.lifts[index].done = false;
        if (index == 0) {
            index = this.state.liftData.lifts.length;
            //back the week up if we can
            var phaseIndex = this.state.phases.indexOf(liftData.phase);        
            var weekIndex = this.state.weeks.indexOf(liftData.week);

            weekIndex--;
            if (weekIndex <= 0) {
                //we're at the beginning of the phase
                //should we back up to the previous phase ?
                weekIndex = 0;
                index = 1; //don't back up the lift
            }
            liftData.week = this.state.weeks[weekIndex];
            liftData.phase = this.state.phases[phaseIndex];            
        }
        index--;
        liftData.lifts[index].done = false;
        var post = new ajax();
        post.post('test.php/page-data', 'data=' + JSON.stringify(liftData));
        
        this.setState({
            liftData: liftData,
            liftIndex: index,
            loaded: true
        });
    },
    updateLift: function(e) {
        e.preventDefault();
        var index = this.state.liftIndex;
        var liftData = this.state.liftData;
        var isLastLift = (index >= liftData.lifts.length - 1);
        liftData.lifts[index].done = true;
        var maxReps = this.state.maxReps;
         
        var thisRule = this.state.rules.Rules[liftData.phase][liftData.week];
        var reps = thisRule[Object.keys(thisRule).sort().pop()].reps;
        //if this is AMAP (realization phase) then update the max
        if (reps === 0) { 
            console.log('doing the max');
            liftData.lifts[index].max = LoadingWeights
                    .getNewMax(liftData.phase, maxReps, liftData.lifts[index].max, liftData.lifts[index].increment);
        }

        if (isLastLift) {
            var phaseIndex = this.state.phases.indexOf(liftData.phase);        
            var weekIndex = this.state.weeks.indexOf(liftData.week);
            weekIndex++;
            if(weekIndex > this.state.weeks.length - 1){
                weekIndex = 0;
                phaseIndex++;
                if(phaseIndex > this.state.phases.length - 1){
                    phaseIndex = 0; //this starts us over
                }
            }
            for(var i = 0; i < liftData.lifts.length; i++){
                liftData.lifts[i].done = false;
            }
            liftData.week = this.state.weeks[weekIndex];
            liftData.phase = this.state.phases[phaseIndex];
            index = -1;
        }
        
        maxReps = liftData.phase;
        
        var post = new ajax();
        post.post('test.php/page-data', 'data=' + JSON.stringify(liftData));
        this.setState({
            liftData: liftData,
            liftIndex: ++index,
            maxReps: maxReps,
            loaded: true
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
            var lastReps = liftObj[Object.keys(liftObj).sort().pop()].reps;
            var input  = null;
            if(lastReps === 0){
                input = <input type="number" className="form-control" value={this.state.maxReps} onChange={this.handleRepsChange} />
            }
            var thisLift = this.state.liftData.lifts[this.state.liftIndex];
            for (var key in liftObj) {
                var lift = liftObj[key];
                sets.push(<Set workout={workout} liftObj={lift} thisLift={thisLift} />);
            }
        }

         /* when reps are AMAP we are done with a cycle and we need and
        * input box for # of reps completed.
        * That input box should default to the # of the week (i.e. 10's week)
        * LoadingWeights.getNewMax(wave, reps, max, inrement) 
        */        
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

React.render(<Test />, document.getElementById('example'));