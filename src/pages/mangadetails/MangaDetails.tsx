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
            <div>
                <button>
                    <span>Add To Library</span>
                </button>
                <div>
                    <div>
                        <button>
                            <span>Hello</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MangaDetails;
