//Form for user to add input into survey
import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
    renderFields() {
        return _.map(formFields, ({ label, name }) => {
            return (
                <Field
                    key={name}
                    component={SurveyField}
                    type="text"
                    label={label}
                    name={name}
                />
            );
        });
    }
    //props.handleSubmit passed y reduxForm, calls function whenever user tries to submit a form
    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    {this.renderFields()}
                    <Link to="/surveys" className="red btn-flat white-text">
                        Cancel
                    </Link>
                    <button type="submit" className="teal btn-flat right white-text">
                        Next
                        <i className="material-icons right">done</i>
                    </button>
                </form>
            </div>
        )
    }
}

function validate(values) {
    const errors = {};

    //check for Invalid emails first
    errors.emails = validateEmails(values.emails || ''); //'' to handle when component first mounts but is empty

    //No provide a value then override the error message
    _.each(formFields, ({ name }) => {
        //check value associated with the name input
        if (!values[name]) {
            errors[name] = 'You must provide a value';
        }
    });

    return errors;
}

export default reduxForm({
    validate, //function under validate will automatically run everytime form is submitted
    form: 'surveyForm', //
    destroyOnUnmount: false
})(SurveyForm)