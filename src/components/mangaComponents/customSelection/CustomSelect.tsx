import React, { useState } from 'react';
import './CustomSelect.scss';

interface Props {
    options: any,
    value: any,
    onChange: any,
    color: any
}

const CustomSelect: React.FC<Props> = ({ options, value, onChange, color }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option: any) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="custom-select-container">
            <div className={color === 'orange' ? "custom-select-header2" : "custom-select-header"} onClick={() => setIsOpen(!isOpen)}>
                {value || 'Select an option'}
            </div>
            {isOpen && (
                <div className={color === 'orange' ? "custom-select-options2" : "custom-select-options"}>
                    {options.map((option: any) => (
                        <div
                            key={option}
                            className={color === 'orange' ? "custom-select-option2" : "custom-select-option"}
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
