import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Card = ({ artwork }) => {
    const [isLoading, setIsLoading] = useState(true);
    const usersData = useSelector((state) => state.usersReducer);

    useEffect(() => {
        if (usersData && usersData.length > 0) {
            setIsLoading(false);
        }
    }, [usersData]);

    const poster = usersData.find((user) => user._id === artwork?.posterId);
    const posterPicture = poster?.picture || process.env.PUBLIC_URL + "/img/uploads/profil/random-user.png";

    return (
        <li className="card-container" key={artwork?._id}>
            {isLoading ? (
                <i className='fas fa-spinner fa-spin'></i>
            ) : (
                <>
                    <div className="card-left">
                        <img 
                            src={posterPicture} 
                            alt={poster ? poster.username : "Unknown user"} 
                        />
                    </div>
                    <div className="card-right">
                        <div className="card-header">
                            <div className="pseudo">
                                <h3>
                                    {poster ? poster.username : "Unknown"}
                                </h3>
                            </div>
                        </div>
                        <p>{artwork?.description}</p>
                        {artwork?.picture && (
                            <img 
                                src={artwork.picture} 
                                alt={artwork.title || "Artwork"} 
                            />
                        )}
                    </div>
                </>
            )}
        </li>
    );
};

export default Card;
