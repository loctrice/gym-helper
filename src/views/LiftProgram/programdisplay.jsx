
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
