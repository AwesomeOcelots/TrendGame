import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import Layout from './components/Layout';
var Loader = require('halogen/PulseLoader');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      start: '',
      end: '',
      trend: '',
      originalStories: {},
      storyPoint: {},
      loader: false,
      history: [],
      related: []
    };
    this.collectData = this.collectData.bind(this);
  }

  componentDidMount() {
    this.getSearchHistory();
  }

  collectData(trend) {
    this.setState({
      loader: <div className="text-center"><Loader color="#dc3c3c" size="16px" margin="4px"/></div>,
      storyPoint: {}
    });
    axios.get('/api/timeline', {
      params: { q: trend }
    })
    .then(response => {
      if (response.data.timeline === null) {
        this.setState({
          loader: <div className="text-center"><h6>Sorry, try a less obscure trend.</h6></div>
        });
      } else {
        let timeline = response.data.timeline;
        let trendCapitalized = response.data.trend[0].toUpperCase() + response.data.trend.slice(1);
        this.setState({
          trend: trendCapitalized,
          start: timeline[0].date,
          end: timeline[timeline.length - 1].date,
          originalStories: JSON.stringify(this.findStoryPoint(timeline)), 
          storyPoint: this.findStoryPoint(timeline),
          data: this.makeChartPoints(timeline),
          related: response.data.related,
          loader: false
        });
        return this.postSearchHistory(trend);
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  makeChartPoints (timeline) {
    let dataTuple = [['Date', 'Popularity', {'type': 'string', 'role': 'style'}]];
    timeline.forEach( point => {
      if (point.stories) {
        dataTuple.push( [new Date(point.date * 1000), point.popularity, 'point { size: 6; shape-type: diamond; visible: true; }'] );
      } else {
        dataTuple.push( [new Date(point.date * 1000), point.popularity, null] );
      }
    });
    return dataTuple;
  }

  changeStories(direction) {
    let trend = this.state.trend;
    let time = this.state.storyPoint.date
  
    axios.get('/api/stories', {
      params: { 
        trend: trend,
        time: time,
        direction: direction
      }
    })
    .then(response => {
      var newStoryPoint = this.state.storyPoint;
      newStoryPoint.stories = response.data[0].stories;
      this.setState({
        storyPoint: newStoryPoint
      });
    })
  }

  changeBack() {
    this.setState({
      storyPoint: JSON.parse(this.state.originalStories)
    })
  }

  findStoryPoint (timeline) {
    for (let point of timeline) {
      if ('stories' in point) {
        return point;
      }
    }
  }

  getSearchHistory() {
    axios.get('/api/history')
    .then(response => {
      this.setState({
        history: response.data
      });
    });
  }

  postSearchHistory(trend) {
    axios.post('/api/history', {
      search: trend
    }).then(response => {
      this.getSearchHistory();
    }).catch(err => {
      console.log(err);
    });
  }

  render () {
    return (
      <Layout
        chartData={this.state}
        collectData={this.collectData}
        storyPoint={this.state.storyPoint}
        history={this.state.history}
        related={this.state.related}
        changeStories={this.changeStories.bind(this)}
        changeBack={this.changeBack.bind(this)}
      />
    );
  }
}

render(<App/>, document.getElementById('app'));

