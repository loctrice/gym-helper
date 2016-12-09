import React from 'react';

export default class Set extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        var weight = parseInt(this.props.thisLift.max * this.props.liftObj.percent);
        var loadUp = LoadingWeights.getLoad(weight);
        var reps = this.props.liftObj.reps;
        reps = (reps === 0) ? "AMAP" : reps;

        return (
            <li className='list-group-item'>
                <span className="badge">{weight} lbs</span>
                <span className="label label-primary">{reps}  Reps</span>
                &nbsp; &nbsp; <span className="label label-info">{loadUp}</span>
            </li>
        )
    }
};
