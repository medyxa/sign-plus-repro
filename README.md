### Description

This project is a reproduction of an issue with Sign.Plus.

### Steps to reproduce

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file based on the `.env.example` file
4. Set the `SIGN_PLUS_ACCESS_TOKEN` environment variable to your Sign.Plus access token
5. Set the `SIGN_PLUS_EMAIL` environment variable to your Signatory email
6. Set the `SIGN_PLUS_NAME` environment variable to your Signatory name
7. Run `npx tsx index.ts`

### Actual behavior

The script creates an enveloppe, adds a document to it, adds a recipient to it. When it tries to add an annotation to it, it fails with the following error:

```
Error: Request failed with status code 500
data: {
  code: 'ANNOTATION_UNABLE_TO_CREATE',
  message: 'Unable to create annotation'
}
```

### Expected behavior

The script should create an enveloppe, add a document to it, add a recipient to it and add an annotation to it where the date is automatically filled to the current date when the signatory signs the document.


