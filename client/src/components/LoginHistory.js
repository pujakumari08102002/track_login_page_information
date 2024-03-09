import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserDetails = () => {
  const [data, setData] = useState([]); 
  const { id } = useParams(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/userdetail/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setData(userData); 
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchData(); 
  }, [id]); 

  return (
    <div className="container-fluid" style={{ background: "#76ABAE", color: "white" }}>
      <div className="row justify-content-center">
        <div className="col-md-10">
         
          <h2 className="text-center"> <div><a href='/'>Return</a></div></h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>Country</th>
                  <th>Login Time</th>
                  <th>Browser</th>
                 
                </tr>
              </thead>
              <tbody>
               
                {data.map((user) => (
                  <tr key={user._id}>
                    <td>{user.ipAddress}</td>
                    <td>{user.country}</td>
                    <td>{user.loginTime}</td>
                    <td>{user.userAgent}</td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
