export default class Exercise extends  React.Component{
   onCompletedChange(event){
       var lift = this.props.lift;
       lift.done = !lift.done;
       this.props.itemChanged(lift, this.props.index);
   }
   onMaxChange(event){
       var lift = this.props.lift;
       lift.max = event.target.value;
       this.props.itemChanged(lift, this.props.index);
   }
   onIncrementChange(event){
       var lift = this.props.lift;
       lift.increment = event.target.value;
       this.props.itemChanged(lift, this.props.index);
   }
   onTypeChange(event){
       var lift = this.props.lift;
       lift.type = event.target.value;
       this.props.itemChanged(lift, this.props.index);
   }
   removeLift(event){
       this.props.deleteLift(this.props.index);
   }
   /* may want to change this to up/down arrow to move in list. It updates super fast. */
   reorder(event){
       this.props.reorderLifts(event.target.value, this.props.index);
   }
   render(){
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
};