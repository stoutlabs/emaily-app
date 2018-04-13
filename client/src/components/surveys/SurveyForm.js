// SurveyForm shows a form for a user to add input
import _ from "lodash";
import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmails";

import formFields from "./formFields";

export class SurveyForm extends Component {
  renderFields() {
    return formFields.map(({ label, name }) => {
      return <Field type="text" name={name} component={SurveyField} label={label} key={name} />;
    });
  }

  render() {
    return (
      <div>
        <h4>Add New Survey:</h4>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link className="red btn-flat left white-text" to="/surveys">
            Cancel
            <i className="material-icons right">cancel</i>
          </Link>

          <button className="teal btn-flat right white-text" type="submit">
            Submit
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  errors.recipients = validateEmails(values.recipients || "");

  _.each(formFields, ({ name, label }) => {
    if (!values[name]) {
      errors[name] = `${label} is required.`;
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: "surveyForm",
  destroyOnUnmount: false
})(SurveyForm);
