import React, { useState, useEffect } from "react";
import "./Tag.scss";
import { NavLink, useNavigate } from "react-router-dom";

interface Props {
  tag: any;
  includedTags?: string[];
}

const Tag: React.FC<Props> = ({ tag, includedTags = [] }) => {
  const isTagIncluded = includedTags.includes(tag.id);
  const tagStyle = {
    backgroundColor: isTagIncluded ? '#FFC122' : '',
  };

  return (
    <NavLink
      to={`/search?includedTags=${tag.id}`}
      style={{ textDecoration: "none", width: "fit-content" }}
    >
      <span className="tag" key={tag.id} style={tagStyle}>
        {tag.attributes.name.en}
      </span>
    </NavLink>
  );
};

export default Tag;
