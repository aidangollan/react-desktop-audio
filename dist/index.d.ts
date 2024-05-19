type CaptureState = 'stopped' | 'requesting_permissions' | 'recording' | 'error';
declare const useDesktopAudioCapture: () => {
    captureState: CaptureState;
    startRecording: () => void;
    stopRecording: () => void;
    audioBlob: Blob | null;
    error: string | null;
    requestPermissionsAndStartRecording: () => void;
};
export default useDesktopAudioCapture;
