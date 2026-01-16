import React from 'react';
import { Checkbox } from 'antd';
const CheckBox = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
const App = () => <Checkbox onChange={CheckBox}>Checkbox</Checkbox>;
export default App;