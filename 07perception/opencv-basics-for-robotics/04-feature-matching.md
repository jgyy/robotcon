# OpenCV Basics for Robotics — Unit 4: Feature Matching

Feature matching lets a robot recognize the same object or scene from a different viewpoint by finding and comparing distinctive points, rather than raw pixels. This is the core technique behind visual tracking, image mosaicking, and simple monocular localization.

## Why not just compare pixels?
Comparing raw pixel intensities between two images breaks the moment the camera moves, rotates, zooms, or lighting changes even slightly. Feature-based matching instead picks out a sparse set of distinctive points — corners, blobs, high-contrast junctions — that are likely to be re-detected even under those changes, then describes each point with a numeric fingerprint that can be compared across images.

## FAST: finding the points
FAST (Features from Accelerated Segment Test) is a corner detector built for speed. For each candidate pixel, it examines a ring of 16 surrounding pixels and declares a corner if a contiguous arc of them is all significantly brighter or all significantly darker than the center pixel. No gradients, no convolutions — just intensity comparisons — which is why FAST is cheap enough to run on every frame of a live video stream.

```python
fast = cv2.FastFeatureDetector_create(threshold=25)
keypoints = fast.detect(gray, None)
frame_kp = cv2.drawKeypoints(frame, keypoints, None, color=(0, 255, 0))
```

FAST only finds *where* interesting points are — it says nothing about what makes each one distinctive from another, which is where a descriptor comes in.

## BRIEF: describing the points
BRIEF (Binary Robust Independent Elementary Features) turns the small patch around a keypoint into a compact binary string by comparing the intensities of pairs of pixels at fixed, precomputed offsets within the patch (pixel A brighter than pixel B → bit 1, else bit 0). The result — typically 128 to 512 bits — is a descriptor that's extremely fast to compare between two keypoints using Hamming distance (just XOR and popcount), instead of the slower Euclidean distance needed for float-based descriptors like SIFT.

## ORB: FAST + BRIEF, made rotation-aware
Plain FAST+BRIEF isn't robust to image rotation — rotate the camera and the binary comparisons scramble. ORB (Oriented FAST and Rotated BRIEF) fixes this by computing each keypoint's dominant orientation and rotating the BRIEF sampling pattern to match before encoding, and it's free to use (unlike the patented SIFT/SURF algorithms of the era), making it the practical default for real-time robotics work.

```python
orb = cv2.ORB_create(nfeatures=500)
kp1, des1 = orb.detectAndCompute(gray1, None)
kp2, des2 = orb.detectAndCompute(gray2, None)

bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
matches = sorted(bf.match(des1, des2), key=lambda m: m.distance)

matched_img = cv2.drawMatches(gray1, kp1, gray2, kp2, matches[:30], None)
```

`crossCheck=True` keeps only mutual best matches (A's best match is B, and B's best match is A), which is a cheap way to discard a lot of noise before doing anything more sophisticated like RANSAC-based homography estimation.

## Try it yourself
Take two photos of the same object from slightly different angles (or use one photo and a rotated copy of it). Run ORB detection and BFMatcher matching between them, draw the top 30 matches, and visually check how many are correct correspondences versus mismatches. Then try rotating the second image by 90 degrees and re-run — note how ORB's orientation handling keeps most matches correct where plain FAST+BRIEF would fail.
