import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Manga from "../manga/Manga";
import MangaBanner from '../mangabanner/MangaBanner';
import "./MangaDetails.scss";

const MangaDetails = (manga: any) => {

    const getData = async () => {

    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="mainHomepage">
            <MangaBanner manga={manga} />
        </div>
    );
}
export default MangaDetails;
