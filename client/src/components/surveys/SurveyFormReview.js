import _ from 'lodash';
import React from 'react'
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';


const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
    const reviewFields = _.map(formFields, ({ name, label }) => { //field.name and field.label
        return (
            <div key={name}>
                <label>{label}</label>
                <div>
                    {formValues[name]}
                </div>
            </div>
        );
    });

    return (
        <div>
            <h5>Please confirm your entries!</h5>
            {reviewFields}
            <button
                className="yellow darken-3 white-text btn-flat"
                onClick={onCancel}
            >
                Back
            </button>
            <button
                onClick={() => submitSurvey(formValues, history)}
                className="green btn-flat right white-text"
            >
                Send Survey
        <i className="material-icons right">email</i>
            </button>
        </div>
    )
}

//mapStateToProps is just naing convention
function mapStateToProps(state) {
    return { formValues: state.form.surveyForm.values }; //becoms a prop for th component
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
//withRouter gives the history prop