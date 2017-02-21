var React = require('react'),
    ReactDOM = require('react-dom');

class LeaderboardTitle extends React.Component {
    render() {
        return <tr><th colSpan="4">Leaderboard</th></tr>;
    }
}

class LeaderboardHeader extends React.Component {
    render() {
        return (
            <tr>
                <th>Rank</th>
                <th>Camper Name</th>
                <th id="recent">Recent Points</th>
                <th id="alltime">All-time Points</th>
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
                <td><img src={this.props.img}/><a href={camperLink}>{this.props.username}</a></td>
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
        var fullURL = urlBase;
        if (e) {
            fullURL += e.target.id;
        } else {
            fullURL += "recent";
        }

        $.getJSON(fullURL, (data) => {
            this.setState({data: data});
            console.log(data);
        });
    }

    render() {
        var rows = [];
        this.state.data.forEach((element, idx) => {
            rows.push(<CamperRow key={idx} rank={idx+1} img={element.img} username={element.username} recent={element.recent} alltime={element.alltime} />);
        })
        return (
            <div>
                <table>
                    <thead>
                        <LeaderboardTitle/>
                        <LeaderboardHeader/>
                    </thead>
                    <tbody>{rows}</tbody>
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