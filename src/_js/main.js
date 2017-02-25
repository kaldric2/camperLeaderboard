'esversion: 6'

var React = require('react'),
    ReactDOM = require('react-dom');

class LeaderboardTitle extends React.Component {
    render() {
        return <tr className="header1"><th colSpan="4"><a id="fccLink" target="_blank" href="http://freecodecamp.com">FreeCodeCamp</a>Camper Leaderboard</th></tr>;
    }
}

class LeaderboardHeader extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onClick(e);
    }

    render() {
        return (
            <tr className="header2">
                <th>Rank</th>
                <th>Camper Name</th>
                <th id="recent" className={(this.props.active === "recent") ? (this.props.reversed) ? "reversed" : "active" : ""} onClick={this.handleClick}>Recent Points</th>
                <th id="alltime" className={(this.props.active === "alltime") ? (this.props.reversed) ? "reversed" : "active" : ""} onClick={this.handleClick}>All-time Points</th>
            </tr>
        );
    }
}

class CamperRow extends React.Component {
    render() {
        var camperLink = "https://www.freecodecamp.com/" + this.props.username;
        return (
            <tr>
                <td>{this.props.rank}</td>
                <td><img className="camperImg" src={this.props.img}/><a href={camperLink} target="_blank">{this.props.username}</a></td>
                <td>{this.props.recent}</td>
                <td>{this.props.alltime}</td>
            </tr>
        );
    }
}

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
        this.getData = this.getData.bind(this);

        this.getData();
    }

    getData(e) { //'recent' or 'alltime'
        const urlBase = "https://fcctop100.herokuapp.com/api/fccusers/top/";
        var activeSort = e ? e.target.id : "recent";    
        var fullURL = urlBase + activeSort;

        if (this.state.active !== undefined && this.state.active === activeSort) {
            this.setState({data: this.state.data.reverse(), active: activeSort, reversed: !this.state.reversed});
        } else {
            $.getJSON(fullURL, (data) => {
                this.setState({data: data, active: activeSort, reversed: false});
            });
        }
        console.log(this.state.data);
    }

    render() {
        var rows = [];

        this.state.data.forEach((element, idx) => {
            rows.push(<CamperRow key={idx} rank={idx+1} img={element.img} username={element.username} recent={element.recent} alltime={element.alltime} />);
        });

        return (
            <div>
                <table>
                    <thead>
                        <LeaderboardTitle/>
                        <LeaderboardHeader active={this.state.active} onClick={this.getData} reversed={this.state.reversed} />
                    </thead>
                    <tbody>{rows}</tbody>
                    <tfoot><tr colSpan="4" /></tfoot>
                </table>
            </div>
        );   
    }
    
}

ReactDOM.render(<Leaderboard/>, document.getElementById("react-container"));

/*
    Leaderboard
        LeaderboardTitle
        LeaderboardHeader
        CamperRow
*/