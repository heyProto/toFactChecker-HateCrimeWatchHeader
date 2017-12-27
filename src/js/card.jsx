import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import TimeAgo from 'react-timeago';

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
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.card_data.data.language);
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if (this.props.optionalConfigSchemaJSON) {
      stateVar.optionalConfigSchemaJSON = this.props.optionalConfigSchemaJSON;
    }

    this.state = stateVar;
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
        dataJSON: nextProps.dataJSON,
        languageTexts: this.getLanguageTexts(nextProps.dataJSON.card_data.data.language)
      });
    }
  }

  ellipsizeTextBox(el) {
    var wordArray = el.innerHTML.split(' ');
    while (el.scrollHeight > el.offsetHeight) {
      wordArray.pop();
      el.innerHTML = wordArray.join(' ') + '...';
    }
  }

  componentDidUpdate () {
    this.ellipsizeTextBox(document.getElementById('protograph_tocluster_title'));
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
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
      return (<div>Under construction</div>)
    }
  }

  renderCol4() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      return (<div>Under construction</div>)
    }
  }

  renderCol3() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.data,
        link = data.links[0];
      return (
        <div
          id="protograph_div"
          className="protograph-col7-mode protograph-tocluster-card"
          style={{ fontFamily: this.state.languageTexts.font }}>
          <div className="protograph-card">
            <div className="protograph-tocluster-title" id="protograph_tocluster_title">
              <a href={link.link} target="_blank">{data.title}</a>
            </div>
            <div className="protograph-tocluster-other-info">
              <span className="protograph-tocluster-byline">By {data.by_line}</span>&nbsp;
              <TimeAgo component="span" className="protograph-tocluster-timeago" date={data.published_date} />
            </div>
            <div className="protograph-tocluster-favicons">
              {
                data.links.map((e,i) => {
                  let greyscale = "";
                  if (i > 0) {
                    greyscale = "protograph-tocluster-greyscale"
                  }
                  return (
                    <a href={e.link} target="_blank">
                      <img className={`protograph-tocluster-favicon ${greyscale}`} src={e.favicon_url} />
                    </a>
                  )
                })
              }
            </div>
          </div>
        </div>
      )
    }
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
