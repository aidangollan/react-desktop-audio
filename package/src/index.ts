import { useRef, useState, useCallback, useEffect } from 'react';

type CaptureState = 'stopped' | 'requesting_permissions' | 'recording' | 'error';

interface UseDesktopAudioCapture {
  captureState: CaptureState;
  startRecording: () => void;
  stopRecording: () => void;
  audioBlob: Blob | null;
  error: string | null;
  requestPermissionsAndStartRecording: () => void;
}

/**
 * A custom hook for capturing desktop audio.
 * 
 * @returns {UseDesktopAudioCapture} An object containing the capture state, control functions, audio blob, and error message.
 */
const useDesktopAudioCapture = (): UseDesktopAudioCapture => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [captureState, setCaptureState] = useState<CaptureState>('stopped');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDataAvailable = useCallback((event: BlobEvent) => {
    audioChunksRef.current.push(event.data);
  }, []);

  const handleStop = useCallback(() => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    setAudioBlob(audioBlob);
    audioChunksRef.current = [];
  }, []);

  const startRecording = useCallback(() => {
    if (streamRef.current) {
      const recorder = new MediaRecorder(streamRef.current);
      setCaptureState('recording');
      setError(null);
      setAudioBlob(null);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.start();
      mediaRecorderRef.current = recorder;
    }
  }, [handleDataAvailable, handleStop]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setCaptureState('stopped');
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, []);

  const requestPermissionsAndStartRecording = useCallback(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      setError('Browser does not support screen recording');
      setCaptureState('error');
      return;
    }

    setCaptureState('requesting_permissions');
    setError(null);
    navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
      .then(stream => {
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length === 0) {
          setError('Audio recording permission denied or no audio track available');
          setCaptureState('error');
          stream.getTracks().forEach(track => track.stop());
        } else {
          streamRef.current = stream;
          startRecording();
        }
      })
      .catch(err => {
        setError('Error starting desktop audio capture');
        setCaptureState('error');
      });
  }, [startRecording]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return { captureState, startRecording, stopRecording, audioBlob, error, requestPermissionsAndStartRecording };
};

export default useDesktopAudioCapture;
