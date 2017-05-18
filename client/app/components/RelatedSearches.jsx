import React from 'react';
import RelatedSearch from './RelatedSearch';

const RelatedSearches = ({ related, collectData }) => {
  return (
    <div className="row mb-5">
      <div className="col text-center">
        <small>Related searches</small>
        <ul className="list-inline text-center text-muted">
          {related.map((term, index) => {
            return <RelatedSearch key={term} term={term} index={index} collectData={collectData}/>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default RelatedSearches;
