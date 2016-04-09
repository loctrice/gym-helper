
var ContentAreas = {
    Home: <ProgramDisplay />,
    About: <About />,
    Review: <Review />,
    Configure: <Configure />
};

var Location = React.createClass({
    render: function() {
        return (ContentAreas[this.props.location]);
    }
});

var Main = React.createClass({
    getInitialState: function() {
        var locations = Object.keys(ContentAreas);
        return {
            locations: locations,            
            content: locations[0]
        }
    },
    setContentArea: function(where) {
        this.setState({ content: where });
    },
    render: function() {
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
});

React.render(<Main />, document.getElementById('view'));