import React from 'react';

const SearchBox = ({ searchChange, keyPress }) => {
	return (
		<div className='pa2'>
			<input 
				className='pa3 ba b--green bg-lightest-blue'
				type='search' 
				placeholder='Enter a valid user id'
				onChange = {searchChange}
				onKeyPress = {keyPress}
			/>
		</div>
	);
}

export default SearchBox;