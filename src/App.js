
import { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';

function App() {

  const [data, setData] = useState([]);

  const [listVisible, setListVisible] = useState(false);

  const [userid, setUserId] = useState('');

  const [password, setPassword] = useState('');

  const [email, setEmail] = useState('');

 

  const [isUpdating, setIsUpdating] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);

 

  const updateUserId = (event) => {

    setUserId(event.target.value);

  }

 

  const updatePassword = (event) => {

    setPassword(event.target.value);

  }

 

  const updateEmail = (event) => {

    setEmail(event.target.value);

  }

 

  useEffect(() => {

    fetchUsersData();

  }, []);

 

  const insertUser = (event) => {

    event.preventDefault();

    if (isUpdating) {

      // If isUpdating is true, it's an update operation

      axios.put(`http://localhost:8001/update`, {

        uid: selectedUserId,

        password: password,

        emailid: email

      })

        .then((res) => {

          console.log(res);

          setIsUpdating(false); // Reset the update mode

          setSelectedUserId(null);

          clearForm();

          fetchUsersData();

        })

        .catch((error) => {

          console.error('Update error:', error);

        });

    } else {

      // If isUpdating is false, it's an insert operation

      axios.post("http://localhost:8001/insert", {

        uid: userid,

        password: password,

        emailid: email

      })

        .then((res) => {

          console.log(res);

          clearForm();

          fetchUsersData();

        })

        .catch((error) => {

          console.error('Insert error:', error);

        });

    }

  }

 

  const deleteUser = (uid) => {

    axios.delete(`http://localhost:8001/delete?uid=${uid}`)

      .then((response) => {

        console.log('Delete response:', response.data);

        fetchUsersData();

      })

      .catch((error) => {

        console.error('Delete error:', error);

      });

  };

 

  const updateUser = (uid) => {

    const selectedUser = data.find((user) => user.userid === uid);

    if (selectedUser) {

      setIsUpdating(true);

      setSelectedUserId(selectedUser.userid);

      setUserId(selectedUser.userid);

      setPassword(selectedUser.password);

      setEmail(selectedUser.emailid);

    }

  };

 

  const clearForm = () => {

    setUserId('');

    setPassword('');

    setEmail('');

  };

 

  const fetchUsersData = () => {

    fetch("http://localhost:8001/getAll")

      .then((response) => response.json())

      .then((fetchedData) => {

        setData(fetchedData);

      });

  }

 

  return (

    <div className="App">

      <form onSubmit={insertUser}>

        <b>User ID</b><input type="text" value={userid} onChange={updateUserId} /><br />

        <b>Password</b><input type="password" value={password} onChange={updatePassword} /><br />

        <b>Email</b><input type="email" value={email} onChange={updateEmail} /><br />

        <input type="submit" value={isUpdating ? "Update" : "Add"} />&nbsp;&nbsp;

        <input type="reset" value="Reset" />

      </form>

      <button onClick={() => setListVisible(!listVisible)}>User List</button>

      {listVisible && (

        <table>

          <thead>

            <tr>

              <th>User ID</th>

              <th>Password</th>

              <th>Email</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {data.map((item, index) => (

              <tr key={index}>

                <td>{item.userid}</td>

                <td>{item.password}</td>

                <td>{item.emailid}</td>

                <td>

                  <button onClick={() => deleteUser(item.userid)}>Delete</button>

                  <button onClick={() => updateUser(item.userid)}>Update</button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

 

export default App;