import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/')
      .then(res => res.json())
      .then(data => setData(data.message))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div>
      <h1>{data || "Loading..."}</h1>
    </div>
  );

}

export default App;
