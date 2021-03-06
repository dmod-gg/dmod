import React from 'react';
import forms from '../../styles/forms.module.scss';

function TextArea(props) {

	return (
		<div className={`${forms.text_container} ${props.error ? forms.error : null}`}>
			<span><img src={props.image}></img><span className={forms.text_contianer_text}>{props.name}</span></span>
			<textarea className={forms.embedded_form} placeholder={props.placeholder} {...props.register} />
		</div>
	)
}


export default TextArea;