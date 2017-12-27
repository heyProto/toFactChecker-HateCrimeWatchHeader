import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

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
      return (<div>Under construction</div>)
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
