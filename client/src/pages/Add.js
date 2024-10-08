import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LeftNav from '../components/LeftNav';
import { UidContext } from '../components/AppContext';
import NewArtworkForm from '../components/Artwork/NewArtworkForm';

const Add = () => {
    const uid = useContext(UidContext);

    return (
        <div className="home">
            <LeftNav />
            <div className='main'>
                <div className='home-header'>
                    {uid ? (
                        <NewArtworkForm />
                    ) : (
                        <div className="centered-container">
                            <Link to="/profil" className="please-login">
                                Please Login to add a new artwork
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Add;
