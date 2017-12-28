import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import TimeAgo from 'react-timeago';
import Markdown from 'react-markdown';

export default class toCluster extends React.Component {

  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined,
      languageTexts: undefined
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if (this.props.optionalConfigSchemaJSON) {
      stateVar.optionalConfigSchemaJSON = this.props.optionalConfigSchemaJSON;
    }

    this.state = stateVar;
    this.processLink = this.processLink.bind(this);
  }

  exportData() {
    return document.getElementById('protograph_div').getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, opt_config, opt_config_schema) => {
          this.setState({
            fetchingData: false,
            dataJSON: card.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data,
            languageTexts: this.getLanguageTexts(card.data.data.language)
          });
        }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  ellipsizeTextBox() {
    let container = document.querySelector(`.protograph-${this.props.mode}-mode .protograph-tocluster-title-container`),
      text = document.querySelector(`.protograph-${this.props.mode}-mode .protograph-tocluster-title`),
      wordArray;

    // Setting the string to work with edit mode.
    text.innerHTML = this.state.dataJSON.data.title;

    wordArray = this.state.dataJSON.data.title.split(' ');
    while (container.offsetHeight < text.offsetHeight) {
      wordArray.pop();
      text.innerHTML = wordArray.join(' ') + '...';
    }
  }

  componentDidUpdate() {
    setTimeout(e => {
      this.ellipsizeTextBox();
    }, 150);
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "hindi",
      text_obj;

    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          font: undefined
        }
        break;
    }

    return text_obj;
  }

  renderCol7() {
    let data = this.state.dataJSON.data;
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
      console.log(data.analysis && data.analysis.length > 0, this.renderWithAnalysis())
      if (data.analysis && data.analysis.length > 0 ) {
        return(
          <div
            id="protograph_div"
            className="protograph-col7-mode protograph-tocluster-card-with-analysis"
            style={{ fontFamily: this.state.languageTexts.font }}>
            { this.renderWithAnalysis() }
          </div>
        )
      } else {
        return (
          <div
            id="protograph_div"
            className="protograph-col7-mode protograph-tocluster-card"
            style={{ fontFamily: this.state.languageTexts.font }}>
            { this.renderCard() }
          </div>
        )
      }
    }
  }

  renderCol4() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      return (
        <div
          id="protograph_div"
          className="protograph-col4-mode protograph-tocluster-card"
          style={{ fontFamily: this.state.languageTexts.font }}>
          { this.renderCard() }
        </div>
      )
    }
  }

  renderCol3() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      return (
        <div
          id="protograph_div"
          className="protograph-col3-mode protograph-tocluster-card"
          style={{ fontFamily: this.state.languageTexts.font }}>
            { this.renderCard() }
        </div>
      )
    }
  }

  renderCard() {
    const data = this.state.dataJSON.data,
      link = data.links[0];
    return (
      <div className="protograph-card">
        <div className="protograph-tocluster-title-container">
          <a href={link.link} target="_blank" className="protograph-tocluster-title">{data.title}</a>
        </div>

        <div className="protograph-tocluster-other-info">
          <span className="protograph-tocluster-byline">By {data.by_line}</span>&nbsp;
              <TimeAgo component="span" className="protograph-tocluster-timeago" date={data.published_date} />
        </div>
        <div className="protograph-tocluster-favicons">
          {
            data.links.map((e, i) => {
              let greyscale = "";
              if (i > 0) {
                greyscale = "protograph-tocluster-greyscale"
              }
              return (
                <a key={i} href={e.link} target="_blank" className="protograph-tocluster-favicon-link">
                  <img className={`protograph-tocluster-favicon ${greyscale}`} src={e.favicon_url} />
                </a>
              )
            })
          }
        </div>
      </div>
    )
  }

  processLink(e) {
    const links = this.state.dataJSON.data.links;
    console.log(e.type, ";;;;;;;;--------")
    switch (e.type) {
      case 'linkReference':
        let linkRef = +e.identifier;
        e.type = "link";
        e.title = null;
        if ((linkRef - 1) < links.length ) {
          e.url = this.state.dataJSON.data.links[+e.identifier - 1].link;
          return true;
        } else  {
          return false;
        }
        break;
      case 'link':
        // Don't allow any external link.
        return false;
      default:
        return true;
    }
    // if (e.type === "linkReference") {
    //   e.type = "link";
    //   e.title = null;
    //   e.url = this.state.dataJSON.data.links[+e.identifier - 1].link;
    // }
    // return true;
  }

  renderWithAnalysis() {
    const data = this.state.dataJSON.data,
      link = data.links[0];
    return (
      <div className="protograph-card">
        <div className="protograph-tocluster-title-container title-with-analysis">
          <a href={link.link} target="_blank" className="protograph-tocluster-title">{data.title}</a>
        </div>
        <div className="protograph-tocluster-other-info info-with-analysis">
          <span className="protograph-tocluster-byline">By {data.by_line}</span>&nbsp;
              <TimeAgo component="span" className="protograph-tocluster-timeago" date={data.published_date} />
        </div>
        <div className="clearfix"></div>
        <Markdown
          className="protograph-tocluster-analysis-container"
          source={data.analysis}
          allowNode={this.processLink}
        />
      </div>
    )
  }

  render() {
    switch(this.props.mode) {
      case 'col7' :
        return this.renderCol7();
        break;
      case 'col4':
        return this.renderCol4();
        break;
      case 'col3' :
        return this.renderCol3();
        break;
    }
  }
}
