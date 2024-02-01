import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './postcodeform.css'; // Import the common styles

const ResultDisplay = ({ result }) => (
  <Box className="result-display">
    <h2>Result:</h2>
    <pre>{JSON.stringify(result, null, 2)}</pre>
  </Box>
);

const Footer = () => (
  <div className="footer">
    <Typography variant="body2" color="textSecondary" align="center" style={{ color: 'white' }}>
      © {new Date().getFullYear()} Altech Data Solutions Pty Ltd. All rights reserved.
    </Typography>
  </div>
);

const FAQ = () => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6">FAQs</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="subtitle1">Q 1: How does the postcode lookup work?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                A: This service allows you to look up Australian postcodes.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="subtitle1">Q 2: How to use the postcode lookup?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                A: Enter postcodes (comma-separated) in the input field and click Submit.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="subtitle1">Q 3: Can I enter multiple postcodes at once?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                A: Yes, you can enter multiple postcodes separated by commas.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

const PostcodeForm = ({ onSubmit }) => {
  const [postcodes, setPostcodes] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(postcodes);
  };

  return (
    <div style={{ 
      backgroundImage: 'url("australia_lake.jpg")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}>
      <AppBar position="static" style={{ backgroundColor: '#003049' }}>
        <Toolbar style={{ justifyContent: 'center' }}>
          <Typography variant="h6" style={{ fontFamily: 'Helvetica' }}>Australia Postcode Lookup</Typography>
        </Toolbar>
      </AppBar>

 

      {/* Form */}
      <form onSubmit={handleSubmit} className="postcode-form">
        <label htmlFor="postcodes" style={{ marginBottom: '10px', fontWeight: 'bold' }}>Enter postcodes (comma-separated):</label>
        <Box
          component="div"
          sx={{
            '& > :not(style)': { width: '100%', marginBottom: '15px' },
          }}
        >
          <TextField
            id="postcodes"
            name="postcodes"
            value={postcodes}
            onChange={(e) => setPostcodes(e.target.value)}
            required
            label="Postcodes"
            variant="outlined"
          />
        </Box>
        <Button type="submit" variant="contained" style={{ backgroundColor: '#d62828' }}>
          Submit
        </Button>
      </form>

      {/* Result Display */}
      {result && <ResultDisplay result={result} />}

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PostcodeForm;
