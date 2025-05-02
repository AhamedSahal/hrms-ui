import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class LanguageDropdown extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount() {
        this.props.getLanguages();
    }


    render() {
        const { defaultValue, onChange,readOnly } = this.props;
        return (
            <><br/>
                {this.props.languages && this.props.languages.map((language, index) => {
                    return <>
                        <span className="ml-2">
                            <label key={index}>
                            <input disabled={readOnly}  type="checkbox"
                                onChange={onChange} value={language.id} checked={defaultValue.indexOf(language.id) > -1 ? true : false} name="language" />
                                                   &nbsp; {language.name}
                            </label>
                        </span>
                    </>
                })}


            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        languages: state.dropdown.languages
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getLanguages: () => {
            dispatch(DropdownService.getLanguages())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LanguageDropdown);
