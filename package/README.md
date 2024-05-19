
# React Desktop Audio Capture

A React hook for capturing desktop audio, allowing easy integration of audio recording functionality into your React applications.

## Demo

Check out the live demo: [Desktop Audio Capture Demo](https://react-desktop-audio.vercel.app/)

## Installation

Install the package using npm:

```sh
npm install react-desktop-audio
```

or yarn:

```sh
yarn add react-desktop-audio
```

## Usage

### Basic Example

Here's an example of how to use the `useDesktopAudioCapture` hook in a React component:

```tsx
import React from 'react';
import useDesktopAudioCapture from 'react-desktop-audio';

const App: React.FC = () => {
  const { 
    captureState, 
    startRecording, 
    stopRecording, 
    audioBlob, 
    error, 
    requestPermissionsAndStartRecording
  } = useDesktopAudioCapture();

  const handleToggleCapture = () => {
    if (captureState === 'stopped' || captureState === 'error') {
      requestPermissionsAndStartRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-br from-gray-800 to-black text-white">
      <div className="flex flex-col items-center bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Desktop Audio Capture</h1>
        <button 
          onClick={handleToggleCapture}
          className={`px-4 py-2 rounded-md text-lg font-semibold mb-4 ${
            captureState === 'recording' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {captureState === 'recording' ? 'Stop Recording' : 'Start Recording'}
        </button>
        {captureState === 'requesting_permissions' && <div className="text-yellow-400 mb-4">Requesting permissions...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {(captureState !== 'requesting_permissions' && audioBlob) && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Recorded Audio</h2>
            <audio controls src={URL.createObjectURL(audioBlob)} className="w-full"/>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
```

## API

### `useDesktopAudioCapture`

The `useDesktopAudioCapture` hook provides the following properties and methods:

#### Returns

- `captureState: CaptureState`
  - The current state of the audio capture. It can be one of the following:
    - `'stopped'`
    - `'requesting_permissions'`
    - `'recording'`
    - `'error'`

- `startRecording: () => void`
  - Function to start recording.

- `stopRecording: () => void`
  - Function to stop recording.

- `audioBlob: Blob | null`
  - The recorded audio blob.

- `error: string | null`
  - Any error that occurred during the capture process.

- `requestPermissionsAndStartRecording: () => void`
  - Function to request permissions and start recording if granted.

## Capture States

- `stopped`: No recording is taking place.
- `requesting_permissions`: Permissions are being requested from the user to capture the screen and audio.
- `recording`: Recording is in progress.
- `error`: An error occurred during the recording process.

## Error Handling

The `error` property provides detailed error messages which can help in debugging issues such as permission denial or lack of audio tracks in the captured stream.

## Cleanup

The hook includes proper cleanup to stop all media tracks when the component unmounts or when the recording is stopped.

## License

MIT License
