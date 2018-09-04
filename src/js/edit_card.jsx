import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Card from './card.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class editHCW extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataJSON: {},
      mode: "col16",
      publishing: false,
      schemaJSON: undefined,
      uiSchemaJSON: undefined,
      fetchingData: true
    }
    this.toggleMode = this.toggleMode.bind(this);
    this.formValidator = this.formValidator.bind(this);
  }

  exportData() {
    let getDataObj = {
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
      uiSchemaJSON: this.state.uiSchemaJSON
    }
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object.
    if (this.state.fetchingData){
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.schemaURL),
        axios.get(this.props.uiSchemaURL)
      ])
      .then(axios.spread((card, schema, uiSchema) => {
        let stateVars = {
          fetchingData: false,
          dataJSON: card.data,
          schemaJSON: schema.data,
          uiSchemaJSON: uiSchema.data
        }

        this.setState(stateVars);
      }));
    }
  }

  isUrlValid(url) {
    if (!url) return false;
    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null)
      return false;
    else
      return true;
  }

  onChangeHandler({formData}) {
    let dataJSON = formData;
    this.setState({dataJSON: dataJSON});
  }

  loadCard() {
    return (<Card
                    mode={this.state.mode}
                    dataJSON={this.state.dataJSON}
                    schemaJSON={this.state.schemaJSON} 
                    uiSchemaJSON={this.state.uiSchemaJSON}
                  />)
  }

  onSubmitHandler({formData}) {
    if (typeof this.props.onPublishCallback === "function") {
      this.setState({ publishing: true });
      let publishCallback = this.props.onPublishCallback();
      publishCallback.then((message) => {
        this.setState({ publishing: false });
      });
    }
  }

  formValidator(formData, errors) {
    return errors;
  }

  renderSchemaJSON() {
    let schema = JSON.parse(JSON.stringify(this.state.schemaJSON.properties.data));
    return schema;
  }

  renderFormData() {
    return this.state.dataJSON;
  }


  showButtonText() {
    return 'Publish'
  }


  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');

    this.setState((prevState, props) => {
      let newMode;
      if (mode !== prevState.mode) {
        newMode = mode;
      } else {
        newMode = prevState.mode
      }

      return {
        mode: newMode
      }
    })
  }

  render() {
    if (this.state.fetchingData) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form protograph-scroll-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    Hate Crime Watch
                  </div>
                </div>
                <JSONSchemaForm schema={this.renderSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  validate={this.formValidator}
                  formData={this.renderFormData()} 
                  uiSchema={this.state.uiSchemaJSON}
                  >
                  <br/>
                  <button type="submit" className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'col4' ? 'active' : ''}`}
                      data-mode='col4'
                      onClick={this.toggleMode}
                    >
                      col-4
                    </a>
                    <a className={`item ${this.state.mode === 'col16' ? 'active' : ''}`}
                      data-mode='col16'
                      onClick={this.toggleMode}
                    >
                      col-16
                    </a>
                  </div>
                </div>
                <div className="protograph-app-holder">
                  {this.loadCard()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
