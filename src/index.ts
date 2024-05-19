import { useRef, useState, useCallback, useEffect } from 'react';

type CaptureState = 'stopped' | 'requesting_permissions' | 'recording' | 'error';

const useDesktopAudioCapture = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [captureState, setCaptureState] = useState<CaptureState>('stopped');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDataAvailable = useCallback((event: BlobEvent) => {
    audioChunksRef.current.push(event.data);
    console.log('Received audio chunk:', event.data);
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
        console.error('Error starting desktop audio capture:', err);
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
