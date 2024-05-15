import React, { useState, useEffect } from 'react';
import './Chapter.scss';

interface Props {
    chapterNumber: any;
    data: any;
}

const Chapter: React.FC<Props> = ({ data, chapterNumber }) => {
    const [show, setShow] = useState(true);

    const getData = () => {

    };

    const onShow = () => {
        setShow(!show);
    }

    useEffect(() => {

    }, []);

    return (
        <div className="chapter-card">
            <div className='chapter-number' onClick={onShow}>
                <h2>{'Chapter ' + chapterNumber}</h2>
            </div>
            {data.map((chap: any, index: number) => (
                <div className={`chapter-data ${show ? 'show' : ''}`} key={index}>
                    <div style={{ width: '5px', backgroundColor: 'yellow', display: 'none' }}></div>
                    <h3>{chap.translatedLanguage}</h3>
                    <p>{chap.title ? chap.title : ('Ch.' + chapterNumber)}</p>
                </div>
            ))}
        </div>
    );
};

export default Chapter;