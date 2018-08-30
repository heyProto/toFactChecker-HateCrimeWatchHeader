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

export default class toCluster extends React.Component {
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
    return document.getElementById("protograph_div").getBoundingClientRect();
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
              src="dist/0.0.1/glass-2-1x.png"
              style={{ width: "70%", height: "70%" }}
            />
          </div>
          <div className="container" id="incidentChart">
            <div className="large-label">
              {this.state.dataJSON.data.incidentChart.label1}
            </div>
            <br />
            <div id="label2" className="large-label">
              {this.state.dataJSON.data.incidentChart.label2}{" "}
              {this.state.dataJSON.data.incidentChart.label3}
            </div>
            <br />
            <div className="large-num">
              {this.state.dataJSON.data.incidentChart.incidentNumber}
            </div>
          </div>
          <div className="container" id="description">
            {this.state.dataJSON.description}
          </div>
          <div className="bg" style={{ right: "-70px", bottom: "0px" }}>
            <img
              src="dist/0.0.1/glass-1-1x.png"
              style={{ width: "70%", height: "70%" }}
            />
          </div>
          <div className="container" id="deathInjuryChart">
            <div id="deaths" style={{ display: "inline-block", float: "left" }}>
              <div className="small-label">
                {this.state.dataJSON.data.deathInjuryChart.deathLabel}
              </div>
              <br />
              <div className="small-num" style={{ paddingLeft: "15px" }}>
                {this.state.dataJSON.data.deathInjuryChart.deathNumber}
              </div>
            </div>
            <div
              id="injuries"
              style={{ display: "inline-block", float: "right" }}
            >
              <div className="small-label">
                {this.state.dataJSON.data.deathInjuryChart.injuryLabel}
              </div>
              <br />
              <div className="small-num" style={{ paddingLeft: "5px" }}>
                {this.state.dataJSON.data.deathInjuryChart.injuryNumber}
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
      let leftChartItems = this.state.dataJSON.data.leftLineChart.datapoints.items;
      let middleChartItems = this.state.dataJSON.data.middleLineChart.datapoints.items;
      let rightChartItems = this.state.dataJSON.data.rightLineChart.datapoints.items;
      return (
        <div id="protograph_div" className="protograph-col16-mode">
          <div
            className="top-divs"
            style={{
              backgroundImage: "url('dist/0.0.1/glass-2-1x.png')",
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
                  {this.state.dataJSON.data.incidentChart.label1}{" "}
                  <span id="label2">
                    {this.state.dataJSON.data.incidentChart.label2}
                  </span>{" "}
                  <span id="label3">
                    {this.state.dataJSON.data.incidentChart.label3}
                  </span>
                </div>{" "}
                <div className="large-num">
                  {this.state.dataJSON.data.incidentChart.incidentNumber}
                </div>
              </div>
            </div>
            <div className="number-chart" id="description">
              {this.state.dataJSON.description}
            </div>
            <div className="number-chart" id="deathInjury">
              <div style={{ float: "left", display: "inline-block" }}>
                <div className="small-label">
                  {this.state.dataJSON.data.deathInjuryChart.deathLabel}
                </div>
                <br />
                <div className="small-num" style={{ paddingLeft: "10px" }}>
                  {this.state.dataJSON.data.deathInjuryChart.deathNumber}
                </div>
              </div>
              <div style={{ float: "right" }}>
                <div className="small-label">
                  {this.state.dataJSON.data.deathInjuryChart.injuryLabel}
                </div>
                <br />
                <div className="small-num">
                  {this.state.dataJSON.data.deathInjuryChart.injuryNumber}
                </div>
              </div>
            </div>
          </div>

          <div
            className="bottom-divs"
            style={{
              backgroundImage: "url('dist/0.0.1/glass-1-1x.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "720px -20px"
            }}
          >
            <div className="line-chart">
              {this.state.dataJSON.data.leftLineChart.label} <br />
              <div className="chart">
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(253, 0, 0, 0.8)",
                    width: leftChartItems[0].percentage * 3
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(127, 0, 0, 0.8)",
                    width: leftChartItems[1].percentage * 3
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(85, 0, 2, 0.8)",
                    width: leftChartItems[2].percentage * 3
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    width: leftChartItems[3].percentage * 3
                  }}
                />
              </div>
              <div className="labels">
                <span
                  className="chart-label"
                  style={{ width: leftChartItems[0].percentage * 3 }}
                >
                  {leftChartItems[0].category} <br />{" "}
                  {leftChartItems[0].percentage}%
                </span>
                <span
                  className="chart-label"
                  style={{ width: leftChartItems[1].percentage * 3 }}
                >
                  {leftChartItems[1].category} <br />{" "}
                  {leftChartItems[1].percentage}%
                </span>
                <span
                  className="chart-label"
                  style={{ width: leftChartItems[2].percentage * 3 }}
                >
                  {leftChartItems[2].category} <br />{" "}
                  {leftChartItems[2].percentage}%
                </span>
                <span
                  className="chart-label"
                  style={{ width: leftChartItems[3].percentage * 3 }}
                >
                  {leftChartItems[3].category} <br />{" "}
                  {leftChartItems[3].percentage}%
                </span>
              </div>
            </div>
            <div className="line-chart">
              {this.state.dataJSON.data.middleLineChart.label} <br />
              <div className="chart">
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(253, 0, 0, 0.8)",
                    width: middleChartItems[0].percentage * 3
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(127, 0, 0, 0.8)",
                    width: middleChartItems[1].percentage * 3
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(85, 0, 2, 0.8)",
                    width: middleChartItems[2].percentage * 3
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    width: middleChartItems[3].percentage * 3
                  }}
                />
              </div>
              <div className="labels">
                <span
                  className="chart-label"
                  style={{ width: middleChartItems[0].percentage * 3 }}
                >
                  {middleChartItems[0].category} <br />{" "}
                  {middleChartItems[0].percentage}%
                </span>
                <span
                  className="chart-label"
                  style={{ width: middleChartItems[1].percentage * 3 }}
                >
                  {middleChartItems[1].category} <br />{" "}
                  {middleChartItems[1].percentage}%
                </span>
                <span
                  className="chart-label"
                  style={{ width: middleChartItems[2].percentage * 3 }}
                >
                  {middleChartItems[2].category} <br />{" "}
                  {middleChartItems[2].percentage}%
                </span>
                <span
                  className="chart-label"
                  style={{ width: middleChartItems[3].percentage * 3 }}
                >
                  {middleChartItems[3].category} <br />{" "}
                  {middleChartItems[3].percentage}%
                </span>
              </div>
            </div>
            <div className="line-chart">
              {this.state.dataJSON.data.rightLineChart.label} <br />
              <div className="chart">
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(253, 0, 0, 0.8)",
                    width: rightChartItems[0].percentage * 3
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(127, 0, 0, 0.8)",
                    width: rightChartItems[1].percentage * 3
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(85, 0, 2, 0.8)",
                    width: rightChartItems[2].percentage * 3
                  }}
                />
                <span
                  className="chart-span"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    width: rightChartItems[3].percentage * 3
                  }}
                />
              </div>
              <div className="labels">
                <span
                  className="chart-label"
                  style={{ width: rightChartItems[0].percentage * 3 }}
                >
                  {rightChartItems[0].category} <br />{" "}
                  {rightChartItems[0].percentage}%
                </span>
                <span
                  className="chart-label"
                  style={{ width: rightChartItems[1].percentage * 3 }}
                >
                  {rightChartItems[1].category} <br />{" "}
                  {rightChartItems[1].percentage}%
                </span>
                <span
                  className="chart-label"
                  style={{ width: rightChartItems[2].percentage * 3 }}
                >
                  {rightChartItems[2].category} <br />{" "}
                  {rightChartItems[2].percentage}%
                </span>
                <span
                  className="chart-label"
                  style={{ width: rightChartItems[3].percentage * 3 }}
                >
                  {rightChartItems[3].category} <br />{" "}
                  {rightChartItems[3].percentage}%
                </span>
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