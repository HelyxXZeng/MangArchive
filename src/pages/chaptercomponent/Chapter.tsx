import React, { useState, useEffect } from 'react';
import './Chapter.scss';

interface Props {
    chapterNumber: any;
    data: any;
}

const Chapter: React.FC<Props> = ({ data, chapterNumber }) => {

    const getData = () => {

    };

    useEffect(() => {

    }, []);

    return (
        <div className="manga-card">
            {data.map((chap: any) => (
                <div>
                    <span>{chapterNumber}</span>
                    <span>{chap.title}</span>
                    <span>{chap.translatedLanguage}</span>
                    <h5>{chap.volume}</h5>
                </div>
            ))}
        </div>
    );
};

export default Chapter;