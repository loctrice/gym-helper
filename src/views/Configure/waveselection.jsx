export default class WaveSelection extends React.Component{
    change(event){
        this.props.waveChange(event.target.value);
    }
   render(){
       var waves = this.props.waves.map(function(wave){
           return (<option value={wave}>{wave}'s Wave</option>);
       });
       return(
           <select className='form-control' onChange={this.change} value={this.props.currentWave}>
            {waves}
           </select>
       );
   } 
};