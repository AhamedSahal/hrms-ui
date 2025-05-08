import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



class NumberScale extends Component {

    constructor(props) {
    super(props);
    let selectedValue = isNaN(this.props.selectedValue) ? 5 : this.props.selectedValue;
    let boxNumbers = Array.from({ length: isNaN(this.props.selectedValue) ? 5 : this.props.selectedValue }, (_, i) => i + 1);
    this.state = {
        selectedValue: selectedValue,
        boxNumbers: boxNumbers,
    };

}

componentDidMount() {
    this.props.handleSelectChange(this.state.selectedValue);
}

handleSelectChange = (value) => {
    const selectedValue = parseInt(value, 10);
    const boxNumbers = Array.from({ length: selectedValue }, (_, i) => i + 1);
    this.setState({ selectedValue, boxNumbers });
    this.props.handleSelectChange(value);
}


render() {
    const { selectedValue, boxNumbers } = this.state;
    return (
        <div className='number-selection-option'>
            <select className='ant-select-item' disabled={this.props.readOnly} value={selectedValue} onChange={event => this.handleSelectChange(event.target.value)}>
                <option value={5}>5</option>
                <option value={10}>10</option>
            </select>

            {boxNumbers.map((number) => (
                <div className="scaling-background">
                    <div className="mx-3">
                        <div className="">
                            <div key={number} className="scale-number-design">
                                {number}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );

  }
}
export default NumberScale;