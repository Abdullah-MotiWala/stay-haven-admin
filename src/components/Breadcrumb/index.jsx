import React from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
const App = (e) => (
  <Breadcrumb
    items={[
      {
        href: '',
        title: (<>
            <HomeOutlined color='#0A5BE2'/>
            <span className='text-[#0A5BE2]'>Dashboard</span>
            </>
        ),
      },
      
      {
        href:"",
        title:e.title,
      },
      {
        href:"",
        title:e.subtitle,
      }
    ]}
  />
);
export default App;

