import React, { useContext } from 'react';
import Log from "../components/Log";
import { UidContext } from "../components/AppContext";
import UpdateProfil from '../components/Profil/UpdateProfil';
import LeftNav from "../components/LeftNav";

const Profil = () => {
    const uid = useContext(UidContext);

    return (
        <div>
            <div className="home">
                <LeftNav />
            </div>

            <div className="profil-page">
                {uid ? (
                    <UpdateProfil />
                ) : (
                    <div className="log-container">
                        <Log signin={false} signup={true} />
                        <div className="img-container">
                            <img src="./img/pokecrafter-log3.svg" alt="Pokeball" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profil;
