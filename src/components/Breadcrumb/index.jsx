import React from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import Breadpath from '../../assets/icons/braedpath.png';
const App = (e) => (
  <Breadcrumb
    items={[
      {
        href: '',
        title: (<>
        {/* <img src={Breadpath} alt="" sizes='12'/> */}
          <span className='text-[#0A5BE2]'>Dashboard</span>
        </>
        ),
      },

      {
        href: "",
        title: e.title,
      },

      e.subtitle ? {
        href: "",
        title: e.subtitle,
      } : ""


    ]}
  />
);
export default App;

