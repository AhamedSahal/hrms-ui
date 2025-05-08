import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import RecognitionListIndex from './RecognitionListIndex'; 
const RecognitionListRoute = ({ match }) => {
   return (
   <Routes>
      <Route path={"RecognitionList"} element={<RecognitionListIndex/>} /> 
   </Routes>
)};

export default RecognitionListRoute;