const axios = require('axios');
const fs = require('fs');

require("dotenv").config();

const main = async () => {
  const envelopeId = await createEnvelope();
  const documentId = await addDocumentInEnvelope(envelopeId);
  const recipientId = await addRecipientInEnvelope(envelopeId);
  const annotationId = await addAnnotationInDocument(envelopeId, documentId, recipientId);

  console.log(`Successfully created envelope with id ${envelopeId} and annotation with id ${annotationId}`);
};

async function createEnvelope() {
  const { data } = await axios({
    url: 'https://restapi.sign.plus/v2/envelope',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SIGN_PLUS_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: {
      flow_type: 'REQUEST_SIGNATURE',
      legality_level: 'SES',
      name: 'Datetime auto_fill repro',
      sandbox: true,
    },
  });

  return data.id;
}


async function addDocumentInEnvelope(envelopeId) {
  const payload = new FormData();

  const file = fs.readFileSync('assets/3743.pdf');
  payload.append('file', new Blob([file], { type: 'application/pdf' }), '3743.pdf');

  const { data } = await axios({
    url: `https://restapi.sign.plus/v2/envelope/${envelopeId}/document`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SIGN_PLUS_ACCESS_TOKEN}`,
      'Content-Type': 'multipart/form-data',
    },
    data: payload,
  });

  return data.id;
}

async function addRecipientInEnvelope(envelopeId) {
  const { data } = await axios({
    url: `https://restapi.sign.plus/v2/envelope/${envelopeId}/signing_steps`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SIGN_PLUS_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: {
      signing_steps: [
        {
          recipients: [
            {
              email: process.env.SIGN_PLUS_EMAIL,
              name: process.env.SIGN_PLUS_NAME,
              role: 'SIGNER',
            },
          ],
        },
      ],
    },
  });

  return data.id;
}

async function addAnnotationInDocument(envelopeId, documentId, recipientId) {
  const { data } = await axios({
    url: `https://restapi.sign.plus/v2/envelope/${envelopeId}/annotation`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SIGN_PLUS_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: {
      document_id: documentId,
      recipient_id: recipientId,
      width: 38.408266952614376,
      height: 3.3143939393939394,
      x: 50.984859466552734,
      y: 4.561483860015869,
      required: true,
      page: 1,
      type: 'DATE',
      datetime: {
        auto_fill: true,
        timezone: 'America/Montreal',
        format: 'DMY_NUMERIC_SLASH',
      },
    }
  });

  return data.id;
}


main();
