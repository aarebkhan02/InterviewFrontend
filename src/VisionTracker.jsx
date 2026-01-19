import { useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

// Utils
function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(x, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, x));
}

export default function VisionTracker({ onMetrics, running = true }) {
  const videoRef = useRef(null);
  const cameraRef = useRef(null);

  const movementHistory = useRef([]);
  const prevNose = useRef(null);
  const lastFaceTime = useRef(Date.now());

  // Reset everything (like restarting camera loop)
  function resetState() {
    movementHistory.current = [];
    prevNose.current = null;

    onMetrics({
      attention: 0,
      stress: 0,
      comfort: 0,
      confidence: 0,
    });
  }

  useEffect(() => {
    if (!running) {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      resetState();
      return;
    }

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    faceMesh.onResults((results) => {
      // ❌ No face detected
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        // If face gone for > 1 second → reset everything
        if (Date.now() - lastFaceTime.current > 1000) {
          resetState();
        }
        return;
      }

      lastFaceTime.current = Date.now();

      const lm = results.multiFaceLandmarks[0];

      // ---- Landmark indexes ----
      const MOUTH_LEFT = 61;
      const MOUTH_RIGHT = 291;
      const MOUTH_TOP = 13;
      const MOUTH_BOTTOM = 14;

      const LEFT_EYE_TOP = 159;
      const LEFT_EYE_BOTTOM = 145;
      const LEFT_EYE_LEFT = 33;
      const LEFT_EYE_RIGHT = 133;

      const RIGHT_EYE_TOP = 386;
      const RIGHT_EYE_BOTTOM = 374;
      const RIGHT_EYE_LEFT = 362;
      const RIGHT_EYE_RIGHT = 263;

      const NOSE_TIP = 1;

      // ---- MOUTH ----
      const mouthW = dist(lm[MOUTH_LEFT], lm[MOUTH_RIGHT]);
      const mouthH = Math.max(dist(lm[MOUTH_TOP], lm[MOUTH_BOTTOM]), 0.0001);

      const smileRatio = mouthW / mouthH;
      const jawRatio = mouthH / mouthW;

      // ---- EYES ----
      const leH = dist(lm[LEFT_EYE_TOP], lm[LEFT_EYE_BOTTOM]);
      const leW = dist(lm[LEFT_EYE_LEFT], lm[LEFT_EYE_RIGHT]);

      const reH = dist(lm[RIGHT_EYE_TOP], lm[RIGHT_EYE_BOTTOM]);
      const reW = dist(lm[RIGHT_EYE_LEFT], lm[RIGHT_EYE_RIGHT]);

      const eyeRatio = ((leH / leW) + (reH / reW)) / 2;

      // ---- SAME FORMULAS ----
      const smile = clamp((smileRatio - 1.4) * 50);
      const eyeOpen = clamp((eyeRatio - 0.14) * 350);
      const jawOpen = clamp(jawRatio * 220);

      // ---- MOVEMENT ----
      const nose = lm[NOSE_TIP];

      if (prevNose.current) {
        const move = dist(nose, prevNose.current);
        movementHistory.current.push(move);

        if (movementHistory.current.length > 15) {
          movementHistory.current.shift();
        }
      }

      prevNose.current = { ...nose };

      let avgMove = 0;
      if (movementHistory.current.length > 0) {
        avgMove =
          movementHistory.current.reduce((a, b) => a + b, 0) /
          movementHistory.current.length;
      }

      // ⚠️ SCALE FOR NORMALIZED COORDS
      const instability = clamp(avgMove * 9000);
      const stability = 100 - instability;

      // ---- FINAL METRICS ----
      const comfort = clamp(eyeOpen * 0.6 + (100 - jawOpen) * 0.4);
      const uncomfortable = 100 - comfort;

      const positivity = clamp(smile * 0.8 + comfort * 0.2);
      const attention = clamp(eyeOpen * 0.7 + stability * 0.3);
      const stress = clamp(uncomfortable * 0.6 + instability * 0.4);

      const confidence = clamp(
        comfort * 0.4 +
          (100 - stress) * 0.3 +
          stability * 0.2 +
          positivity * 0.1
      );

      onMetrics({
        attention: Math.round(attention),
        stress: Math.round(stress),
        comfort: Math.round(comfort),
        confidence: Math.round(confidence),
      });
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (running) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();
    cameraRef.current = camera;

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
    };
  }, [running]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}
