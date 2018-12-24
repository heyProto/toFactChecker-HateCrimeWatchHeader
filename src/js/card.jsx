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
            <div id="label2" className="large-label col-4-mode">
              {this.state.dataJSON.data.incidentChart.label2}{" "}
              {this.state.dataJSON.data.incidentChart.label3}{" "}
              <div id="label4" className="col-4-mode">
                {this.state.dataJSON.data.incidentChart.incidentYears}
              </div>
            </div>
            <br />
            <div className="large-num col-4-mode">
              {this.state.dataJSON.data.incidentChart.incidentNumber
                .toString()
                .padStart(3, "0") || "000"}
            </div>
          </div>
          <div className="container col-4-mode" id="description">
            {this.state.dataJSON.data.description}
          </div>
          <div className="bg" style={{ right: "-70px", bottom: "0px" }}>
            <img
              src="https://cdn.protograph.pykih.com/786b8a918de9dc171ca6/glass-1-1x.png"
              style={{ width: "70%", height: "70%" }}
            />
          </div>
          <div className="container col-4-mode" id="deathInjuryChart">
            <div
              id="deaths"
              style={{
                display: "inline-block",
                float: "left",
                paddingLeft: "10px"
              }}
            >
              <div className="small-label col-4-mode">
                {this.state.dataJSON.data.deathInjuryChart.deathLabel}
              </div>
              <br />
              <div
                className="small-num col-4-mode"
              >
                {this.state.dataJSON.data.deathInjuryChart.deathNumber}
              </div>
            </div>
            <div
              id="injuries"
              style={{
                display: "inline-block",
                float: "right",
                paddingRight: "10px"
              }}
            >
              <div className="small-label col-4-mode">
                {this.state.dataJSON.data.deathInjuryChart.injuryLabel}
              </div>
              <br />
              <div
                className="small-num col-4-mode"
              >
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
      let leftChartItems = this.state.dataJSON.data.leftChart.datapoints;
      let middleChartItems = this.state.dataJSON.data.middleChart.datapoints;
      let rightChartItems = this.state.dataJSON.data.rightChart.datapoints;
      let chartWidth = 370;
      let leftChartSum = leftChartItems
        .map(item => item.percentage)
        .reduce((prev, next) => prev + next);
      let middleChartSum = middleChartItems
        .map(item => item.percentage)
        .reduce((prev, next) => prev + next);
      let rightChartSum = rightChartItems
        .map(item => item.percentage)
        .reduce((prev, next) => prev + next);
      let labelWidth = "25%";

      return (
        <div id="protograph_div" className="protograph-col16-mode">
          <div className="content">
            <div
              className="top-divs"
              style={{
                backgroundImage:
                  "url('https://cdn.protograph.pykih.com/786b8a918de9dc171ca6/glass-2-1x.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top left"
              }}
            >
              <div
                className="number-chart"
                id="incidentChart"
              >
                <div>
                  <div className="large-label">
                    <div className="label2">
                      {this.state.dataJSON.data.incidentChart.label2}
                    </div>{" "}
                    <div className="label3">
                      {this.state.dataJSON.data.incidentChart.label3}
                    </div>
                    <div className="label4">
                      {this.state.dataJSON.data.incidentChart.incidentYears}
                    </div>
                  </div>{" "}
                  <div className="large-num">
                    {this.state.dataJSON.data.incidentChart.incidentNumber
                      .toString()
                      .padStart(3, "0") || "000"}
                  </div>
                </div>
              </div>
              <div className="number-chart" id="description">
                {this.state.dataJSON.data.description}
              </div>
              <div className="number-chart" id="deathInjury">
                <div style={{ display: "inline-block", paddingLeft: "25px" }}>
                  <div className="small-label">
                    {this.state.dataJSON.data.deathInjuryChart.deathLabel}
                  </div>
                  <br />
                  <div className="small-num">
                    {this.state.dataJSON.data.deathInjuryChart.deathNumber}
                  </div>
                </div>
                <div style={{ float: "right", paddingRight: "25px" }}>
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
                backgroundImage:
                  "url('https://cdn.protograph.pykih.com/786b8a918de9dc171ca6/glass-1-1x.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "720px -20px"
              }}
            >
              <div className="line-chart">
                {this.state.dataJSON.data.leftChart.label} (%)
                <br />
                <div className="chart">
                  <span
                    className="chart-span1"
                    style={{
                      width:
                        (leftChartItems[0].percentage / leftChartSum) *
                        chartWidth
                    }}
                  >
                    {leftChartItems[0].percentage}
                  </span>
                  <span
                    className="chart-span2"
                    style={{
                      width:
                        (leftChartItems[1].percentage / leftChartSum) *
                        chartWidth
                    }}
                  >
                    {leftChartItems[1].percentage}
                  </span>
                  <span
                    className="chart-span3"
                    style={{
                      width:
                        (leftChartItems[2].percentage / leftChartSum) *
                        chartWidth
                    }}
                  >
                    {leftChartItems[2].percentage}
                  </span>
                  {leftChartItems.length > 3 ? (
                    <span
                      className="chart-span4"
                      style={{
                        width:
                          (leftChartItems[3].percentage / leftChartSum) *
                          chartWidth
                      }}
                    >
                      {leftChartItems[3].percentage}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="labels">
                  <span
                    className="chart-label"
                    style={{
                      width: labelWidth,
                      display:
                        leftChartItems[0].percentage > 0
                          ? "inline-block"
                          : "none"
                    }}
                  >
                    <div className="chart-label1" />
                    <div className="label-text">
                      {leftChartItems[0].category}
                    </div>
                  </span>
                  <span
                    className="chart-label"
                    style={{
                      width: labelWidth,
                      display:
                        leftChartItems[1].percentage > 0
                          ? "inline-block"
                          : "none"
                    }}
                  >
                    <div className="chart-label2" />
                    <div className="label-text">
                      {leftChartItems[1].category}
                    </div>
                  </span>
                  <span
                    className="chart-label"
                    style={{
                      width: labelWidth,
                      display:
                        leftChartItems[2].percentage > 0
                          ? "inline-block"
                          : "none"
                    }}
                  >
                    <div className="chart-label3" />
                    <div className="label-text">
                      {leftChartItems[2].category}
                    </div>
                  </span>
                  {leftChartItems.length > 3 ? (
                    <span
                      className="chart-label"
                      style={{
                        width: labelWidth,
                        display:
                          leftChartItems[3].percentage > 0
                            ? "inline-block"
                            : "none"
                      }}
                    >
                      <div className="chart-label4" />
                      <div className="label-text">
                        {leftChartItems[3].category}
                      </div>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="line-chart">
                {this.state.dataJSON.data.middleChart.label} (%)
                <br />
                <div className="chart">
                  <span
                    className="chart-span1"
                    style={{
                      width:
                        (middleChartItems[0].percentage / middleChartSum) *
                        chartWidth
                    }}
                  >
                    {middleChartItems[0].percentage}
                  </span>
                  <span
                    className="chart-span2"
                    style={{
                      width:
                        (middleChartItems[1].percentage / middleChartSum) *
                        chartWidth
                    }}
                  >
                    {middleChartItems[1].percentage}
                  </span>
                  <span
                    className="chart-span3"
                    style={{
                      width:
                        (middleChartItems[2].percentage / middleChartSum) *
                        chartWidth
                    }}
                  >
                    {middleChartItems[2].percentage}
                  </span>
                  {middleChartItems.length > 3 ? (
                    <span
                      className="chart-span4"
                      style={{
                        width:
                          (middleChartItems[3].percentage / middleChartSum) *
                          chartWidth
                      }}
                    >
                      {middleChartItems[3].percentage}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="labels">
                  <span
                    className="chart-label"
                    style={{
                      width: labelWidth,
                      display:
                        middleChartItems[0].percentage > 0
                          ? "inline-block"
                          : "none"
                    }}
                  >
                    <div className="chart-label1" />
                    <div className="label-text">
                      {middleChartItems[0].category}
                    </div>
                  </span>
                  <span
                    className="chart-label"
                    style={{
                      width: labelWidth,
                      display:
                        middleChartItems[1].percentage > 0
                          ? "inline-block"
                          : "none"
                    }}
                  >
                    <div className="chart-label2" />
                    <div className="label-text">
                      {middleChartItems[1].category}
                    </div>
                  </span>
                  <span
                    className="chart-label"
                    style={{
                      width: labelWidth,
                      display:
                        middleChartItems[2].percentage > 0
                          ? "inline-block"
                          : "none"
                    }}
                  >
                    <div className="chart-label3" />
                    <div className="label-text">
                      {middleChartItems[2].category}
                    </div>
                  </span>
                  {middleChartItems.length > 3 ? (
                    <span
                      className="chart-label"
                      style={{
                        width: labelWidth,
                        display:
                          middleChartItems[3].percentage > 0
                            ? "inline-block"
                            : "none"
                      }}
                    >
                      <div className="chart-label4" />
                      <div className="label-text">
                        {middleChartItems[3].category}
                      </div>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="line-chart">
                {this.state.dataJSON.data.rightChart.label} (%)
                <br />
                <div className="chart">
                  <span
                    className="chart-span5"
                    style={{
                      width:
                        (rightChartItems[0].percentage / rightChartSum) *
                        chartWidth
                    }}
                  >
                    {rightChartItems[0].percentage}
                  </span>
                  <span
                    className="chart-span6"
                    style={{
                      width:
                        (rightChartItems[1].percentage / rightChartSum) *
                        chartWidth
                    }}
                  >
                    {rightChartItems[1].percentage}
                  </span>
                  <span
                    className="chart-span7"
                    style={{
                      width:
                        (rightChartItems[2].percentage / rightChartSum) *
                        chartWidth
                    }}
                  >
                    {rightChartItems[2].percentage}
                  </span>
                  {rightChartItems.length > 3 ? (
                    <span
                      className="chart-span4"
                      style={{
                        width:
                          (rightChartItems[3].percentage / rightChartSum) *
                          chartWidth
                      }}
                    >
                      {rightChartItems[3].percentage}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="labels">
                  <span
                    className="chart-label"
                    style={{
                      width: labelWidth,
                      display:
                        rightChartItems[0].percentage > 0
                          ? "inline-block"
                          : "none"
                    }}
                  >
                    <div className="chart-label5" />
                    <div className="label-text">
                      {rightChartItems[0].category}
                    </div>
                  </span>
                  <span
                    className="chart-label"
                    style={{
                      width: labelWidth,
                      display:
                        rightChartItems[1].percentage > 0
                          ? "inline-block"
                          : "none"
                    }}
                  >
                    <div className="chart-label6" />
                    <div className="label-text">
                      {rightChartItems[1].category}
                    </div>
                  </span>
                  <span
                    className="chart-label"
                    style={{
                      width: labelWidth,
                      display:
                        rightChartItems[2].percentage > 0
                          ? "inline-block"
                          : "none"
                    }}
                  >
                    <div className="chart-label7" />
                    <div className="label-text">
                      {rightChartItems[2].category}
                    </div>
                  </span>
                  {rightChartItems.length > 3 ? (
                    <span
                      className="chart-label"
                      style={{
                        width: labelWidth,
                        display:
                          rightChartItems[3].percentage > 0
                            ? "inline-block"
                            : "none"
                      }}
                    >
                      <div className="chart-label4" />
                      <div className="label-text">
                        {rightChartItems[3].category}
                      </div>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
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
