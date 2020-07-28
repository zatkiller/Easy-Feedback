//Render single label and text input
import React from 'react';

export default ({ input, label, meta: { error, touched } }) => { ///nested destructuring for meta
    return (
        <div>
            <label>{label}</label>
            <input {...input} style={{ marginBottom: '5px' }} />
            <div className="red-text" style={{ marginBottom: '20px' }}>
                {touched && error}
            </div>
        </div>
    );
};