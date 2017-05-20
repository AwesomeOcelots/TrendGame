import React from 'react';
import Body from './Body';
import Footer from './Footer';
import Header from './Header';

const Layout = ({ chartData, collectData, storyPoint, history, related, changeStories, changeBack }) => {
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
          changeStories={changeStories}
          changeBack={changeBack}
        />
      </div>
      <Footer/>
    </div>
  );
};

export default Layout;
