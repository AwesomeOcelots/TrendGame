import React from 'react';

export default class Header extends React.Component {
  render () {
    return (
      <div className="row">
        <div className="col mt-4 mb-4 text-center">
          <h1>TrendGame</h1>
        <span style={{textAlign:'left'}}>
        <a href="/auth/facebook">Login with Facebook</a>
        <a href="/auth/google" ><span></span> Google</a><br/>
        <a href="/auth/twitter">Log In with Twitter</a>
        </span>
        <span style={{textAlign:'right'}}>
         <br/> <a href='/logout'>Logout</a>
        </span>
          <p className="text-muted">
            Find out <strong>when</strong> interest in a topic peaked and <strong>why.</strong>
          </p>
        </div>
      </div>
    );
  }
}
