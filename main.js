import React from 'react';
import ReactDOM from 'react-dom';
import Card from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.HCW = function () {
  this.cardType = 'HCWCard';
}

ProtoGraph.Card.HCW.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.HCW.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.HCW.prototype.renderCol4 = function (data) {
  this.mode = 'col4';
  this.render();
}

ProtoGraph.Card.HCW.prototype.renderCol16 = function (data) {
  this.mode = 'col16';
  this.render();
}

ProtoGraph.Card.HCW.prototype.render = function () {
  ReactDOM.render(
    <Card
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      siteConfigs={this.options.site_configs}
      siteConfigURL={this.options.site_config_url}
      mode={this.mode}
      selector={this.options.selector}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }} />,
    this.options.selector);
}

