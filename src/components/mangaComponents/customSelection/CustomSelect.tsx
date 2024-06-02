import React, { useState } from 'react';
import './CustomSelect.scss';

interface Props {
    options: any,
    value: any,
    onChange: any
}

const CustomSelect: React.FC<Props> = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option: any) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="custom-select-container">
            <div className="custom-select-header" onClick={() => setIsOpen(!isOpen)}>
                {value || 'Select an option'}
            </div>
            {isOpen && (
                <div className="custom-select-options">
                    {options.map((option: any) => (
                        <div
                            key={option}
                            className="custom-select-option"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
