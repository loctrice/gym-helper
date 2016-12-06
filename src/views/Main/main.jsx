
import {ProgramDisplay} from '../LiftProgram/programdisplay'
import {About} from '../About/about'
import {Review} from '../Review/review'
import {Configure} from '../Configure/configure'
import {Navigation} from '../Navigation/navigation'

var ContentAreas = {
    Home: <ProgramDisplay />,
    About: <About />,
    Review: <Review />,
    Configure: <Configure />
};

export class Location extends React.Component{
    render() {
        return (ContentAreas[this.props.location]);
    }
};

export class Main extends React.Component{
    getInitialState() {
        var locations = Object.keys(ContentAreas);
        return {
            locations: locations,            
            content: locations[0]
        }
    }
    setContentArea(where) {
        this.setState({ content: where });
    }
    render() {
        return (
            <div>
                <nav id='site-navigation' className="navbar navbar-default navbar-static-top">
                    <Navigation setContentArea={this.setContentArea}
                        locations={this.state.locations} active={this.state.content}/>
                </nav>
                <div className='container'>
                    <Location location={this.state.content}/>
                </div>
            </div>
        );
    }
};

React.render(<Main />, document.getElementById('view'));