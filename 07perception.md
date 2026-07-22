# 07 Perception

## OpenCV Basics for Robotics
*Learn how to work with OpenCV in ROS.*
**Rating:** 4.4 (48 reviews)
📂 **Detailed lessons:** [`07perception/opencv-basics-for-robotics/`](07perception/opencv-basics-for-robotics/README.md)

### Overview
Relate to the environment, recognize patterns, understand concepts of pixels, colors, borders, detection of objects, detection of people, faces, etc. They make this combination one of extraordinary potential when it comes to obtaining useful information for a robot about the system that surrounds it. A clear example is the use of cameras in robotics, from drones to mobile robots. The use of cameras has been a constant for quite some time, and it is a tool that cannot be underestimated.

### What you'll learn
- Unit 2: Computer Vision Basics
- Unit 3: People related OpenCV functions
- Unit 4: Feature Matching
- Unit 5: ARTags (Augmented Reality)
- Unit 6: Course Project

### Course outline
1. **Introduction to the Course** — Unit for previewing the contents of the Course.
2. **Computer Vision Basics** — cv_bridge, color spaces and color filtering, edge detection, and a brief introduction to convolutionsmorphological transformations.
3. **People-related OpenCV functions** — Face Detection (Haar cascades) and People Detection and Tracking (HOG).
4. **Feature Matching** — Features from Accelerated Segment Test (FAST), Binary Robust Independent Elementary Features (BRIEF)and Oriented FAST and Rotated BRIEF (ORB).
5. **ARTags (Augmented Reality)** — Learn how to use ARtags (Augmented Reality) in robotics.
6. **Course Project** — There is a dangerous person in this city, and many possible suspects are close to your robot. You must detect all the people and highlight the dangerous person.

## ROS 2 Perception in 5 Days
*Elevate Your ROS 2 Expertise with Sensor Intelligence*
**Rating:** 4.8 (21 reviews)
📂 **Detailed lessons:** [`07perception/ros-2-perception-in-5-days/`](07perception/ros-2-perception-in-5-days/README.md)

### Overview
This course will embark on an exciting journey into the realm of perception in robotics using ROS 2. Through a series of structured units and hands-on projects, you will explore various aspects of sensor data processing and perception techniques.

### What you'll learn
- ROS 2, Perception, Image Processing, OpenCV, Point Cloud Porcessing, Yolo, Advanced Perception Techniques, Deep Learning

### Course outline
1. **Course Intro** — Get a glimpse of what this course on ROS 2 Perception in 5 Days is all about.
   - Introduction: What will you learn in this course?
   - Demo: Try a practical demonstration to get an idea of what you'll achieve by the end of this course.
   - Course Outline: Outline of all the ROS 2 Perception skills you will learn in this course.
   - Requirements: What are the minimum requirements before starting this course?
   - Special Thanks: Special thanks to all the parties involved in making this course possible.
2. **Working With Sensor Data in ROS 2** — Understand the different sensor data types used in ROS 2.
   - Introduction: What will you learn in this unit?
   - Sensor Integration in ROS 2: Learn how sensors are integrated in ROS 2 to help robots understand the world around them.
   - Understanding Laser Scan Messages: Learn the structure and key data of Laser Scan messages.
   - Hands-on Practice! - Laser Messages: Practice working with Laser Scan messages through a hands-on exercise.
   - Understanding Image Messages: Learn the structure and key data of mage Messages in ROS 2.
   - Hands-on Practice! - Image Messages: Practice working with Image messages through a hands-on exercise.
   - Understanding Point Cloud Messages: Learn the structure and key data of Point Cloud Messages in ROS 2.
   - Hands-on Practice! Point Cloud Messages: Practice working with Point Cloud messages through a hands-on exercise.
   - Conclusions: What did you learn in this unit?
