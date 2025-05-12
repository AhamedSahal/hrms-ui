import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RecognitionMain from './form'; 

const RecognitionRoute= () => {
   return (
   <Routes>
      <Route path={''} element={<RecognitionMain />} />      
   </Routes>
)};

 

export default RecognitionRoute; 