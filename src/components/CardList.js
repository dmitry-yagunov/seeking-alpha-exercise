import React from 'react';
import Card from './Card'

const CardList = ({ users, followClick, unfollowClick, following }) => {
	// Build a html string with from all users
	// by building a collection of Card objects and populating them with data from users & following collections
	return ( 
			<div>
				{ 
					users.map((item, i) => {
						return (
							<Card 
								key = { users[i].user_id }  
								id = { users[i].user_id } 
								name = { users[i].user_name } 
								followClick = { followClick }
								unfollowClick = { unfollowClick }
								// is it bookmarked - check if repo id is in bookmarks array
								following = { following.includes(users[i].user_id.toString())}
								group_name = { users[i].group_name == null ? "None" : users[i].group_name } 
								total_followers = { users[i].total_followers == null ? 0 : users[i].total_followers } 
							/>
						);
					})
				}
			</div>
		);
}

export default CardList;