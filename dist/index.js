"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useDesktopAudioCapture = function () {
    var mediaRecorderRef = (0, react_1.useRef)(null);
    var streamRef = (0, react_1.useRef)(null);
    var audioChunksRef = (0, react_1.useRef)([]);
    var _a = (0, react_1.useState)('stopped'), captureState = _a[0], setCaptureState = _a[1];
    var _b = (0, react_1.useState)(null), audioBlob = _b[0], setAudioBlob = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var handleDataAvailable = (0, react_1.useCallback)(function (event) {
        audioChunksRef.current.push(event.data);
        console.log('Received audio chunk:', event.data);
    }, []);
    var handleStop = (0, react_1.useCallback)(function () {
        var audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
    }, []);
    var startRecording = (0, react_1.useCallback)(function () {
        if (streamRef.current) {
            var recorder = new MediaRecorder(streamRef.current);
            setCaptureState('recording');
            setError(null);
            setAudioBlob(null);
            recorder.ondataavailable = handleDataAvailable;
            recorder.onstop = handleStop;
            recorder.start();
            mediaRecorderRef.current = recorder;
        }
    }, [handleDataAvailable, handleStop]);
    var stopRecording = (0, react_1.useCallback)(function () {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
            setCaptureState('stopped');
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(function (track) { return track.stop(); });
                streamRef.current = null;
            }
        }
    }, []);
    var requestPermissionsAndStartRecording = (0, react_1.useCallback)(function () {
        setCaptureState('requesting_permissions');
        setError(null);
        navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
            .then(function (stream) {
            var audioTracks = stream.getAudioTracks();
            if (audioTracks.length === 0) {
                setError('Audio recording permission denied or no audio track available');
                setCaptureState('error');
                stream.getTracks().forEach(function (track) { return track.stop(); });
            }
            else {
                streamRef.current = stream;
                startRecording();
            }
        })
            .catch(function (err) {
            console.error('Error starting desktop audio capture:', err);
            setError('Error starting desktop audio capture');
            setCaptureState('error');
        });
    }, [startRecording]);
    (0, react_1.useEffect)(function () {
        return function () {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(function (track) { return track.stop(); });
                streamRef.current = null;
            }
        };
    }, []);
    return { captureState: captureState, startRecording: startRecording, stopRecording: stopRecording, audioBlob: audioBlob, error: error, requestPermissionsAndStartRecording: requestPermissionsAndStartRecording };
};
exports.default = useDesktopAudioCapture;
