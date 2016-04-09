
var Location = React.createClass({

    render: function() {
        var where = this.props.location;
        switch (this.props.location) {
            case 'Home':
                return (<ProgramDisplay />);
            default:
                return (
                    <h2>Not Home</h2>
                );
        }
    }
});

var Main = React.createClass({
    getInitialState: function() {
        return {
            locations: ['Home', 'About', 'Review', 'Configure'],            
            content: 'Home'
        }
    },
    setContentArea: function(where) {
        this.setState({ content: where });
    },
    render: function() {
        return (
            <div>
                <nav id='site-navigation' className="navbar navbar-default navbar-static-top">
                    <NavigationMenu setContentArea={this.setContentArea}
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