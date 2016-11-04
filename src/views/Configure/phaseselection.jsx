
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
});