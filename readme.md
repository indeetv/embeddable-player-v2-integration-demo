> [!CAUTION]
**This code is for demonstration purpose only. Please do not use our API keys on client side applications.  The API key should
be stored securely on your servers.**

# Embeddable Video Player V2 Integration Demo App

This project integrates the Indee embeddable video player using the Indee API. It fetches playback data and dynamically loads the player into the webpage.

[!NOTE] 
Replace the YOUR_SCREENER_KEY_HERE and YOUR_API_KEY_HERE with the respective keys.



## Table of Contents

- [Running the Demo](#running-the-demo)
- [Code Explanation](#code-explanation)
  - [generateClientId](#generateclientid)
  - [loadScript](#loadscript)
  - [getEmbeddablePlayer](#getembeddableplayer)
  - [fetchPlaybackData](#fetchplaybackdata)
  - [init](#init)
- [Error Handling](#error-handling)
- [License](#license)


### Key Data

- **apiUrl**: URL for fetching the playback data.
- **embeddablePlayerInitializationUrl**: URL for loading the initialization script for the player.
- **embeddablePlayerTemplateURL**: URL for fetching the embeddable player HTML template.
- **apiKey**: API key for authentication.

## Running the demo

Running this demo on port 3000

#### For example - 

If you have python installed, 

```bash
python3 -m http.server 9000
```

If you have a node development environment.


```bash
npx http-server --port 3000
```

Now if you open [http://localhost:3000](http://localhost:3000) on your browser.

## Code Explanation

### `generateClientId`

This function generates a ClientID header required by the APIs. It parses the user agent string to construct a ClientID in the format:

```
WEB-{BrowserName}-{BrowserVersion}-{OSName}{OSVersion}
```

### `loadScript`

This function dynamically loads a script from a given URL and returns a promise that resolves when the script is successfully loaded.

### `getEmbeddablePlayer`

This function fetches the embeddable player HTML template and initializes the Indee player with the given playback data.

### `fetchPlaybackData`

This function fetches playback data from the API and then calls `getEmbeddablePlayer` to initialize the player.

### `init`

This function initializes the player by loading the initialization script and fetching the playback data.

## Error Handling

The code includes `try/catch` blocks to handle errors during the following operations:

1. Loading the initialization script.
2. Fetching the playback data.
3. Fetching the embeddable player HTML template.
4. Initializing the player.

Errors are logged to the console for debugging purposes.