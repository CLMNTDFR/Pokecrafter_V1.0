import React, { useContext } from 'react';
import Log from "../components/Log";
import { UidContext } from "../components/AppContext";

const Profil = () => {
    const iud = React.useContext(UidContext);

    return (
        <div className="profil-page">
            {uid ? (
                <h1>Update Page</h1>
            ) : (
            <div className="log-container">
                <Log signin={false} signup={true} />
                <div className="img-container">
                    <img src="./img/log.svg" alt="Profil image pokeball" />
                </div>
            </div>
        )}
        </div>
    );
};

export default Profil;