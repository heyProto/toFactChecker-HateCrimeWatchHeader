import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import TimeAgo from "react-timeago";
import ReactMarkdown from "react-markdown";

class SpanRenderer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <span>{JSON.stringify(this.props)}</span>;
  }
}

export default class HCW extends React.Component {
  constructor(props) {
    super(props);
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      optionalConfigJSON: {},
      siteConfigs: this.props.siteConfigs
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      let items_to_fetch = [axios.get(this.props.dataURL)];

      if (this.props.siteConfigURL) {
        items_to_fetch.push(axios.get(this.props.siteConfigURL));
      }

      axios.all(items_to_fetch).then(
        axios.spread((card, site_configs) => {
          let stateVar = {
            fetchingData: false,
            dataJSON: card.data,
            optionalConfigJSON: {},
            siteConfigs: site_configs
              ? site_configs.data
              : this.state.siteConfigs
          };

          this.setState(stateVar);
        })
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  renderCol4() {
    if (this.state.fetchingData) {
      return <div>Loading</div>;
    } else {
      return (
        <div id="protograph_div" className="protograph-col4-mode">
          <div className="bg" style={{ left: "0px", top: "0px" }}>
            <img
              src="https://cdn.protograph.pykih.com/786b8a918de9dc171ca6/glass-2-1x.png"
              style={{ width: "70%", height: "70%" }}
            />
          </div>
          <div className="container col-4-mode" id="incidentChart">
            <div className="large-label col-4-mode">
              {this.state.dataJSON.incidentChart.label1}
            </div>
            <br />
            <div id="label2" className="large-label col-4-mode">
              {this.state.dataJSON.incidentChart.label2}{" "}
              {this.state.dataJSON.incidentChart.label3}
            </div>
            <br />
            <div className="large-num col-4-mode">
            	{this.state.dataJSON.incidentChart.incidentNumber.toString().padStart(3, '0') || '000'}
            </div>
          </div>
          <div className="container col-4-mode" id="description">
            {this.state.dataJSON.description}
          </div>
          <div className="bg" style={{ right: "-70px", bottom: "0px" }}>
            <img
              src="https://cdn.protograph.pykih.com/786b8a918de9dc171ca6/glass-1-1x.png"
              style={{ width: "70%", height: "70%" }}
            />
          </div>
          <div className="container col-4-mode" id="deathInjuryChart">
            <div id="deaths" style={{ display: "inline-block", float: "left", paddingLeft: '10px' }}>
              <div className="small-label col-4-mode">
                {this.state.dataJSON.deathInjuryChart.deathLabel}
              </div>
              <br />
              <div className="small-num col-4-mode" style={{ paddingLeft: "10px" }}>
                {this.state.dataJSON.deathInjuryChart.deathNumber}
              </div>
            </div>
            <div
              id="injuries"
              style={{ display: "inline-block", float: "right", paddingRight: '10px' }}
            >
              <div className="small-label col-4-mode">
                {this.state.dataJSON.deathInjuryChart.injuryLabel}
              </div>
              <br />
              <div className="small-num col-4-mode" style={{ paddingLeft: "5px" }}>
                {this.state.dataJSON.deathInjuryChart.injuryNumber}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  renderCol16() {
    if (this.state.fetchingData) {
      return <div>Loading</div>;
    } else {
      let leftChartItems = this.state.dataJSON.leftChart.datapoints;
      let middleChartItems = this.state.dataJSON.middleChart.datapoints;
      let rightChartItems = this.state.dataJSON.rightChart.datapoints;
      let chartWidth = 350;
      let leftChartSum = leftChartItems.map(item => item.percentage).reduce((prev, next) => prev + next);
      let middleChartSum = middleChartItems.map(item => item.percentage).reduce((prev, next) => prev + next);
      let rightChartSum = rightChartItems.map(item => item.percentage).reduce((prev, next) => prev + next);
      let leftWidth = parseInt(100/leftChartItems.length)+'%'
      let middleWidth = parseInt(100/middleChartItems.length)+'%'
      let rightWidth = parseInt(100/rightChartItems.length)+'%'
      return (
        <div id="protograph_div" className="protograph-col16-mode">
          <div
            className="top-divs"
            style={{
              backgroundImage: "url('https://cdn.protograph.pykih.com/786b8a918de9dc171ca6/glass-2-1x.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top left"
            }}
          >
            <div
              className="number-chart"
              id="incidentChart"
              style={{ paddingTop: "20px" }}
            >
              <div>
                <div className="large-label">
                  {this.state.dataJSON.incidentChart.label1}{" "}
                  <span id="label2">
                    {this.state.dataJSON.incidentChart.label2}
                  </span>{" "}
                  <span id="label3">
                    {this.state.dataJSON.incidentChart.label3}
                  </span>
                </div>{" "}
                <div className="large-num">
                  {this.state.dataJSON.incidentChart.incidentNumber.toString().padStart(3, '0') || '000'}
                </div>
              </div>
            </div>
            <div className="number-chart" id="description">
              {this.state.dataJSON.description}
            </div>
            <div className="number-chart" id="deathInjury">
              <div style={{ float: "left", display: "inline-block" }}>
                <div className="small-label">
                  {this.state.dataJSON.deathInjuryChart.deathLabel}
                </div>
                <br />
                <div className="small-num" style={{ paddingLeft: "10px" }}>
                  {this.state.dataJSON.deathInjuryChart.deathNumber}
                </div>
              </div>
              <div style={{ float: "right" }}>
                <div className="small-label">
                  {this.state.dataJSON.deathInjuryChart.injuryLabel}
                </div>
                <br />
                <div className="small-num">
                  {this.state.dataJSON.deathInjuryChart.injuryNumber}
                </div>
              </div>
            </div>
          </div>

          <div
            className="bottom-divs"
            style={{
              backgroundImage: "url('https://cdn.protograph.pykih.com/786b8a918de9dc171ca6/glass-1-1x.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "720px -20px"
            }}
          >
            <div className="line-chart">
              {this.state.dataJSON.leftChart.label} <br />
              <div className="chart">
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(253, 0, 0, 0.8)",
                    width: (leftChartItems[0].percentage/leftChartSum) * chartWidth
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(127, 0, 0, 0.8)",
                    width: (leftChartItems[1].percentage/leftChartSum) * chartWidth
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(85, 0, 2, 0.8)",
                    width: (leftChartItems[2].percentage/leftChartSum) * chartWidth
                  }}
                />
                {(leftChartItems.length > 3) ? (<span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    width: (leftChartItems[3].percentage/leftChartSum) * chartWidth
                  }}
                />): ""}
              </div>
              <div className="labels">
                <span
                  className="chart-label"
                  style={{width: leftWidth}}
                >
                  <div className="chart-label1">{leftChartItems[0].percentage}%</div>
                  {leftChartItems[0].category}
                </span>
                <span
                  className="chart-label"
                  style={{width: leftWidth}}
                >
                  <div className="chart-label2">{leftChartItems[1].percentage}%</div>
                  {leftChartItems[1].category}
                </span>
                <span
                  className="chart-label"
                  style={{width: leftWidth}}
                >
                  <div className="chart-label3">{leftChartItems[2].percentage}%</div>
                  {leftChartItems[2].category}
                  
                </span>
                {(leftChartItems.length > 3) ? (<span
                  className="chart-label"
                  style={{width: leftWidth}}
              >
                  <div className="chart-label4">{leftChartItems[3].percentage}%</div>
                  {leftChartItems[3].category} 
                </span>) : ""}
              </div>
            </div>
            <div className="line-chart">
              {this.state.dataJSON.middleChart.label} <br />
              <div className="chart">
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(253, 0, 0, 0.8)",
                    width: (middleChartItems[0].percentage/middleChartSum) * chartWidth
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(127, 0, 0, 0.8)",
                    width: (middleChartItems[1].percentage/middleChartSum) * chartWidth
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(85, 0, 2, 0.8)",
                    width: (middleChartItems[2].percentage/middleChartSum) * chartWidth
                  }}
                />
                {(middleChartItems.length > 3) ? 
                  (<span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    width: (middleChartItems[3].percentage/middleChartSum) * chartWidth
                  }}
                />)
                  : ""
                }
                
