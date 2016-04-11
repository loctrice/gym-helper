window.Exercise = React.createClass({
   render: function(){
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
                            <input type='number' className='form-control' value={this.props.order} />
                        </div>
                        <div className='form-group'>
                            <label>Max</label>
                            <input type='number' className='form-control' value={lift.max} />
                        </div>
                        <div className='form-group'>
                            <label>Increment</label>
                            <input type='number' className='form-control' value={lift.increment} />
                        </div>
                        <div className='form-group'>
                            <label>Type &nbsp;</label>
                            <select className='form-control'>
                                <option>Arms</option>
                                <option>Legs</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <div class="checkbox">
                                <label>
                                Completed &nbsp;<input type="checkbox" value=""  checked={lift.done} />
                                </label>
                            </div>
                        </div>
                        <div className='form-group'>
                            <button className='pull-right btn btn-danger btn-xs'>Remove</button>
                        </div>
                    </div>
                </div>  
            </div>              
       );
   } 
});