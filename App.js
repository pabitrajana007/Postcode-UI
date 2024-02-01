// App.js
import React, { useState } from 'react';
import PostcodeForm from './PostcodeForm';


const App = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (postcodes) => {
    try {
      const response = await fetch('https://backend-cr7j67rcha-ts.a.run.app/postcodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postcodes }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setError(null); // Reset error if there was one before
      } else {
        console.error('Server Error:', response.statusText);

        try {
          const errorData = await response.json();
          console.error('Server Error Details:', errorData);
          setError(errorData.error);
        } catch (jsonError) {
          console.error('Error parsing JSON error response:', jsonError);
          setError('An error occurred on the server.'); // Fallback error message
        }
      }
    } catch (error) {
      console.error('Network Error:', error.message);
      setError('Network error occurred.'); // Update error state
      setResult(null); // Reset result if there was one before
    }
  };

  return (
    <div>
      <PostcodeForm onSubmit={handleSubmit} />
      {error && (
        <div className="error-display">
          {error === "You entered more than 5 postcodes." ? (
            <div className="result-display">
              <h2>Error:</h2>
              <p>{error}</p>
            </div>
          ) : (
            <p>Error: {error}</p>
          )}
        </div>
      )}
      {result && (
        <div className="result-display">
          <h2>Result:</h2>
          {Object.keys(result).map((year) => (
            <div key={year}>
              <h3>{year}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Locality</th>
                    <th>Postcode</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {result[year].map((item, index) => (
                    <tr key={index}>
                      <td>{item.Locality}</td>
                      <td>{item.Postcode}</td>
                      <td>{item.State}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
