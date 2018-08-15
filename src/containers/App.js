import React, { Component } from 'react';
import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';

class App extends Component {
	constructor() {
		super()
		this.state = {
			users: [], 					// 
			userIdToLogin: '',			// 
			loggedInUserId: 0,
			loggedInUserName: '',
			loggedInUserGroup: '',
			loggedInUserGroupName: '',
			following: []				// Ids of followed users
		}
	}

	componentDidMount() {
		fetch('http://localhost:3001/users')
            .then(response => response.json())
            .then(console.log); 
	}

	// On each new character entered in seach field update state searchField property
	onSearchChange = (event)  => {
		this.setState({ userIdToLogin: event.target.value })
	}

	// On search run API, save results to state repos property
	onLoginClick = (event) => {
		fetch('http://localhost:3001/signin', {
			method: 'post',
          	headers: {'Content-Type': 'application/json'},
          	body: JSON.stringify({
            	id: this.state.userIdToLogin
          	}) 
		})
        .then(response => response.json())
        .then(data => {
        	if (data === 'Not Found' || data.user_id == null) {
        		alert("wrong user id");
        	}
        	else {
        		this.setState({loggedInUserId : data.user_id});
        		this.setState({loggedInUserName : data.user_name});
        		this.setState({loggedInUserGroup : data.group_id});
        		this.setState({loggedInUserGroupName : data.group_name});

        		fetch('http://localhost:3001/users')
            		.then(response => response.json())
            		.then(users => {
            			this.setState({users: users})
            		});

        		fetch('http://localhost:3001/followers', {
					method: 'post',
		          	headers: {'Content-Type': 'application/json'},
		          	body: JSON.stringify({
		            	userId: this.state.loggedInUserId
		          	}) 
				})
		        .then(response => response.json())
		        .then(data => {
					console.log(data);
					var newfollowing = [];
					for (var i = 0; i < data.length; i++) {
    					newfollowing.push(data[i]['user_id_following'].toString());
    					
					} 
					this.setState({ following: newfollowing });
    				console.log(this.state.following);
		        });
        	}
        });
	}

	// We come here from card bookmark click, card represents a single repository
	onFollowClick = (event) => {
		// Take repo id from button id
		var newFollowId = event.target.id.split("-")[2];
		
		// Add it to bookmarks state property if its not already there
		if (!this.state.following.includes(newFollowId.toString())) {
			this.state.following.push(newFollowId);

			fetch('http://localhost:3001/follow', {
					method: 'post',
		          	headers: {'Content-Type': 'application/json'},
		          	body: JSON.stringify({
		            	user_id: this.state.loggedInUserId,
		            	user_id_following: newFollowId
		          	}) 
				})
			.then(this.setState({following: this.state.following }));

			for (var i = 0; i < this.state.users.length; i++) {
				if (this.state.users[i].user_id.toString() === newFollowId.toString()) {
					this.state.users[i].total_followers++;
					this.setState({users: this.state.users});
				}
			}
		}
	}

	// We come here from card bookmark click, card represents a single repository
	onUnfollowClick = (event) => {
		console.log('ID:' + event.target.id);
		var newUnfollowId = event.target.id.split("-")[2];
		
		// Add it to bookmarks state property if its not already there
		if (this.state.following.includes(newUnfollowId.toString())) {
			var newfollowing = [];

			for (var i = 0; i < this.state.following.length; i++) {
				if (this.state.following[i] !== newUnfollowId) {
					newfollowing.push(this.state.following[i]);
				}
			}
			
			fetch('http://localhost:3001/unfollow', {
					method: 'post',
		          	headers: {'Content-Type': 'application/json'},
		          	body: JSON.stringify({
		            	user_id: this.state.loggedInUserId,
		            	user_id_following: newUnfollowId
		          	}) 
				})
			.then(this.setState({following: newfollowing }));

			for (var i = 0; i < this.state.users.length; i++) {
				if (this.state.users[i].user_id.toString() === newUnfollowId.toString()) {
					this.state.users[i].total_followers--;
					this.setState({users: this.state.users});
				}
			}
		}
	}

	// on 'Only Show Bookmarked' click save value to showOnlyBookmarked state property
	onOnlyFollowedChange = (event) => {
		this.setState({showOnlyFollowed: event.target.checked})
	}

	// run search on enter
	onKeyPress = (event) => {
		if (event.key === "Enter") {
			this.onSearchClick(event);
		}
	}

	/* Main render
	 		[User ID]
	 ----------------------------------------------
	 Scroll container
	 	CardList container - each Card represents a repository fetched from API
	 		Each Card - Avatar
	 				  - name
	 				  - Follow / Unfollow button
	 |    [ Repo 1 ]       [ Repo 2 ]
	 |    [ Repo 1 ]       [ Repo 2 ]
	 |    [ Repo 1 ]       [ Repo 2 ]

	 |    [ Repo 3 ]       [ Repo 4 ]
	 |    [ Repo 3 ]       [ Repo 4 ]
	 |    [ Repo 3 ]       [ Repo 4 ]
	
	.....
	-----------------------------------------------
	*/ 
	render() {
		const { users, following, loggedInUserId } = this.state;

		return (
			<div className='tc'>
				<h1>Users</h1>
				<SearchBox searchChange = {this.onSearchChange} keyPress = {this.onKeyPress}/>
				<button onClick = {this.onLoginClick}>Login</button>
				<Scroll>
					{ loggedInUserId === 0 ? <h1>Must be signed in to see users</h1> :
						<div> 
							<h1>Welcome, { this.state.loggedInUserName }. You belong to group {this.state.loggedInUserGroupName } </h1>
							<h2>Choose users to follow</h2>
						</div>
					}
					<CardList users = { users } 
					          followClick = { this.onFollowClick}
					          unfollowClick = { this.onUnfollowClick }
					          following = { following } />
				</Scroll>
			</div>
		);
	}
}

export default App; 