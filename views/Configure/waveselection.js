window.WaveSelection = React.createClass({
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
});