              </div>
              <div className="labels">
                <span
                  className="chart-label"
                  style={{width: middleWidth}}
                >
                <div className="chart-label1">{middleChartItems[0].percentage}%</div>
                  {middleChartItems[0].category}
                  
                </span>
                <span
                  className="chart-label"
                  style={{width: middleWidth}}
                >
                  <div className="chart-label2">{middleChartItems[1].percentage}%</div>
                  {middleChartItems[1].category}
                  
                </span>
                <span
                  className="chart-label"
                  style={{width: middleWidth}}
                >
                  <div className="chart-label3">{middleChartItems[2].percentage}%</div>
                  {middleChartItems[2].category}
                </span>
                {(middleChartItems.length > 3) ? (<span
                  className="chart-label"
                  style={{width: middleWidth}}
                >
                  <div className="chart-label4">{middleChartItems[3].percentage}%</div>
                  {middleChartItems[3].category}
                </span>) : ""}

              </div>
            </div>
            <div className="line-chart">
              {this.state.dataJSON.rightChart.label} <br />
              <div className="chart">
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(253, 0, 0, 0.8)",
                    width: (rightChartItems[0].percentage/rightChartSum) * chartWidth
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(127, 0, 0, 0.8)",
                    width: (rightChartItems[1].percentage/rightChartSum) * chartWidth
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(85, 0, 2, 0.8)",
                    width: (rightChartItems[2].percentage/rightChartSum) * chartWidth
                  }}
                />
                {(rightChartItems.length > 3) ? (<span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    width: (rightChartItems[3].percentage/rightChartSum) * chartWidth
                  }}
                />) : ""}
              </div>
              <div className="labels">
                <span
                  className="chart-label"
                  style={{width: rightWidth}}
                >
                <div className="chart-label1">{rightChartItems[0].percentage}%</div>
                  {rightChartItems[0].category}
                  
                </span>
                <span
                  className="chart-label"
                  style={{width: rightWidth}}
                >
                  <div className="chart-label2">{rightChartItems[1].percentage}%</div>
                  {rightChartItems[1].category}
                </span>
                <span
                  className="chart-label"
                  style={{width: rightWidth}}
                >
                  <div className="chart-label3">{rightChartItems[2].percentage}%</div>
                  {rightChartItems[2].category}
                  
                </span>
                {(rightChartItems.length > 3) ? (<span
                  className="chart-label"
                  style={{width: rightWidth}}
                >
                  <div className="chart-label4">{rightChartItems[3].percentage}%</div>
                  {rightChartItems[3].category}
                </span>) : ""}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    switch (this.props.mode) {
      case "col4":
        return this.renderCol4();
        break;
      case "col16":
        return this.renderCol16();
        break;
    }
  }
}