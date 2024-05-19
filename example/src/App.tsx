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
      <div className="flex flex-col h-2/3 w-2/3 justify-center items-center bg-gray-900 p-8 rounded-lg shadow-lg">
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
