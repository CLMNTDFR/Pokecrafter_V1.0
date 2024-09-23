import React, { useState } from 'react';

const Card = ({ artwork }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <li className="card-container" key="artwork._id">
            {isLoading ? (
                <i className='fas fa-spinner fa-spin'></i>
            ) : (
                <h2>test</h2>
            )}
        </li>
    );
};

export default Card;