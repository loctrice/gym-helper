var Set = React.createClass({
    render: function() {
        var weight = parseInt(this.props.thisLift.max, 10) * parseFloat(this.props.liftObj.percent);
        var loadUp = LoadingWeights.getLoad(weight);
        var reps = this.props.liftObj.reps;
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
                            thisLift: thisLift,
                            rules: rules,
                            loaded: true
                        });
                    });
            });
    },
    render: function() {
        var sets = [];
        if (this.state.loaded === true) {
            var workout = this.state.liftData;
            var liftObj = this.state.rules.Rules[workout.phase][workout.week];
            var thisLift = this.state.thisLift;
            for (var key in liftObj) {
                var lift = liftObj[key];
                sets.push(<Set workout={workout} liftObj={lift} thisLift={thisLift} />);
            }
        }
        return (
            <div className="panel panel-primary">
                <div className="panel-heading"><span>{this.state.thisLift.name}</span>
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
                    <button className='btn btn-success btn-xs pull-right'>Complete Exercise &nbsp; <span className='glyphicon glyphicon-ok'></span></button>
                </div>
            </div>
        )
    }
});

React.render(<Test />, document.getElementById('example'));