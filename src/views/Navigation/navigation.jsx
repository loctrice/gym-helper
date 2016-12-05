
export class Item extends React.Component{
    render() {
        return (
            <li className={this.props.activeClass}>
                <a href='#' onClick={this.props.updateNavigation}>{this.props.text}</a>
            </li>
        );
    }
};

export class Navigation extends React.Component({
    getInitialState() {
        return {
            active: this.props.active,
        };
    },
    updateActiveLink(event) {
        event.preventDefault();
        var thisValue = event.target.text;
        if (this.state.active !== thisValue) {
            this.setState({ active: thisValue });
        }
        this.props.setContentArea(thisValue);
    },
    render() {
        var self = this;
        var links = this.props.locations.map(function(item) {
            var active = (item === self.state.active) ? 'active' : '';
            return (
                <Item activeClass={active} text={item} updateNavigation={self.updateActiveLink}/>
            );
        });
        return (
            <div>
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false"
                        aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#">Workout Program</a>
                </div>
                <div id="navbar" className="navbar-collapse collapse">

                    <ul className="nav navbar-nav">
                        {links}
                    </ul>

                    <ul className="nav navbar-nav navbar-right">
                    </ul>
                </div>
            </div>
        )
    }
};

