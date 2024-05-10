import React, { useState, useEffect } from 'react';
import './Tag.scss';

interface Props {
    tag: any,
}

const Tag: React.FC<Props> = ({ tag }) => {
  return (
    <span className="tag" key={tag.id}>{tag.attributes.name.en}</span>
  );
};

export default Tag;