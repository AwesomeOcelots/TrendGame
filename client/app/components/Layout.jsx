import React from 'react';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';

const Layout = ({ chartData, collectData, storyPoint, history, related}) => {
  return (
    <div>
      <div className="container">
        <Header/>
        <Body
          chartData={chartData}
          collectData={collectData}
          storyPoint={storyPoint}
          history={history}
          related={related}
        />
      </div>
      <Footer/>
    </div>
  );
};

export default Layout;
