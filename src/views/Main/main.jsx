import ReactDOM from 'react-dom'
import About from '../About/about'
import Review from '../Review/review'
import Configure from '../Configure/configure'
import {Navigation} from '../Navigation/navigation'
import PromgramDisplay from '../LiftProgram/programdisplay'

// const ContentAreas = {
//     Home: <ProgramDisplay />,
//     About: <About />,
//     Review: <Review />,
//     Configure: <Configure />
// };

class Location extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        switch(this.props.location){
            case "Home":
                return <ProgramDisplay />
            case "About":
                return <About />
            case "Review":
                return <Review />
            case "Configure":
                return <Configure />
        }
        //return (ContentAreas[this.props.location]);
    }
};

class Main extends React.Component{
    constructor(props) {
        super(props);
        var locations = ["Home", "About", "Review", "Configure"];// Object.keys(ContentAreas);
        this.state = {
            locations: locations,            
            content: locations[1]
        }
    }
    setContentArea(where) {
        this.setState({ content: where });
    }
    render() {
        return (
            <div>
                <nav id='site-navigation' className="navbar navbar-default navbar-static-top">
                    <Navigation setContentArea={this.setContentArea.bind(this)}
                        locations={this.state.locations} active={this.state.content}/>
                </nav>
                <div className='container'>
                    <Location location={this.state.content}/>
                </div>
            </div>
        );
    }
};

ReactDOM.render(<Main />, document.getElementById('view'));