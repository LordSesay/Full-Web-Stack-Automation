const { v4: uuidv4 } = require('uuid');

function generateEncounterId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const shortId = uuidv4().split('-')[0].toUpperCase();
  return `ENC-${date}-${shortId}`;
}

module.exports = { generateEncounterId };
