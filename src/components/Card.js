import React from 'react';
import './Card.css';

const Card = ({ name, id, followClick, unfollowClick, following, group_name, total_followers }) => {
	return (
		<div className='tc bg-light-green dib br3 pa3 ma2 grow bw2 shadow-5'>
			<img alt='avatar' src={`https://robohash.org/${id}?200x200`} height="50px" width="50px"/>
			<div>
				<h2>{name}</h2>
				<h2>{group_name}</h2>
				<h3>Followers: { total_followers } </h3>
				{ !following ? <button id={"follow-button-" + id} onClick = {followClick} style={{ 'backgroundColor':'orange' }} >Follow</button> : null }
				{  following ? <button 	
										className="buttonUnfollow"
									   	onClick = {unfollowClick}>
									   	<span id={"unfollow-button-" + id} className="following">Following</span>
									   	<span id={"unfollow-button-" + id} className="unfollow">Unfollow</span>
							   	</button> : null }
			</div>
		</div>
	);
}

export default Card;