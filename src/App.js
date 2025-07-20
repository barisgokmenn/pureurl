import React, { useState } from 'react';

const REMOVE_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'mc_cid', 'mc_eid', 'ref', 'referral', 'campaign',
  'pf_rd_p', 'pf_rd_r', 'pd_rd_w', 'pd_rd_wg', 'pd_rd_r', 'content-id', 'ref_', '_encoding'
];

function cleanUrl(url) {
  try {
    const urlObj = new URL(url);
    REMOVE_PARAMS.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    return urlObj.toString();
  } catch {
    return 'Geçersiz URL';
  }
}

function App() {
  const [input, setInput] = useState('');
  const [cleaned, setCleaned] = useState('');

  const handleClean = () => {
    const result = cleanUrl(input.trim());
    setCleaned(result);
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>PureURL - Link Temizleyici</h1>
      <textarea
        rows={3}
        placeholder="Temizlemek istediğin linki buraya yapıştır"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: '100%', fontSize: 16, padding: 10 }}
      />
      <button onClick={handleClean} style={{ marginTop: 10, padding: '10px 20px', fontSize: 16 }}>
        Temizle
      </button>

      {cleaned && (
        <div style={{ marginTop: 20 }}>
          <h3>Temizlenmiş Link:</h3>
          <textarea
            rows={2}
            readOnly
            value={cleaned}
            style={{ width: '100%', fontSize: 16, padding: 10, backgroundColor: '#f4f4f4' }}
          />
          <button
            onClick={() => navigator.clipboard.writeText(cleaned)}
            style={{ marginTop: 10, padding: '8px 16px' }}
          >
            Kopyala
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
