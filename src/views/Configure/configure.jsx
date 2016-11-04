window.Configure = React.createClass({
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
});