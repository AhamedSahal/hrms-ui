import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RecognitionMain from './form'; 

const RecognitionRoute= ({ match }) => {
   return (
   <Routes>
      <Route path={`${match.url}`} component={RecognitionMain} />      
   </Routes>
)};

 

export default RecognitionRoute; 