3. **Image Processing** — Provide a comprehensive understanding of image processing in ROS 2, focusing on integrating OpenCV for implementing essential perception techniques.
   - Introduction: What will you learn in this unit?
   - What is OpenCV?: Learn what OpenCV is and how it is used in ROS 2 for image processing.
   - What is cv_bridge?: Learn what cv_bridge is and how it connects ROS 2 with OpenCV for image processing.
   - Intro to Color Spaces: Learn the basics of color spaces* and how they are used in image processing.
   - What is Blob Tracking?: Learn the concept of Blob Tracking and how it is used to detect and track objects in images.
   - Create a Blob Tracker Node in ROS 2: Learn how to create a Blob Tracker Node in ROS 2 to detect and track blobs in images.
   - Launch and Test the Blob Tracker: Launch and test the Blob Tracker in ROS 2 to better understand how it works.
   - What is Line Following?: Understand the concept of line following and its applications in robotics.
   - Create a Line Follower Node in ROS 2: Learn how to create a Line Follower Node in ROS 2 to enable robots to follow lines autonomously.
   - Line Follower Optimized: Learn to optimize the line follower program for scenarios where multiple lines/paths are available.
   - Go Towards Entrance/Exit Door: Learn how to instruct the robot to go towards an entrance/exit door.
   - Test the Line Follower: Launch and test the initial Line Follower in ROS 2 to better understand how it works.
   - Test the Line Follower Optimized: Launch and test the optimized Line Follower in ROS 2 to better understand how it works.
   - Test the Door Follower: Launch and test the Door Follower in ROS 2 to better understand how it works.
   - Conclusions: What did you learn in this unit?
4. **Point Cloud Processing** — Thorough grasp of point cloud processing within ROS 2, covering two main workflows: Surface and Object Detection.
   - Introduction: What will you learn in this unit?
   - What is PCL?: Learn about PCL (Point Cloud Library), a powerful library for processing and analyzing 3D point cloud data in ROS 2.
   - Create a Surface Detection Node in ROS 2: Learn how to create a Surface Detection Node in ROS 2 to identify and process surfaces in 3D point cloud data using PCL.
   - Launch and Test Surface Detection: Launch and test the Surface Detection node in ROS 2 to verify its functionality and ensure accurate surface detection.
   - Create an Object Detection Node in ROS 2: Learn how to create an Object Detection node in ROS 2 to identify and track objects in the robot's environment.
   - Launch and Test Object Detection: Launch and test your Object Detection node in ROS 2 to verify its functionality and ensure proper object recognition.
   - Conclusions: What did you learn in this unit?
5. **Human-Robot Interaction** — This unit provides a structured approach to implementing perception techniques for enhancing human-robot interaction (HRI), starting from face detection and recognition, then progressing to pose estimation and people tracking.
   - Introduction: What will you learn in this unit?
   - Create a Face Detection Node in ROS 2: Learn how to create a Face Detection node in ROS 2 to detect and identify faces using computer vision techniques.
   - Launch and Test Face Detection: Launch and test the Face Detection node in ROS 2 to verify its functionality and ensure accurate face detection performance.
   - Launch and Test Eye Detection: Launch and test the Eye Detection node in ROS 2 to ensure it works properly and accurately detects eyes in real-time.
   - Create a Face Recognition Node in ROS 2: Learn how to create a Face Recognition node in ROS 2, enabling your robot to identify and recognize faces using image processing techniques.
   - Launch and Test Face Recognition: Launch and test the Face Recognition node in ROS 2, ensuring proper functionality for face identification.
   - Create a Human Tracking Node in ROS 2: Learn how to create a Human Tracking node in ROS 2, enabling your robot to detect and follow human movement in its environment.
   - Launch and Test Human Tracking: Launch and test the Human Tracking node in ROS 2 to ensure your robot can accurately detect and follow human movement in real-time.
   - Conclusions: What did you learn in this unit?
