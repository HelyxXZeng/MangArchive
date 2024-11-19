import React, { useState, useEffect } from "react";
import "../SearchMangaPage.scss"; // Make sure this path is correct

interface TriStateCheckboxProps {
  tag: any;
  includedTags: string[];
  excludedTags: string[];
  onChange: (id: string, state: "yes" | "no" | "unchecked") => void;
}

const TriStateCheckbox: React.FC<TriStateCheckboxProps> = ({
  tag,
  includedTags,
  excludedTags,
  onChange,
}) => {
  const [state, setState] = useState<"yes" | "no" | "unchecked">("unchecked");

  useEffect(() => {
    if (includedTags.includes(tag.id)) {
      setState("yes");
    } else if (excludedTags.includes(tag.id)) {
      setState("no");
    } else {
      setState("unchecked");
    }
  }, [includedTags, excludedTags, tag.id]);

  const handleClick = () => {
    let newState: "yes" | "no" | "unchecked";
    if (state === "yes") {
      newState = "no";
    } else if (state === "no") {
      newState = "unchecked";
    } else {
      newState = "yes";
    }
    setState(newState);
    onChange(tag.id, newState);
  };

  return (
    <div onClick={handleClick} className={`tri-state-checkbox ${state}`}>
      <div className="checkbox">
        <span>{tag.attributes.name.en}</span>
      </div>
    </div>
  );
};

export default TriStateCheckbox;
