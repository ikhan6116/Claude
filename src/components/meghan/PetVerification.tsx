import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Live-camera pet verification.
 *
 * To post on Pet-stagram, an owner must capture a LIVE photo of their pet in
 * the app (the camera stream can't be swapped for an uploaded file), which
 * discourages AI-generated images and stock photos. Robust liveness + AI-image
 * detection is a server-side job — see submit(): the capture is meant to be
 * uploaded to a backend that runs those checks before confirming ownership.
 * This component implements the capture UX and a placeholder verification.
 */

type Status = 'idle' | 'live' | 'captured' | 'verifying' | 'verified' | 'error';

export default function PetVerification() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [petName, setPetName] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // Stop the camera if the component unmounts mid-capture.
  useEffect(() => () => stopStream(), [stopStream]);

  // Attach the stream once the <video> is actually in the DOM.
  useEffect(() => {
    if (status === 'live' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {
        /* autoplay can reject silently; the feed still shows */
      });
    }
  }, [status]);

  const startCamera = useCallback(async () => {
    setError(null);
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError("This browser doesn't support live camera capture. Try a modern mobile browser.");
      setStatus('error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      setStatus('live');
    } catch {
      setError('We couldn’t access your camera. Please allow camera permission and try again.');
      setStatus('error');
    }
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL('image/jpeg', 0.85));
    stopStream();
    setStatus('captured');
  }, [stopStream]);

  const retake = useCallback(() => {
    setPhoto(null);
    void startCamera();
  }, [startCamera]);

  const submit = useCallback(() => {
    setStatus('verifying');
    // Placeholder: upload `photo` to a backend that runs liveness + AI-image
    // detection, then confirm. Simulated here.
    window.setTimeout(() => setStatus('verified'), 1600);
  }, []);

  // ---- Verified: show the post CTA -----------------------------------------
  if (status === 'verified') {
    return (
      <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-3xl text-white">
          ✓
        </div>
        <h3 className="mt-3 text-lg font-bold text-emerald-950">
          {petName ? `${petName} is verified!` : 'Your pet is verified!'} 🎉
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">
          Thanks for confirming a real, live photo. You can now post to Pet-stagram — your
          profile will show a <strong>Verified Pet</strong> badge.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          + Create your first post
        </button>
      </div>
    );
  }

  // ---- Capture / verification card -----------------------------------------
  return (
    <div className="mb-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
          📷
        </span>
        <div className="flex-1">
          <h3 className="font-bold text-emerald-950">Verify your pet to post</h3>
          <p className="mt-1 text-sm text-gray-600">
            To keep Pet-stagram real, we ask for a <strong>live</strong> photo of your pet taken
            right here in the app — no uploads, no AI images. It takes about 10 seconds.
          </p>
        </div>
      </div>

      {/* Pet name */}
      {(status === 'idle' || status === 'error') && (
        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Your pet&apos;s name (optional)
          </label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="e.g. Kobe"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Live camera feed */}
      {status === 'live' && (
        <div className="mt-4">
          <div className="overflow-hidden rounded-xl bg-black">
            <video ref={videoRef} className="h-64 w-full object-cover" playsInline muted />
          </div>
          <button
            type="button"
            onClick={capture}
            className="mt-3 w-full rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
          >
            📸 Capture photo
          </button>
        </div>
      )}

      {/* Captured preview */}
      {status === 'captured' && photo && (
        <div className="mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="Captured pet" className="h-64 w-full rounded-xl object-cover" />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={retake}
              className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={submit}
              className="flex-1 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Submit for verification
            </button>
          </div>
        </div>
      )}

      {/* Verifying */}
      {status === 'verifying' && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-600" />
          Checking that this is a live, genuine photo…
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {error}
        </p>
      )}

      {/* Start button */}
      {(status === 'idle' || status === 'error') && (
        <button
          type="button"
          onClick={() => void startCamera()}
          className="mt-4 w-full rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          Start camera
        </button>
      )}

      <p className="mt-3 text-[11px] leading-snug text-gray-400">
        Your live capture is used only to confirm real pet ownership. Robust liveness and
        AI-image detection run on our servers before a post is approved.
      </p>
    </div>
  );
}
