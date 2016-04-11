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
    render: function() {
        if(this.state.loaded === false){
            return (<div className='well'><p>Loading....</p></div>);
        }
        var exercises = this.state.data.lifts.map(function(l,index){
            return(<Exercise lift={l} index={index} order={index} />);
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
                    <button className='btn btn-primary form-control'>
                        <span>Add Exercise</span>
                        <span className='pull-right glyphicon glyphicon-plus-sign'></span>
                    </button>
                </div>
                {exercises}
            </div>
        )
    }
});