import React from 'react';

interface SEOStructuredDataProps {
  data: Record<string, any>;
}

export const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
