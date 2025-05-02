import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import RecognitionListIndex from './RecognitionListIndex'; 
const RecognitionListRoute = ({ match }) => {
   return (
   <Routes>
      <Route path={`${match.url}/RecognitionList`} component={RecognitionListIndex} /> 
   </Routes>
)};

export default RecognitionListRoute;