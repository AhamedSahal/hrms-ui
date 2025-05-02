import { AutoComplete, Table } from 'antd';
import React, { Component } from 'react';
 
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import { getTitle } from '../../../utility';  
import "./roster.css"; 
const { Header, Body, Footer, Dialog } = Modal;
export default class rosterCalendar extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      Roster: props.Roster || {
        id: 0,
        applicablefororg: "yes",
        employeeId: props.employeeId,
        description: "",
        rosterId: 0,
        roster: { id: 0 },  

      },
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.Roster && nextProps.Roster != prevState.Roster) {
      return { Roster: nextProps.Roster };
    } else if (!nextProps.Roster) {
      return (
        prevState.Roster || {
          Roster: nextProps.Roster || {
            id: 0,
            applicablefororg: "yes",
            employeeId: nextProps.employeeId,
            description: "",
            rosterId: 0,
            roster: { id: 0 },
          },
        }
      );
    }
    return null;
  }  
 
  render() {  
    const handlePrevClick = () =>{
      console.log("1");
     }
    const handleNextClick = () =>{
      console.log("2");
     }
    return (
      <div> 
            <div className="page-header" style={{ backgroundColor: "white" }}>
              <div className="row align-items-center">
                <div
                  className="col"
                  style={{
                    fontFamily: "Tahoma",
                    paddingLeft: "50px",
                    paddingTop: "50px",
                  }}
                >


                <div className="col-lg-12 col-md-12 col-sm-12" >
                <div  style={{ textAlign : "Right",margin: "auto"}}>
                <button onClick={handlePrevClick}> Previous  </button> 
                {/* <span>{WeekDays} </span> */}
                <button onClick={handleNextClick}> Next </button> 
                </div>
                 
                  <table style={{height:"100%"}} >
                   <tr className="tre">
                   <th style={{width:"175px",textAlign:"left",paddingLeft:"25px"}} >Name</th> 
                   <th>03 <br/> Mon </th>
                   <th>04 <br/> Tue </th>
                   <th>05 <br/> Wed </th>
                   <th>06 <br/> Thu </th>
                   <th>07 <br/> Fri </th>
                   <th>08 <br/> Sat </th>
                   <th>09 <br/> Sun </th></tr>
                   <tr className="tree" >
                    <td>Elvira</td>
                    <td>General</td>
                    <td>Night</td>
                    <td>Afternoon</td>
                    <td>Regular</td>
                    <td>General</td>
                    <td>Afternoon</td>
                    <td>Night</td>
                   </tr>
                   <tr className="tree">
                    <td>Nelson</td>
                    <td>Night</td>
                    <td>Regular</td>
                    <td>General</td>
                    <td>Afternoon</td>
                    <td>Night</td>
                    <td>Regular</td>
                    <td>General</td>
                   </tr>
                   <tr className="tree" >
                    <td>Reem</td>
                    <td>General</td>
                    <td>Night</td>
                    <td>Afternoon</td>
                    <td>Regular</td>
                    <td>General</td>
                    <td>Afternoon</td>
                    <td>Night</td>
                   </tr>
                   <tr className="tree" >
                    <td>ElaiPerumal</td>
                    <td>Night</td>
                    <td>General</td>
                    <td>Night</td>
                    <td>Afternoon</td>
                    <td>Regular</td>
                    <td>Regular</td>
                    <td>General</td>
                   </tr>
                   <tr className="tree" >
                    <td>Arpina</td>
                    <td>Night</td>
                    <td>Afternoon</td>
                    <td>Regular</td>
                    <td>General</td>
                    <td>General</td>
                    <td>Afternoon</td>
                    <td>Night</td>
                   </tr>
                   <tr className="tree" >
                    <td>Derifa</td>
                    <td>Night</td>
                    <td>Regular</td>
                    <td>General</td>
                    <td>Afternoon</td>
                    <td>Night</td>
                    <td>Regular</td>
                    <td>General</td>
                   </tr>
                   <tr className="tree" >
                    <td>Delara</td>
                    <td>General</td>
                    <td>Night</td>
                    <td>Afternoon</td>
                    <td>Night</td>
                    <td>Regular</td>
                    <td>General</td>
                    <td>Afternoon</td>
                    
                   </tr>

                    

                  </table>
                  </div>
                </div>
              </div>
              {/* Page Content */}

            
            </div> 
      </div>
    );
   

     
    
    
  }
}
