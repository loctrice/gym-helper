
export default class PhaseSelection extends  React.Component{
    change(event){
        this.props.weekChange(event.target.value);
    }
   render(){
       var phases = this.props.phases.map(function(phase){
          return(<option value={phase}>{phase} Phase</option>) 
       });
       return (
           <select className='form-control' onChange={this.change} value={this.props.currentWeek}>
           {phases}
           </select>
       );
   } 
};