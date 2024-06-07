import React, { useState, useEffect } from "react";
import "./Tag.scss";
import { NavLink, useNavigate } from "react-router-dom";

interface Props {
  tag: any;
}

const Tag: React.FC<Props> = ({ tag }) => {
  // const navigate = useNavigate();
  // const [tagParam, setTagParam] = useState('');

  // const handleRandomClick = async () => {
  //   const tags = [tag.id];
  //   const params = new URLSearchParams();
  //   tags.forEach(tag => params.append("tags", tag));
  //   navigate(`/search?${params.toString()}`);
  // };

  // useEffect(() => {
  //   const tags = [tag.id];
  //   const params = new URLSearchParams();
  //   tags.forEach(tag => params.append("tags", tag));
  //   setTagParam(params.toString());
  //   // navigate(`/search?${params.toString()}`);
  // }, []);

  return (
    <NavLink
      to={`/search?tags=${tag.id}`}
      style={{ textDecoration: "none", width: "fit-content" }}
    >
      <span className="tag" key={tag.id}>
        {tag.attributes.name.en}
      </span>
    </NavLink>
  );
};

export default Tag;