6. **AI Perception Techniques** — In this unit, we'll delve into advanced perception techniques in robotics, focusing on AI methods such as YOLO. We'll learn about how YOLO can be used to perform high level tasks such as: Object Detection, Pose Estimation and Instance Segmentation
   - Introduction: What will you learn in this unit?
   - How YOLO works?: Understand how YOLO (You Only Look Once) works, a powerful deep learning model for real-time object detection.
   - Features of YOLO: Learn about the key features of YOLO, including its speed, accuracy, and ability to detect multiple objects in real-time.
   - YOLO Pre-Trained Models: Learn about the YOLO pre-trained models and how they can be used for object detection tasks without the need for training from scratch.
   - Create a YOLO Object Detection Node in ROS 2: Learn to create a YOLO object detection node in ROS 2 for real-time object detection.
   - Launch and Test YOLO Object Detection: Launch and test your YOLO object detection node in ROS 2, ensuring proper functionality for different objects.
   - Create a YOLO Human Tracker Node in ROS 2: Learn to create a YOLO-based human tracking node in ROS 2 for detecting and following humans in real-time.
   - Launch and Test YOLO Human Tracker: Launch and test the YOLO human tracker in ROS 2 to track humans in real-time.
   - Pose Estimation with YOLO: Learn how to perform **pose estimation with YOLO** in ROS 2 to estimate the positions and orientations of objects or humans.
   - Create a YOLO Pose Estimation Node in ROS 2: Learn how to create a YOLO Pose Estimation Node in ROS 2 to detect and estimate the poses of humans.
   - Launch and Test YOLO Pose Estimation: Launch and test the YOLO Pose Estimation node in ROS 2 to verify its functionality and assess pose estimation performance.
   - Segmentation with YOLO: Learn how to perform Segmentation with YOLO in ROS 2, enabling the identification and classification of objects within an image.
   - Create a YOLO Segmentation Node in ROS 2: Learn how to create a YOLO Segmentation node in ROS 2 to segment and classify objects within images using the YOLO model.
   - Launch and Test YOLO Segmentation: Launch and test the YOLO Segmentation node in ROS 2 to verify its performance in segmenting and classifying objects in real-time.
   - Conclusions: What did you learn in this unit?
7. **Project: Intelligent Inventory Management with ROS 2** — In this final unit, we will bring together all the knowledge and skills acquired throughout the course to tackle a real-world problem: Intelligent Inventory Management with ROS 2.
   - Introduction: What is this project about?
   - Intro to Intelligent Inventory Management with ROS 2: This unit serves as the foundation, providing a clear roadmap of the tasks and goals for the project.
   - Color Encoding Retrieval: Steps and hints to implement Color Encoding Retrieval for the final project.
   - Line Follower Pipeline: Steps and hints to complete the Line Follower Pipeline for the final project.
   - Inventory Checking Pipeline: Steps and hints to complete the Inventory Checking Pipeline for the project.

## ROS Perception in 5 Days
*Learn OpenCV, FaceRecognition, Person tracking and object recognition in ROS1Noetic system*
**Rating:** 4.3 (12 reviews)
📂 **Detailed lessons:** [`07perception/ros-perception-in-5-days/`](07perception/ros-perception-in-5-days/README.md)

### Overview
Perception is probably one of the most important things when we talk about autonomy. In this course you will learn how perception is performed by robots using the ROS Framework.

### What you'll learn
- At the end of this course you will fell comfortable about making robots do the following things: 1. Track objects by its color blobs 2. Navigate following floor lines with only RGB camera 3. Detect human faces and track them 4. Recognize different faces 5. Track a person through a 3D environment 6. Recognize flat surfaces like tables where object might be placed 7. Recognize objects and track them in 3D space with PointCloudSensors 8. Use Yolo for object recognition and tracking in 3D space

### Course outline
1. **Perception with ROS Intro** — Know what you will learn in this course and how
2. **Vision Basics Blob Tracking** — First steps in image perception through blob tracking
3. **Vision Basics Follow Line** — Learn about OpenCV and how to use it to follow lines
4. **Surface and Object Recognition** — Learn how to recognise flatsurfaces and objects
5. **Yolo 3D object location** — Yolo in ROS and 3D location
6. **Face Detection and tracking** — Learn how to detect people faces.
7. **Face Recognition** — Learn how to make Fetch robot able to recognise different people
8. **People Tracking** — Learn how to follow people using ROS Packages
9. **PhantomX Hexapod Perception Project** — You will apply all you learned in the course with an Hexapd names PhantomX
