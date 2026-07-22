AI Agents
Learn the fundamentals of AI Agents by programming real and simulated robots to perceive, decide, and act in dynamic environments.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
0 (0)
Course Overview
In this course, you will build intelligent agents that can understand their environment, reason over external and internal knowledge, and make decisions on their own. You’ll explore concepts like Retrieval-Augmented Generation (RAG), planning, and the use of large language models to bring these agents to life.
What You Will Learn

    By the end of this course, you’ll be able to:
    Design agents that react to sensory input and reason about goals
    Use LLMs to turn natural language into action plans
    Implement RAG pipelines to make agents more context-aware
    Coordinate multiple agents to share information and work together
    Understand how memory and retrieval improve decision-making

Course Summary
1. Welcome

This is the introductory unit to the AI Agents course
2. Introduction to AI Agents

This unit explores the fundamentals of building AI agents for robotics, starting from rule-based behaviors to advanced systems that use large language models and retrieval-augmented generation (RAG) for intelligent decision-making.
3. AI Agents for Perception

This unit focuses on use of AI Agents in Navigation related tasks
4. Agents for Navigation

This unit introduces AI agents for perception, showing how they use sensor data and large language models to understand the environment and make decisions. It covers vision and lidar agents and their role in autonomous systems.
5. Multi Agent Systems

This unit explores how multiple AI agents coordinate and collaborate in shared environments. It covers system types, task allocation strategies, and control methods like leader-follower and decentralized negotiation.
6. Capstone Project

This unit brings together everything you've learned. You'll build an AI agent that navigates with lidar, follows language instructions, and leads a multi-agent team, combining perception, planning, and teamwork into one complete system.
User Ratings

On device AI for Robotics
Learn to build, optimize, and deploy AI models directly on edge devices like the Raspberry Pi.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
5 (1)
Course Overview
This course provides a comprehensive, hands-on journey into Edge AI, teaching you how to design, optimize, and deploy artificial intelligence systems that run directly on embedded devices such as the Raspberry Pi 4 with a Google Coral TPU. Rather than relying on cloud-based inference, you will learn how to build intelligent systems capable of real-time, secure, and offline decision-making at the network edge. Starting with foundational concepts, the course walks through training a deep learning model, understanding the limitations of cloud AI for autonomous systems, and deploying optimized models using TensorFlow Lite. You will then dive into advanced optimization techniques—including quantization, pruning, clustering, and knowledge distillation—to dramatically reduce model size while maintaining performance. Finally, you will move beyond classification into real-world applications such as object detection, semantic segmentation, and even running compact large language models (LLMs) on resource-constrained hardware. By the end of the course, you will have built and deployed a complete Edge AI system capable of intelligent, on-device decision-making.
What You Will Learn

    Explain what Edge AI is and why on-device inference is critical for real-time, secure, and offline systems
    Set up and configure an Edge AI system using Raspberry Pi, Coral TPU, and a camera module
    Train and deploy deep learning models using TensorFlow Lite on edge hardware
    Apply key optimization techniques (quantization, pruning, and knowledge distillation) to reduce model size and improve performance
    Evaluate trade-offs between model accuracy, speed, and hardware constraints
    Implement real-world Edge AI applications such as image classification, object detection, and semantic segmentation
    Run and deploy compact large language models (LLMs) directly on a Raspberry Pi
    Build a complete Edge AI system capable of autonomous, on-device decision-making

Course Summary
1. Introduction to Edge AI
(0%)

This unit provides an introduction to the On-Device AI for Robotics course. Here, you will find a brief overview of the course contents along with a practical demonstration.
1.1
What is Edge AI

Introduction to Edge AI and how it processes data locally instead of relying on the cloud. Covers key benefits such as reduced latency, enhanced security, lower operational costs, and real-time intelligent decision-making at the network edge.
1.2
Natural Language Control of the Leo Rover

Practical demonstration on planet Constructia where the Leo Rover interprets natural language commands to autonomously capture images and perform object detection, showcasing real on-device AI execution.
1.3
Essential Hardware for Edge AI Development

Overview of required hardware components including Raspberry Pi 4, camera module, Google Coral USB accelerator, and supporting peripherals needed to build a complete on-device AI system.
1.4
Course Roadmap

Presentation of the complete course structure, outlining progression from Edge AI fundamentals through advanced optimization techniques (quantization, pruning, knowledge distillation), culminating in building a fully local AI agent on Raspberry Pi.
2. Foundations and Deployment
(0%)

This unit introduces the fundamentals of Edge AI in embedded systems, covering key concepts such as hardware constraints, AI model optimization, and deployment on resource-limited devices.
2.1
Edge AI for Embedded Systems

Exploration of Edge AI fundamentals for embedded systems, highlighting low latency and offline capabilities. Includes training and deploying a flower detection model on resource-constrained hardware while assembling physical components.
2.2
Neil’s Mission and Flower Classification on Constructia

Introduction to Neil’s exploration mission and demonstration of the Leo Rover navigating to sites, capturing images, and classifying flower species using on-device AI.
2.3
Training the Flower Classifier and Cloud Limitations

Dataset exploration and CNN model training for flower classification, while experiencing latency and transmission challenges of cloud-based AI, reinforcing the importance of on-device processing.
2.4
Understanding Edge AI Architecture and Challenges

In-depth explanation of how Edge AI works by processing data locally, its advantages such as real-time and offline functionality, and the constraints of deploying models on limited hardware.
2.5
Deploying with TensorFlow Lite and Quantization

Deployment of the trained model using TensorFlow Lite (LiteRT), converting the model format, applying quantization to reduce size, and testing optimized inference directly on the Leo Rover.
2.6
Setting Up the Raspberry Pi Edge System

Hands-on system assembly and setup, including Raspberry Pi 4B specifications, Coral TPU integration, camera installation, OS configuration, and running the first real-world flower classification model on the edge device.
3. Optimization Techniques for Edge AI
(0%)

In this unit, you will learn the most commonly used optimization methods for neural networks.
3.1
Overview of Edge Model Optimization Techniques

Introduction to key optimization methods: post-training quantization, quantization-aware training, pruning, clustering, and knowledge distillation, aimed at improving efficiency while maintaining accuracy.
3.2
Post-Training Quantization (FP32 to INT8)

Deep dive into post-training quantization, including its mathematical foundation, manual implementation, application to the flower classifier, and CPU vs TPU benchmarking (achieving 4× smaller size and 2× faster inference).
3.3
Quantization-Aware Training (QAT)

Implementation of quantization-aware training with custom fake-quantized layers, training under simulated quantization conditions, and comparing performance with post-training quantization.
3.4
Weight Pruning for Efficient Models

Application of magnitude-based and gradual pruning to remove less important weights, testing on Raspberry Pi, and achieving strong compression with improved speed and maintained or improved accuracy.
3.5
Weight Clustering with K-Means

Use of K-means clustering to group similar weights into centroids, visualization of clustering concepts, compression of the flower classifier, and evaluation of accuracy retention.
3.6
Knowledge Distillation: Teacher–Student Learning

Training a compact student model from a larger teacher network using custom distillation loss, achieving a model 15× smaller and 7× faster while maintaining high classification accuracy.
3.7
Comparing Optimization Trade-offs

Comprehensive comparison of quantization, pruning, cluster
4. Advanced Edge AI Applications
(0%)

In this unit, you will learn how to perform advanced AI tasks using your hardware setup. By the end, you will build your own AI agent.
4.1
Beyond Classification: Advanced Edge AI Applications

Expansion into practical applications including object detection, object tracking, semantic segmentation, and running large language models locally, leading toward building a complete AI agent system.
4.2
Preparing the Raspberry Pi Software Environment

Installation and configuration of required libraries such as TensorFlow Lite runtime, Edge TPU runtime, PyCoral, and camera support to prepare for advanced deployment.
4.3
Real-Time Object Detection with Coral TPU

Implementation of object detection using SSD MobileNet on the Coral TPU, capturing camera input, performing inference, drawing bounding boxes with labels and confidence scores, and saving annotated outputs.
4.4
Interactive Photo Capture and Semantic Segmentation

Workflow for live camera preview, user-approved image capture, semantic segmentation processing, and saving both raw and segmented outputs directly on edge hardware.
4.5
Running a Compact Large Language Model on Raspberry Pi

Deployment of the quantized DeepSeek-R1:1.5B model using Ollama in CPU-only mode, covering model selection, download, and real-time interactive chat within 4GB RAM constraints.
4.6
Fine-Tuning an LLM for Structured Function Calling

Fine-tuning DeepSeek R1 Distill Qwen 1.5B using LoRA training, dataset preparation, GGUF quantization, and deployment for structured JSON function calling on edge devices.
4.7
Mastering Edge AI for Real-World Impact

Final reflection on the learning journey, emphasizing how Edge AI enables secure, responsive, and cost-effective AI systems tailored for practical real-world deployment.
User Ratings

Machine Learning for Robotics
Machine Learning, Robotics
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
5 (5)
Course Overview
The course covers: ✅ LiDAR Navigation ✅ Feature Engineering & Clustering ✅ Data Augmentation ✅ Regression & Neural Networks ✅ Object Detection
What You Will Learn

    Learn machine learning for robotics with TurtleBot4's LiDAR & RGB camera:

Course Summary
1. Introduction
(0%)

An introduction to the course Basic Machine Learning for Robotics, providing a high-level demonstration of what you will build and achieve throughout the program. It presents how machine learning techniques can be applied to robotic systems, particularly focusing on navigation using LiDAR and RGB camera data.
1.1
Course Demo

An opening of the course with a high-level preview of what the you will build. The robot is a TurtleBot4 in a simulated office environment, starting completely stationary and unprogrammed.
1.2
Preview of Unit2

Previews unit 2 as a foundations unit covering the core building blocks of machine learning. It introduces the supervised/unsupervised distinction, builds up classical algorithms including decision trees, SVMs, linear regression, and K-Means clustering.
1.3
Preview of Unit3

A preview of unit 3 as the first hands-on data collection unit, where we gather real LiDAR and odometry data directly from TurtleBot4 in simulation.
1.4
Preview of Unit4

A preview of unit 4 as the unit where data from unit 3 gets transformed into a working navigation system.
1.5
Preview of Unit5

A preview of unit 5 as the data augmentation and clustering unit. The focus shifts from modeling to dataset quality — teaching noise injection to simulate real-world sensor variability and clustering-based feature extraction to make datasets more robust.
1.6
Preview of Unit6

A preview of unit 6 which focuses on object detection, leveraging TurtleBot4's built-in RGB camera.
1.7
Why this course?

Motivates the course's broader relevance. Making the case for why machine learning and robotics belong together, positioning the skills taught — ROS2, LiDAR processing, TensorFlow, PyTorch, computer vision — as directly transferable to a wide range of real-world domains.
1.8
Conclusion

A summary, a look ahead to Unit 2, an instructor introduction, and acknowledgments. The recap consolidates the five-unit arc previewed in sections 1.2–1.6, reaffirming the overarching goal of transforming TurtleBot4 from a stationary robot into an intelligent navigator.
2. Machine Learning Overview
(0%)

Introduces the fundamentals of probability and statistical modeling as applied to robotics and machine learning. It explains key concepts such as random variables, probability distributions, expectation, and variance, building the mathematical foundation needed to reason under uncertainty. An exploration of how probabilistic models can represent sensor noise and real-world variability in robotic systems.
2.1
Unit Overview

An overview of machine learning fundamentals. From a full breadth of classical ML: supervised vs. unsupervised learning, classification algorithms (logistic regression, k-NN, SVM), training concepts (gradient descent, overfitting, regularization).
2.2
Introduction to Machine Learning

Introduces machine learning by contrasting it with traditional programming — the key distinction being that traditional programming maps inputs and rules to outputs, while ML inverts this by learning rules from inputs and outputs
2.3
Classification

Covers classification, introducing binary vs. multiclass classification, three core algorithms (logistic regression, k-NN, SVM), and the full set of evaluation metrics: accuracy, precision, recall, F1 score, and confusion matrix — each grounded in a robotics context where false negatives in obstacle detection could cause collisions.
2.4
Training Models

Gives a guide through using Python, pandas, and SQL-style queries to explore and analyze a supermarket sales dataset, focusing on filtering, grouping, and summarizing data for insights. It is designed to build practical data analysis skills step-by-step, helping you understand how to answer real-world questions from tabular data in a structured, hands-on way
2.5
Support Vector Machines

A how to perform advanced data manipulations using Python's pandas library on the supermarket sales dataset, including merging datasets, handling missing values, and creating new features for deeper analysis.
2.6
Decision Trees

Covers decision trees, explaining the tree structure of nodes, branches, and leaves, and introducing the two core concepts behind how splits are made: entropy (measuring data impurity) and information gain (measuring how much a split reduces that impurity).
2.7
Dimensionality Reduction

Looks at dimensionality reduction, introducing PCA and t-SNE as the two core techniques. PCA is described as a linear method that projects data onto principal components capturing maximum variance, useful for speeding up models and preprocessing
2.8
Clustering

Tackles clustering and covers K-Means and hierarchical clustering. Rather than working with a toy dataset, the coding example takes on the handwritten digits dataset in its full 64-dimensional form, first compressing it to 2D with PCA and then running K-Means with 10 clusters.
2.9
Artificial Neural Networks

Closes the unit by building up artificial neural networks from first principles — starting with a single-neuron perceptron, progressing through multilayer perceptrons, and culminating in a full deep network trained on MNIST handwritten digits.
3. Supervised Learning
(0%)

Focuses on multivariate probability models and how they are used to represent relationships between multiple random variables in robotics and machine learning. We learn about joint, marginal, and conditional distributions, as well as how to interpret dependencies between variables.
3.1
Introduction

An introduction to the unit, shifting from theory to hands-on robotics work. Here, we cover regression fundamentals, real sensor data collection from TurtleBot4's LiDAR and odometry, data exploration, and sensor fusion visualization — culminating in a live animated replay of the collected data.
3.2
Project Setup

Walks through setting up the ml_turtlebot4_supervised ROS2 package that will serve as the project home for the rest of the course.
3.3
Introduction to Regression

Introduces regression as the supervised learning method at the heart of this unit — predicting continuous outputs like robot velocity and obstacle distance from LiDAR and odometry inputs.
3.4
Data Collection

Covers data collection from TurtleBot4's LiDAR, odometry, and camera sensors through a series of ROS2 nodes, culminating in an autonomous recovery node that keeps the robot moving during collection.
3.5
Data Exploration

Covers data exploration, walking through initial inspection of the collected sensor data — checking structure, data types, missing values, and out-of-range readings — before producing distribution plots for LiDAR distance readings, linear velocity, and angular velocity.
4. Supervised Learning II
(0%)

Introduces us to Bayesian reasoning and how probabilistic inference can be used to update beliefs in light of new evidence. It explains core concepts such as prior and posterior distributions, likelihood functions, and Bayes’ theorem, emphasizing their role in decision-making under uncertainty.
4.1
Introduction

Opens the unit by building directly on the previous' unit collected data.We will move through data preprocessing, feature engineering, data augmentation, and finally training and real-time testing of both Ridge Regression and TensorFlow neural network models on TurtleBot4 in Gazebo.
4.2
Data Preprocessing

Covers data preprocessing — cleaning the raw sensor data and normalising it for model training. Invalid LiDAR readings are replaced, unnecessary columns are dropped, and MinMaxScaler is applied separately to LiDAR (0 to 1) and odometry (-1 to 1) data.
4.3
Feature Engineering Preview

Introduces feature engineering by transforming raw LiDAR readings into spatial summaries — dividing the sensor's 360° view into front, left, back, and right regions and calculating min, mean, and variance for each.
4.4
Data Augmentation

Section on data augmentation using mirroring as the sole technique to address the biases identified in the previous section — creating negative linear velocity samples from positive ones and diversifying angular velocity by mirroring high-turn values.
4.5
Building and Applying Regression Models

A sub-unit where the models meet the real robot. A Ridge Regression model is trained on the preprocessed data using cross-validated hyperparameter tuning to find the best regularisation strength, then deployed as a ROS2 node that subscribes to live LiDAR data, scales it, generates velocity predictions, and publishes them directly to TurtleBot4's command topic.
4.6
Ridge Regression, Feature & Augmented Model Training

Repeats the Ridge Regression training and deployment pipeline, but this time using the feature-engineered dataset rather than the raw preprocessed one.
4.7
TensorFlow Neural Network Regression Model Training

Replaces Ridge Regression with a TensorFlow neural network — trained on the same preprocessed data to handle the non-linear relationships that Ridge struggles with. Early stopping, model checkpointing, and learning rate reduction are all in place during training.
4.8
TensorFlow Neural Network Regression Feature & Augmented Model Training

The final model variant in the unit — the same TensorFlow architecture from the previous section, but trained on the augmented and feature-engineered dataset rather than the raw preprocessed one.
4.9
Solutions

Closes the unit with a solutions reference, pointing us to the cumulative Bitbucket repository where we can verify our work against expected outputs.
5. Data Augmentation and Feature Engineering
(0%)

Introduces sequential probabilistic models and how they are used to represent systems that evolve over time. It explains the foundations of temporal modeling, including state transitions, observation models, and recursive estimation techniques. We will explore how uncertainty is propagated and updated step by step as new data becomes available.
5.1
Introduction

Opens the unit by shifting focus from model architecture to dataset quality. Building on the biases and limitations observed in the previous unit, we explores advanced data augmentation — noise injection, speed randomisation, dynamic obstacle simulation, and data synthesis.
5.2
Revisiting Key Concepts in Dataset Analysis

Revisits the collected dataset with fresh eyes, examining it across three quality dimensions: noise detection, scenario representation, and temporal consistency.
5.3
Enhanced Dataset Augmentation

Explains how to systematically augment the existing sensor data to create a richer and more diverse dataset for machine learning. It focuses on simulating real-world variations and edge cases to improve model robustness and generalization without incurring the cost of new data collection.
5.4
Synthetic Data Generation for LiDAR and Odometry

Explains when and why to generate additional or synthetic data to improve a model’s ability to generalize, especially for edge cases, rare conditions, and class imbalances. We focus on practical techniques such as adding noise, simulating boundary scenarios, and appending synthetic samples to the original dataset to create a larger, more diverse training set
5.5
Clustering Based Features

Teaches how to apply K-Means clustering to LiDAR data after converting it from polar to Cartesian coordinates, enabling robots to identify obstacle groupings and spatial patterns. Emphasizing on handling invalid readings and extracting key features like cluster counts and centers to inform navigation and path planning.
5.6
Unit Exercise

Serves as a comprehensive capstone exercise that integrates synthetic dataset generation with clustering analysis on LiDAR data.
5.7
Summary and Insights

Summarizes key advancements in data quality, augmentation, and clustering for TurtleBot4 navigation, highlighting improvements like Gaussian noise injection and obstacle-aware features.
5.8
Solutions

Provides access to complete unit solutions via a cumulative Bitbucket repository, matching the expected screenshot outcomes for verification.
6. Object Detection, Classification and Tracking
(0%)

Introduces the advanced state estimation techniques used in robotics for dealing with nonlinear systems and complex uncertainty.Also explaining how prediction and correction steps are extended beyond simple linear models to handle real-world robotic dynamics. We explore practical filtering approaches for estimating a robot’s state from noisy sensor measurements over time.
6.1
Introduction

An introduction to the unit which will give the TurtleBot the ability to detected objects in its environment using an RGB camera.
6.2
Object Detection

Focuses on integrating real-time object detection into robotic systems using ROS2, with an emphasis on processing live camera data and deploying YOLOv5 for visual perception tasks.
6.3
Baseline Implementation

Introduces a baseline ROS2 script that performs real-time object detection on the TurtleBot4’s RGB camera using the pre-trained YOLOv5s model. Showing how to process camera data, run detections, and publish annotated visual outputs through ROS2 for further robotic perception tasks.
6.4
Enhancing the Object Detection System

Explores how adjusting confidence thresholds affects YOLO’s detection accuracy and reliability. We will experiment with different threshold values to analyze their impact on precision, recall, and overall detection performance in real-time applications.
6.5
Object Tracking for Living Beings

Introduces real-time object tracking for high-confidence detections of living beings such as people, dogs, and cats. It covers integrating the SORT algorithm with YOLO-based detection to assign unique IDs, maintain object states, and visualize tracked entities in RViz or OpenCV.
6.6
Demostration and Insights

Demonstrates real-time tracking of living beings using unique IDs for consistent identification across frames. It highlights how SORT enhances detection accuracy and supports applications like behavior analysis and dynamic obstacle avoidance in robotic systems.
6.7
Solutions

A sample solutions sub-unit, demonstrating a complete ROS2 workflow from subscribing to camera data through processing and publishing enhanced outputs, showcasing how to integrate and test the added functionality in a realistic robotic setting.
User Ratings

Deep Learning Basics
You will learn deep learning basics.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
5 (1)
Course Overview
Take your first step into Neural networks the base for all the AI done nowadays.
What You Will Learn

    Deep Learning foundations:
    Basics about neural networks
    Deep Neural networks
    Loss, optimization, and gradient descent.
    Training Deep Neural Networks
    Convolutional Neural Networks

Course Summary
1. Introduction to Deep Learning
(0%)

Introduces the course and providing a brief overview of what will learnt throughout the program.An explanation of the relationship between artificial intelligence, machine learning, and deep learning, highlighting how deep learning has driven many recent breakthroughs in AI applications.
1.1
Introduction

Introduces the foundational ROS 2 workspace and node structure used throughout the course, using a simple example to illustrate core concepts.Guiding us through building, running, and understanding their first ROS 2 node, establishing the baseline for later, more advanced robotics functionality.
1.2
Demostration

demonstrates expected terminal outputs for a ROS2-based intruder detection system, covering scenarios from no-person detection to person identification and intruder alerts.
1.3
Course outline

An outline of what we will learn in this course from basic concepts of Neural Networks to Deep neural networks and the process of training them for a task like image segmentation.
1.4
Previous knowledge

A list of courses required to fully understand the concepts encountered in the course and use them effectively.
1.5
Acknowledgements

Special thanks to those that made the course possible.
2. Neural Networks
(0%)

Introduces the fundamental building blocks of neural networks and how they are used to model complex patterns in data. Explaining key concepts such as neurons, layers, activation functions, and how inputs are transformed as they pass through a network.
2.1
Introduction

An introduction to the unit explaining the fundamental concepts of Neural networks and it's outline. Additionally introduces the tasks that will be used to explain these concepts.
2.2
The Perceptron

Introduces the perceptron, or artificial neuron, modeled after biological neurons to explain how brain function emerges from interconnected structure.Covering Frank Rosenblatt's 1958 model, describing neuron anatomy with dendrites receiving inputs and axons delivering outputs, framing cognition as input-output processing.
2.3
Connecting Artificial Neurons

Presents a robotics scenario where a novice chef robot learns optimal cake batter mixing times through neural network regression on empirical data. Challenging the robot to reconstruct a curve predicting final cake height from mixing duration.
2.4
Universal Approximation Theorem

Demonstrates how a neural network with multiple hidden neuron pairs can approximate piecewise constant step functions by partitioning the input space into configurable intervals.
2.5
Teaching the Gatekeeper to read

Applies neural network concepts to teach the Gatekeeper robot character recognition as the first step toward reading its grandmother's cookbook recipe. It breaks down the reading process into scanning text, segmenting characters, and identifying them to produce a digital version of the content for robotic task execution
2.6
Shallow Neural Networks

Formalizes the structure of feed-forward shallow neural networks with one hidden layer, detailing input vectors, hidden computations via weights and biases, and output generation. It connects artificial neurons to biological inspiration and previews deeper architectures for enhanced power in subsequent deep learning applications before closing the unit.
3. Deep Neural Networks
(0%)

Advances from shallow to deep neural networks using ReLU activations across multiple hidden layers, demonstrating superior modeling power on 11D regression tasks like Gatekeeper's pasta sauce quality prediction from sensor data.
3.1
Introduction

Advances from shallow to deep neural networks by composing multiple hidden layers, introducing ReLU activation, and training on 11-dimensional regression tasks to showcase greater modeling power.
3.2
Using a Shallow Neural Network

Challenges the Gatekeeper robot to apply shallow neural networks to a complex problem, leveraging their proven ability to approximate arbitrarily complex high-dimensional functions with sufficient hidden units.
3.3
Partitioning the input space

Deepens the earlier discussion on how neural network architectures and activation functions partition input space, moving from logistic sigmoid to the widely used Rectified Linear Unit.
3.4
Generalizing to Deep Neural Networks

Analyzes how composing two shallow neural networks forms a deeper model by feeding the first network’s output into the second.
3.5
Helping the Gatekeeper

Transitions from theory to practice by deploying deep neural networks to predict family meal quality ratings from 11-sensor measurements of the father's pasta sauce. Leveraging the Gatekeeper robot's historical data of physical properties and ratings to train a regression model for real-time sauce evaluation
3.6
Are many Layers Needed?

Examines why deep neural networks outperform shallow ones in practice despite the Universal Approximation Theorem's guarantee that shallow networks can theoretically learn any function.
4. The Training Process
(0%)

Covers the complete neural network training pipeline through Gatekeeper robot sauce classification, from data collection/preprocessing of chemical properties to model definition for predicting tomato-based sauce variants.
4.1
Introduction

Introduces the unit that will cover the complete neural network training pipeline, covering data collection, loss function design, gradient descent optimization, and model validation techniques. Through the Gatekeeper robot scenario.
4.2
Defining the model

Outlines building and training a supervised classification model that predicts sauce types (pure tomato, carrot-tomato, or tomato-cream) from chemical property inputs using labeled data pairs.
4.3
Collecting and preprocessing the data

Emphasizes data collection as the critical foundation for deep learning success, highlighting how dataset quantity and quality directly determine model capabilities and generalization.
4.4
A Comparison Criterion

Introduces loss functions as the mathematical criterion to quantify prediction errors between neural network outputs and true labels in supervised learning. Explaining how minimizing the loss during training adjusts model parameters to achieve accurate predictions.
4.5
Adjusting the model's parameters

Establishes cross-entropy loss as the optimization criterion for multiclass sauce classification and introduces gradient-based methods to adjust deep neural network weights and biases.
4.6
Measuring Perfomance

Explains why perfect training accuracy doesn't guarantee good generalization, stressing the need to split data into training and test sets. It breaks down performance limitations into noise (data uncertainty), bias (model assumptions), and variance (finite dataset effects) that prevent capturing the true underlying function.
5. Global Exercise
(0%)

Capstone exercise on training a feedforward neural network for alphanumeric character recognition, enabling the Gatekeeper robot to read cake recipe text from Gazebo cookbook images.
5.1
The Problem

A capstone unit challenges you to independently train a neural network for character recognition so the Gatekeeper robot can read cake recipe ingredients from an open cookbook in Gazebo simulation.
5.2
Collecting the data

Provides a pre-prepared dataset of classified alphanumeric character images for training an artificial neural network for character recognition without manual data gathering, enabling the Gatekeeper robot to identify cookbook text for cake recipe extraction.
5.3
Data preprocessing

Focuses on preprocessing grayscale character images by flattening them into 784-pixel input vectors and applying standardization to reduce pixel value variability. Creating a CustomDataset class and spliting data into training/testing sets to prepare clean.
5.4
The model

Gives a guide through implementing a feedforward Artificial Neural Network architecture for character recognition, defining input layer, hidden layers with activations, and output layer with appropriate activation for alphanumeric classification.
5.5
A comparison criterion

Defines the multiclass cross-entropy loss function derived from Maximum Likelihood Estimation to quantify prediction errors for alphanumeric character classification.
5.6
Training the model

Implements the training loop using mini-batch gradient descent and PyTorch's CrossEntropyLoss to optimize the character recognition neural network, analyzing training vs test loss/accuracy curves to assess convergence and generalization.
5.7
Read the recipe

Completes the Gatekeeper's character recognition pipeline by implementing model inference methods across Character, Word, and Text_Image classes to convert cookbook images into digital strings.
6. Optimization, Gradient Initialization and Regularization
(0%)

Covers optimization from gradient descent through SGD, Momentum, and Adam, with backpropagation for efficient gradient computation and Xavier/He initialization to prevent vanishing gradients. Explicit L2 regularization controls complexity alongside implicit regularization from SGD dynamics, enhanced by heuristics like dropout, batch normalization, and early stopping for robust training
6.1
Introduction to Gradient Descent

Introduces gradient descent optimization, model evaluation beyond training accuracy, and regularization techniques to prevent overfitting and improve generalization to unseen data.
6.2
Stochastic Gradient Descent

Demonstrates Stochastic Gradient Descent (SGD) through hands-on Python exercises that implement loss computation and parameter updates for fitting a Gabor model to synthetic 30-point training data.
6.3
Momentum

Explains Momentum as an enhancement to SGD that accelerates gradient descent convergence by maintaining a velocity vector combining current gradients with prior update directions.
6.4
Adam Optimization

Demonstrates why Adam optimizer outperforms basic gradient descent on complex loss landscapes through hands-on exercise, visualizing optimization paths on a 2D loss function with anisotropic curvature.
6.5
Backpropagation

Explains backpropagation as the efficient gradient computation algorithm essential for neural network training, using forward passes to store activations and backward passes to propagate error signals through layers.
6.6
Backpropagation example algorithm

Demonstrates backpropagation through an exercise by computing complex derivative chains for a nested composite function of sine, exponential, and cosine operations with 8 parameters.
6.7
Parameter Initialization

Covers parameter initialization strategies like Xavier/Glorot and He methods to prevent vanishing/exploding gradients by maintaining consistent activation variances across layers
6.8
Explicit Regularization

Explains explicit regularization by adding penalty terms like L2 (weight decay) to the loss function, balancing data fit against model complexity through the lambda hyperparameter.
6.9
Implicit Regularization

Contrasts implicit regularization—arising naturally from optimization dynamics like SGD's mini-batch randomness, early stopping, and model architectures—with explicit penalty terms.
6.10
Heuristics to improve Perfomance

Surveys practical heuristics that boost deep learning performance including learning rate scheduling, dropout, batch normalization, data augmentation, and early stopping.
7. Convolutional Networks
(0%)

Introduces Convolutional Neural Networks (CNNs) as efficient architectures for image processing in robotics, overcoming fully connected networks' limitations with spatial invariance/equivariance and shared-weight kernels that detect local features like edges and textures. Culminating in applications in the robotics environment based on the exercises.s
7.1
Invariance and Equivariance

Introduces the unit on convolutional neural networks, defining CNNs as specialized architectures for image processing, addressing fully connected networks' inefficiencies with high-dimensional data, ignored spatial relationships, and poor handling of geometric transformations.
7.2
A Convolutional Operation for 1D Inputs

Introduces the core convolution operation using 1D inputs, where a small kernel of shared weights slides across the input vector to compute local weighted sums with bias and activation.
7.3
Convolutional Networks for 2D inputs

Implements 2D convolution through hands-on PyTorch exercise using MNIST dataset, defining a SimpleCNN with stacked Conv2d layers, ReLU activations, max-pooling, and fully connected classifiers.
7.4
Upsampling/Downsampling

Demonstrates downsampling (subsampling) through an exercise using a 4×4 pixel patch reduced to 2×2 by selecting every other element from 2×2 blocks.Thus halving spatial dimensions while preserving key structural information.
7.5
Applications

Explores practical CNN applications in robotics, focusing on classification where convolutional networks identify objects like intruders vs family members from camera feeds.
7.6
Summary

Consolidates CNN architecture fundamentals: convolutional layers apply shared-weight filters across images to detect edges/textures efficiently, pooling enables downsampling, and channel depth increases for hierarchical features culminating in fully connected classification layers.
User Ratings

PyTorch Essentials for Robotics
Learn foundational PyTorch tools for AI development through hands-on robotics examples.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
5 (2)
Course Overview
Get a strong foundation on how PyTorch works using robotics.
What You Will Learn

    You will learn:
    Basic tools in PyTorch
    Working with tensors
    Creating and managing AI datasets for training
    Building AI models
    Training various AI models with applications in robotics

Course Summary
1. Course presentation
(0%)

Execute a small demo of what you will be able to do once you finish this course.
1.1
Demo

Demo of the course.
2. Tensors and PyTorch basics
(0%)

Learn about basic operations with PyTorch and learn what are tensors.
2.1
Index

Index of unit.
2.2
Why and What

Learn why to use PyTorch.
2.3
Course mission

Learn what the course mission is.
2.4
What is a Tensor

Learn what tensors are.
2.5
Basic Operations with Tensors

Learn the basic operations with tensors.
2.6
Tensor Data types

Learn about the different data types inside tensors.
2.7
Manipulating tensors

Learn the different operations to be able to modify tensors.
2.8
Min, max

Learn about methods which help us know which are the maximum and minimum values in a tensor, used for optimization and for learning.
2.9
CPU or GPU

How to use CPU or GPU
3. Datasets
(0%)

Learn how PYTorch can help you manage one of the unsung heroes of AI training: datasets.
3.1
Index

Index of the unit.
3.2
Generate the training Dataset

Learn the procedure for generating a training dataset.
3.3
Datasets in Python

Learn more details on how to use datasets in PyTorch
3.4
Extra Datasets

Learn more info about how to access and manage datasets in PyTorch.
4. AI Models creation
(0%)

Learn how PyTorch can speed up the creation of AI models, providing ready-to-use common building blocs.
4.1
Index

Contents of this unit
4.2
PyTorch NeuralNetwork Modules Basics

Learn about the different modules that you can use to build neural networks.
4.3
Create your own Neural Network for detecting the mini_keyboard

Learn how to create your own Neural Network for detecting the mini_keyboard
5. Ai training PyTorch tools
(0%)

Learn how PyTorch can help you in the training of Ai models.
5.1
Index

Contents of the unit.
5.2
PyTorch Training Basics

Use all we have learned in the previous units for training a model.
5.3
Train a Mini Keyboard Detector Project

Train a Mini Keyboard Detector Project
User Ratings

Intermediate Generative AI for Robotics
Master cutting-edge generative AI models applied to robotics.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.5 (6)
Course Overview
This course offers an engaging dive into the world of Generative AI at an intermediate level, seamlessly blending theory with practical application. Students will explore advanced AI techniques such as imitation learning, diffusion-based navigation, and state-of-the-art transformer architectures, gaining both the knowledge and hands-on experience needed to tackle real-world challenges in robotics and beyond.
What You Will Learn

    **Data Generation and Collection for Generative AI**: Gain expertise in crafting and managing high-quality datasets to power advanced AI systems.
    **Imitation Learning**: Understand how AI models can replicate expert behavior to solve complex tasks across diverse applications.
    **Diffusion-Based Models**: Explore how diffusion techniques enable AI to predict outcomes, generate solutions, and adapt to dynamic challenges.
    **Detection Transformers (DETR)**: Discover how transformers are revolutionizing object detection, unlocking new possibilities in computer vision.
    **Vision Transformers (ViT)**: Learn how transformers analyze visual data to make intelligent, real-time decisions in sophisticated scenarios.

Course Summary
1. Introduction
(0%)

In this unit, we set up the stage for the entire course, outlining what to expect. It covers the course structure, prerequisites, and key contributors behind the material.
1.1
Intro

Unit summary and introduction.
1.2
Demo

Practical Demonstration of what will be covered in this course.
1.3
Course Outline

Course description and milestone outline.
1.4
Requirements

Minimum prerequisites for starting the course.
1.5
Vote of Thanks

Vote of thanks to contributors who made the course possible.
1.6
About Author

A brief summary of the course author.
2. Imitation Learning
(0%)

An introduction to Imitation Learning as a strategy for training autonomous robots by learning from expert demonstrations. Using a Mars rover as a running example, we explore Behavioral Cloning and its practical implementation through ROS-based data pipelines.
2.1
Introduction

Introduction to Imitation Learning and set up the mission premise.
2.2
What is Imitation Learning

Exploring the fundamentals of Imitation Learning and its key technique, Behavioral Cloning, which trains a robot to mimic expert demonstrations by mapping observations to actions. We also clarify how Behavioral Cloning differs from general Supervised Learning, setting the foundation for teaching our Mars rover to navigate autonomously.
2.3
Behavioral Cloning In Action

A walk through the full Behavioral Cloning pipeline in action, from collecting expert rover demonstrations via ROS topics, to training a model and deploying it autonomously.
2.4
Exercises

Putting our imitation learning knowledge to the test through two hands-on exercises involving a robot rover. We practice extracting odometry and velocity data from ROS bag files into CSV format, then extend our behavior cloning model to include safety checks that clamp predicted velocities within safe operating limits.
3. Diffusion Models
(0%)

A deep dive into diffusion models, a powerful class of generative AI that learns to reconstruct data from noise. In this unit, we apply these models to Mars rover navigation, using image-based similarity techniques to guide autonomous decision-making.
3.1
Intro to Diffusion Models

Gives a high-level overview of what the unit will cover, from the fundamentals of diffusion models to data preprocessing, training, inference, and real-world evaluation.
3.2
What are Diffusion Models

Explores the fundamentals of how diffusion models work by exploring their two core phases — a forward process that gradually adds noise to data, and a reverse process that learns to remove it to generate structured outputs.
3.3
Diffusion Models for Mars

Implementing a diffusion model for Mars rover navigation, covering data preprocessing, model training, inference, and using cosine similarity to measure how closely the rover's current view matches a satellite goal image.
3.4
Exercises

Hands-on tasks for diffusion models: implement a sinusoidal noise schedule and use cosine similarity for image-based goal detection in robot navigation. Shows how these changes influence training behavior and stopping decisions.
4. Transformers
(0%)

An exploration of the transformer architecture and its remarkable ability to model long-range relationships in data. Here, we apply transformers to object detection on the Mars rover, comparing different positional encoding strategies along the way.
4.1
Intro to Transformers

This sub-unit introduces us to Transformers, with the goal of building a comprehensive understanding of their fundamentals, key elements like attention and encoding, and positional encodings. We will apply this knowledge hands-on by implementing a Transformer model for object detection as a Mars rover navigates the surface of Mars in the coming sub-units.
4.2
What are Transformers

To give a strong foundation for understanding transformers, their key elements as well as the various types of encodings. Finalizing with a transformer implementation for object detection on Mars.
4.3
Transformers for Mars

Applying transformers to Mars rover object detection using DETR, implementing and comparing sinusoidal versus learned positional encodings to see how each affects model performance. We also contrast transformers with CNNs, highlighting why transformers are better suited for robots operating in complex, long-range environments like Mars.
4.4
Exercises

Hands-on exercises that challenge us to improve the DETR object detection pipeline by cropping wheel noise from the rover's camera feed and implementing a hybrid positional encoding that combines sinusoidal and learnable embeddings.
5. Real-Time Decision Making
(0%)

This unit focuses on Vision Transformers and their role in enabling real-time, dynamic decision-making for autonomous robots. In this uni,t we integrate camera-based and Lidar data to build a system that allows the Mars rover to reactively navigate around unexpected obstacles.
5.1
Introduction

In this snippet, we are introduced to Unit 5's mission of using Vision Transformers for real-time decision making, enabling the Mars rover to dynamically adjust its path while avoiding unexpected obstacles.
5.2
What are Vision Transformers

Exploring how Vision Transformers work by breaking images into patches and using self-attention to capture global context, then dive into hands-on visualizations of attention maps, positional embeddings, and multi-head attention to understand how the model interprets images.
5.3
Vision Transformer for Real-Time Decision Making

Deploying a Vision Transformer for real-time Mars rover navigation, combining camera-based velocity prediction with Lidar data to dynamically avoid obstacles only when they fall within a critical distance threshold.
5.4
Exercises

Putting our Vision Transformer knowledge to the test through two exercises — visualizing all attention heatmaps on a new image, and modifying the rover's navigation node to rely solely on ViT-predicted velocities without the Lidar heuristic override.
6. Capstone Project
(0%)

Bringing together all the concepts and techniques covered throughout the course into a comprehensive end-to-end project. We build two parallel AI pipelines — visual navigation and object detection — and deploy them simultaneously on the Mars rover.
6.1
Introduction

An introduction to the Capstone Project, where we bring together everything learned in the course by building two parallel pipelines — a Visual Navigation Transformer and a DETR Object Detection system — for the Mars rover.
6.2
Visual Navigation

Now, we build the full Visual Navigation pipeline from scratch — collecting expert rover demonstrations via ROS bag, preparing the data, defining the ViT model architecture, training it, and finally deploying it for autonomous obstacle-aware navigation.
6.3
Object Detection

Finally, we implement the DETR object detection model from scratch using a ResNet-50 backbone, positional encodings, and a Transformer, then run both the visual navigation and object detection pipelines simultaneously on the Mars rover.
User Ratings

Mastering Reinforcement Learning for Robotics
This course introduces reinforcement learning for robotics, covering core concepts, Q-Learning, and Deep Q-Learning (DQL).
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.6 (14)
Course Overview
Integration of AI and robotics with a focus on Reinforcement Learning and autonomous decision-making.
What You Will Learn

    Reinforcement Learning, AI, ROS 2

Course Summary
1. Course Intro

This unit provides an introduction to reinforcement learning for robotics, covering fundamental concepts and an overview of course objectives
2. Fundamentals of Reinforcement Learning

This unit delves into the fundamentals of reinforcement learning, providing an overview of core concepts and their application in robotics
3. Q-Learning

This unit focuses on Q-Learning, a fundamental algorithm in reinforcement learning.
4. Deep Q-Learning

This unit explores Deep Q-Learning (DQL), an advanced reinforcement learning technique that leverages deep neural networks to approximate Q-values.
User Ratings

AI Foundations for Robotics
AI, AI for beginers, AI basics, probability
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
5 (2)
Course Overview
In this course, through robot simulations, we will guide you in your first steps into the AI world. Understanding the topics explained in this course is crucial for being able to develop your own models. Let's learn AI Foundations together!
What You Will Learn

    Univariate probability, multivariate probability, statistics, decision theory, information theory, logistic regression.

Course Summary
1. Introduction to AI for Robotics
(0%)

This unit introduces the AI Foundations for Robotics course. It includes a short preview of the course contents and a practical demo.
1.1
Introduction

Provides a high-level overview of the course, emphasizing that AI is transforming industries and is essential knowledge for anyone pursuing a career in technology.
1.2
Demonstration

Showcasing a pre-trained image classification model that identifies four objects — a lamp, a ball, a plant, and a compacted trash cube — while also handling uncertainty by refusing to classify ambiguous inputs.
1.3
Course Outline

Lays out the full course outline for the AI Foundations for Robotics course, using the WALL-E-inspired Axiom storyline as a narrative thread to motivate the learning journey.
1.4
Prerequisites

An outline of the background knowledge recommended before diving into the course.
1.5
Acknowledgements

Acknowledgements section that credits the ROS Community and Gazebo Team as essential contributors to making the course possible.
2. Probability Through Univariate Models
(0%)

Introduces the core concepts of univariate probability theory and frames the learning around a practical goal — helping the AI bot cleaning robot efficiently search for rubbish around the Axiom.
2.1
Introduction

A brief introduction to the univariate probability theory unit, including two most important references for further research and in-depth look.
2.2
Intro to Probability

A dive into the foundational concepts of probability, using the narrative of WALL-E wandering through the Axiom and leaving trash cubes behind as a motivating problem, along the way also introducing key probability concepts of experiments, sample spaces, and events.
2.3
The concept of Probability

Introducing the two main interpretations of probability — frequentist and Bayesian — using WALL-E's path choices through the Axiom as a concrete illustration of each.
2.4
Probability of Events

Covers the formal rules of probability of events, introducing the mathematical properties of probability values between 0 and 1, and explaining set operations — union, intersection, and complement — illustrated through Venn diagrams.
2.5
Probability of the Union of Events

Introduces the additive rules of probability, explaining how to calculate the probability of the union of two events in general, and the simpler special case where two events are disjoint then applying this theory to the WALL-E scenario.
2.6
Probability of the Complement

Covers two closely related topics — the probability of a complement and conditional probability — building naturally on the additive rules from the previous sub-unit.
2.7
The Product Rule

Covers three closely interconnected and powerful concepts — the product rule, the total probability theorem, and Bayes' rule — building systematically on the conditional probability and using WALL-E's paths through the Axiom as the running example.
2.8
Random Variables

Introduces the concept of random variables, explaining how they serve as functions that map events in a sample space to real numbers, using WALL-E's path lengths as a concrete example.
2.9
Moments of a Distribution

A concise, theory-focused section introducing summary statistics — specifically the mean (expected value) and variance — as tools for describing probability distributions.
2.10
Common Univariate Discrete Probability Distributions

Covers the most common univariate discrete probability distributions — the Bernoulli, Binomial, Geometric, Poisson, Categorical, and Multinomial distributions — each introduced through practical scenarios involving the AI bot cleaning rooms that WALL-E has passed through.
2.11
Common Univariate Continuous Probability Distributions

Covers the most common univariate continuous probability distributions — the Uniform, Gaussian (Normal), Exponential, and Beta distributions — presenting the theory, probability density function, mean, and variance for each.
2.12
Exercises

A capstone exercise unit bringing together all the probability concepts covered throughout the unit into one rich, narrative-driven problem to be solved.
3. Probability Through Multivariate Models
(0%)

This unit introduces the fundamentals of multivariate probability and how multiple random variables can be analyzed together. It explores joint probability distributions and demonstrates how to model relationships between variables in realistic robotics scenarios.
3.1
Introduction

A brief introduction to Unit 3: Probability Through Multivariate Models. It signals a step up in complexity from Unit 2, shifting focus from univariate to multivariate probability and its practical applications.
3.2
Joint Probability Distributions

Explores joint probability distributions as the key tool for analyzing experiments involving more than one random variable, motivated by the scenario of tracking both the number of trash cubes and dirt-covered rooms WALL-E leaves behind.
3.3
Marginal Distributions

Introduces marginal distributions as the tool for extracting the probability distribution of a single random variable from a joint distribution, answering the practical question of how likely WALL-E is to leave a certain number of trash cubes regardless of how much dirt it leaves behind.
3.4
Conditional distributions

A short, theory-focused section that introduces conditional distributions as the tool for studying the relationship between two random variables, building directly on the joint and marginal distributions from the previous two sections.
3.5
Independence

Covers independence of random variables in the multivariate context, formally defining it as the condition where conditional and marginal distributions are equal — and equivalently, where the joint distribution equals the product of the marginals.
3.6
Covariance

Introduces covariance as a tool for measuring the linear relationship between two random variables, building directly on the dependence confirmed in the previous section between WALL-E's trash cube generation and dirt-leaving behaviors.
3.7
Correlation

Introduces the Pearson correlation coefficient as a normalized, scale-independent measure of the linear relationship between two random variables, directly addressing the limitation of covariance identified at the end of the previous section.
3.8
Correlation and Independence

A short but conceptually important section that clarifies the precise relationship between correlation and independence, reinforcing the key insight revealed by the WALL-E example.
3.9
Correlation and Causation

Tackles the important statistical principle that correlation does not imply causation, illustrating it with a clever time-series example where both dirty rooms and trash cubes spike simultaneously during WALL-E's stay on the Axiom — producing a strong correlation coefficient of ~0.86 that is actually a spurious correlation driven by WALL-E's arrival as a hidden common cause.
3.10
Inferring an Unknown Scalar

An scene-setting section that introduces the capstone problem for Unit 3 — helping the AI bot determine its position inside a circular calibration room using its LIDAR sensor, after a memory failure caused by WALL-E's excessive workload has left it unable to track its own coordinates
3.11
The multivariate normal distribution

Introduces the multivariate normal distribution — the key mathematical tool needed to solve the AI bot's position problem set up, presenting its full formula parameterized by a mean vector and covariance matrix, and deriving the important formulas for its marginal and conditional distributions.
3.12
Linear Gaussian Systems

A concise but mathematically dense theory section that introduces linear Gaussian systems and derives Bayes' rule for Gaussians — the two tools needed to finally solve the AI bot's position problem.
3.13
The Prior Distribution

A theory-focused section that derives the prior distribution for the AI bot's distance to the calibration room wall, walking through the careful reasoning needed to fully define a normal distribution from physical assumptions alone.
3.14
The Likelihood Distribution

A short, purely theoretical section that defines the likelihood distribution — the second key ingredient needed for Bayes' rule for Gaussians, complementing the prior distribution.
3.15
The Posterior Distribution

A theoretical culmination of the AI bot's position inference problem, deriving the posterior distribution by combining the prior from Section 3.13 and the likelihood from Section 3.14 using Bayes' rule for Gaussians.
3.16
Concepts Review

A concise concepts review section that ties together the entire multi-section arc of the AI bot's position inference problem, clearly summarizing the flow from prior to likelihood to posterior in plain language without introducing any new theory or code.
3.17
Making the Measurements

A hands-on culmination of the entire Unit 3 theoretical arc, bringing together the prior, likelihood, and posterior distributions into a fully working ROS2 action client that physically moves the AI bot into the calibration room, takes LIDAR measurements, and computes the posterior position estimate using Bayes' rule for Gaussians.
3.18
Final Comments

Final commentary on the Bayesian inference results from previous sub-unit on making measurements, analyzing the posterior mean and variance formulas to extract deeper intuitions.
4. Statistics
(0%)

A unit focusing on learning how to infer the parameters of probability distributions from real-world data rather than assuming them. It introduces key statistical techniques such as Maximum Likelihood Estimation, alternative estimation methods, regularization, and Bayesian statistics and applying them to the WALL-E scenario.
4.1
Unit Summary

A brief introduction to the unit, which opens a new phase of the course by addressing a question that you may have been asking since Unit 2 — where do the distribution parameters actually come from in practice?
4.2
Introduction

Sets up the central problem for the unit by grounding parameter estimation in the familiar WALL-E narrative — the AI bot has now observed WALL-E leaving trash cubes in 4 out of 8 rooms on path BEGFDAC1, and the challenge is to use that raw data to infer the underlying probability parameter of the distribution.
4.3
Maximum Likelihood Estimation

Introduces Maximum Likelihood Estimation (MLE) — the first and most fundamental answer to the loss function question posed in the previous unit — framing it as the intuitive idea of choosing distribution parameters that make the observed training data as probable as possible.
4.4
MLE for a Bernoulli Distribution

Applies MLE to the concrete WALL-E problem, deriving and implementing the MLE estimator for a Bernoulli distribution and arriving at the satisfyingly intuitive result that the optimal parameter is simply the empirical fraction of successes.
4.5
MLE for a Binomial Distribution

Revisits the same WALL-E parameter estimation problem through the lens of the Binomial distribution rather than individual Bernoulli trials, demonstrating that both framings yield the same MLE result, the overall fraction of successes.
4.6
MLE for a Normal Distribution

Extends the MLE framework to continuous distributions, deriving that for a normal distribution the optimal parameters are simply the sample mean and sample variance — another elegantly intuitive result.
4.7
MLE for a Multivariate Gaussian

A brief, purely theoretical section that generalizes the MLE results to the multivariate Gaussian case, confirming the satisfying pattern that holds across all dimensions — the MLE estimates for the mean vector and covariance matrix are simply the empirical sample mean and sample covariance of the dataset.
4.8
MLE for the Uniform Distribution

Applying MLE to the Uniform distribution, which produces a uniquely interesting result compared to all previous distributions — the optimal parameters A and B are simply the minimum and maximum of the observed data, derived through a conceptual argument about interval width rather than just calculus.
4.9
Other Estimation Methods

Introduces the Method of Moments (MOM) as an alternative to MLE when the NLL optimization is analytically or computationally intractable, explaining the general approach of equating K theoretical moments to K empirical moments to solve for K unknown parameters
4.10
Online Recursive Estimation

Introduces online learning as the solution to the AI bot's need to continuously update its estimate of the ship's trash production rate as new data arrives from each cleaning mission, contrasting it with batch learning where all data is available upfront.
4.11
Regularization

Introduces overfitting as a fundamental AI concept by exposing a concrete failure of MLE — when WALL-E happens to leave trash cubes in all 4 rooms observed, MLE concludes the probability is 1.0, leaving no room for any other outcome ever occurring again of which the solution is regularization.
4.12
Bayesian Statistics

A concise but conceptually pivotal theory section that elevates the course from point estimation to full Bayesian statistics, addressing the trust and certainty question that naturally arises after seeing MLE and MAP produce unreliable results with small or biased datasets.
4.13
The Beta-Binomial Model

Applies the Bayesian statistics framework to the beta-binomial model — the first full worked example of conjugate Bayesian inference in the course.
4.14
Computing the Posterior Predictive

A purely theoretical section that addresses the question teased at the end of the previous unit — what if you don't need the parameter estimate itself, but only want to make predictions?
4.15
Practicing using Posterior Predictive

A hands-on implementation of the posterior predictive theory, creating two new files — BetaBinomial_distribution.py and plugIn_vs_Bayesian.py — to concretely compare the plug-in approximation against the full Bayesian approach side by side.
4.16
Credible Intervals

Introduces credible intervals as the Bayesian tool for quantifying uncertainty about parameter estimates, directly addressing the question of how much to trust any point estimate like MAP or MLE.
4.17
Unit Review

Recaps the full arc of the unit in plain language — from point estimation (MLE, MOM, MAP) to recursive online learning (moving average, EWMA) to full distributional inference (Bayesian statistics, posterior predictive, credible intervals) — all developed through the single unifying narrative of following WALL-E and using the collected data to understand its behavior.
5. Decision Theory
(0%)

This unit introduces decision theory, focusing on how AI systems make optimal choices using statistical information gathered during training. It explores how probabilities, costs, and outcomes are combined to guide intelligent decision-making. Through practical robotics examples, we design systems that classify objects and choose appropriate actions based on expected results.
5.1
Unit Summary

An introduction, marking a significant shift in the course from learning about probability and statistics to using those tools to make decisions. Framing the new challenge as teaching the AI bot to classify trash into distinct types and dispose of it in the correct recycling containers, a natural escalation of the WALL-E narrative from collecting trash cubes to actually processing them intelligently.
5.2
Bayesian Decision Theory Basics

Introduces Bayesian decision theory through the concrete problem of the AI bot deciding whether to clean a room, establishing the full formal framework of actions A, states of nature, loss functions, posterior expected loss (risk), and the optimal policy that minimizes it — equivalently framed as the maximum expected utility principle.
5.3
Classification Problems

Introduces classification problems as a special case of Bayesian decision theory where both the actions and world states correspond to class labels, and derives that with the zero-one loss function — which penalizes all misclassifications equally.
5.4
Cost-Sensitive Classification

Introduces cost-sensitive classification as the natural generalization of zero-one loss, allowing different penalties for different types of misclassification errors — directly addressing the limitation flagged in the previous sub-unit.
5.5
Classification with "Reject" Option

Extends classification to include a reject option — a third action that defers to human intervention when the classifier is too uncertain to commit to any label safely.
5.6
Class Confusion Matrices

Introduces confusion matrices and ROC curves as the standard tools for evaluating the performance of binary classifiers, defining the four fundamental quantities — TP, FP, TN, FN — and the derived rates TPR (sensitivity), FPR, TNR, and FNR.
5.7
Regression Problems

Extends Bayesian decision theory from classification to regression problems, where both the world's states and the agent's actions are continuous-valued.
5.8
Where Should I Put This?

In this sub-unit, the AI bot must classify trash into three categories (plastics, metals, organics) and dispose of it in the correct recycling containers, equipped with three noisy sensors (camera, durometer, densimeter) each giving a ternary response with known per-class accuracies (~97-99%).
5.9
A First Approach to the Loss Matrix

A concise theory-only section that constructs the 4×4 loss matrix for the recycling classification problem, working through it systematically by starting from a zero-one baseline and then modifying individual entries based on the recycling consequences established in before.
5.10
Computing Nature's States Probabilities

Derives the mathematical machinery needed to compute the posterior probabilities for the recycling problem — the second of the two ingredients identified earlier.
5.11
Finding the Sensor's Conditional Probabilities

Building a full object-oriented simulation framework in AI_bot_decision.py with two new classes.
5.12
The Robot's Likelihood

A conceptually important theory bridge section that shifts focus to computing the class priors — the second ingredient needed for the full Bayesian posterior.
5.13
The Likelihood Distribution

Derives the likelihood distribution for the categorical model introduced in the previous sub-unit.
5.14
The Prior and Posterior Distributions

Delivers the conjugate Bayesian inference for the categorical model, confirming the prediction. The Dirichlet distribution is introduced as the prior — a direct multi-class generalization of the Beta distribution, with one concentration parameter per class and a multivariate Beta function serving as the normalization constant.
5.15
The MAP Estimate of the Distribution's parameters

A full capstone implementation, tying together every thread of the unit into a working AI_bot class added to AI_bot_decision.py.
5.16
Code Review

A detailed code review and iterative tuning section that walks through every method of the AI_bot class before demonstrating a manual training process — explicitly labeled as an AI fundamental concept.
5.17
Helping the AI Bot

The unit capstone exercise — the payoff of the entire unit — deploying the trained AI bot into a live Gazebo simulation via ROS2 actions.
6. Information Theory
(0%)

Introduces the fundamental concepts used to measure uncertainty and information in AI systems, particularly in the context of robotics decision-making. Using a cleaning robot scenario inspired by the Axiom and WALL-E, it explains how probability, surprise, and uncertainty relate to the amount of information gained from observations.
6.1
Introduction

An introduction to unit, which shifts focus to information theory as the next theoretical foundation needed to build a better trash classifier for the AI bot.
6.2
Measuring Information

Introduces information content as the formal measure of surprise or uncertainty reduction, built up intuitively through the WALL-E Bernoulli experiment before arriving at the formula.
6.3
Entropy

Introduces entropy as the expected information content, directly answering the question posed at the end of the previous unit.
6.4
Relationship between Entropy and Information

A hands-on Gazebo experiment that deepens the intuition built by making entropy concrete and interactive. The AI bot is sent to intercept WALL-E along the path ADFG3, and you guides it room by room via a new information_entropy.py script, answering yes/no questions about WALL-E's presence at each stop.
6.5
Joint Entropy

Extends entropy to two random variables via joint entropy, using the example of a room containing both a trash cube and oxide powder with a given joint distribution.
6.6
Conditional Entropy

Introduces conditional entropy as the average remaining uncertainty in Y after observing X. The two key special cases being Y is fully determined by X, conditioning reduces uncertainty to zero since measuring Y adds nothing new and when X and Y are independent, conditioning has no effect at all since X carries no information about Y.
6.7
Cross-entropy

Introduces cross-entropy through a concrete communication problem: the AI bot needs to encode waste type messages to the central command, and has designed an efficient variable-length code based on its pre-WALL-E historical beliefs.
6.8
Relative Entropy

Explains KL divergence as the natural follow-up to cross-entropy: it is simply the cross-entropy minus the true entropy, capturing the extra bits wasted by using the wrong distribution for encoding.
6.9
Cross Entropy As a Loss Function

A payoff section that answers why all the information theory was needed: cross-entropy is the standard loss function for classification in machine learning.
7. Logistics Regression
(0%)

Focuses on Bayesian reasoning and probabilistic inference, showing how intelligent systems update their beliefs when new evidence becomes available. Through practical examples and step-by-step calculations, it introduces conditional probability, Bayes’ theorem, and the concept of prior and posterior distributions.
7.1
Introduction

Opens our unit on Logistic Regression. We close the loop on a deliberate gap left in unit 6 — the sensors were treated as black boxes with known accuracy, but how that accuracy was achieved was never explained.
7.2
Binary Logistics Regression

Sets up the binary logistic regression problem through a new scenario: the humans' environmental awakening has simplified the densimeter's task to just distinguishing metals from organics, dropping plastics from the classification entirely.
7.3
The Sigmoid Functions

Introduces the sigmoid function as the answer to the requirements for a function that maps any real number to a valid probability.
7.4
Binary Logistic Regression

Assembles the full binary logistic regression model by combining the sigmoid function with a linear transformation of the input.
7.5
Maximum Likelihood Estimation

A theory-only section that establishes the training objective for binary logistic regression by applying the cross-entropy minimization framework to the specific model built previously.
7.6
Optimizing the Model's Parameters

Introduces gradient descent as the optimization method for training logistic regression.
7.7
Training the Binary Logistic Regression

Puts everything from the previous sections together into a complete training pipeline using PyTorch as the framework, chosen primarily for its automatic gradient computation.
7.8
The Trainer Class

Completes the training pipeline by covering the Trainer class and the main block that runs everything.
7.9
Testing Model Fit

A short visual validation section that plugs the learned parameters back into the earlier visualization, replacing the three hand-picked curves with the single trained one.
7.10
Evaluating Model Perfomance

Adds an evaluate method to the Trainer class that runs the trained model on the held-out test set, computing both loss and accuracy by applying the 0.5 probability threshold.
7.11
Multinomial Logistic Regression

Extends the binary framework to multinomial logistic regression for classifying across more than two classes.
7.12
The MNIST data

Introduces the MNIST dataset as the real-world application for softmax regression — 60,000 training images and 10,000 test images of handwritten digits (0–9).
7.13
Training on the dataset

Implements the full softmax regression training pipeline on MNIST. The structure mirrors the binary case exactly — dataset, model, optimizer, loss function, and trainer — but scaled up.
7.14
Wrap Up

A wrap-up that reflects on the full arc of the course — from probability foundations through Bayesian inference, decision theory, information theory, and now logistic regression.
8. Final Project
(0%)

A final project of the course bringing together everything covered throughout the course by working on a task that is programming an AI-powered robot — themed around WALL-E aboard the Axiom spaceship — to perform autonomous object recognition and navigation tasks.
8.1
Problem Description

A capstone project problem description where we build a complete image classification system for the AI bot from scratch.
8.2
Data Collection

Covers the data collection step of our final project. A dedicated training room in Gazebo provides a controlled white environment where each object is placed on a central platform, and a CaptureImages ROS action commands the robot to orbit it at randomized distances.
8.3
Data Preprocessing

Covers data preprocessing through an ImagesProcessor class that handles the full pipeline of preparing raw images for training.
8.4
Model Selection and Training

Applies the softmax regression pipeline from Unit 7 directly to the four-class object problem. The same LogisticRegression, SGD, and Trainer classes are reused with minimal adaptation, confirming that the Unit 7 framework generalizes cleanly.
8.5
Decision Making

A decision-making capstone that completes the full pipeline by wrapping the trained softmax model in an AI_bot class that applies the principles of decision theory framework.
8.6
Final Testing

A brief evaluation step where the tuned decision system from the previous unit is applied unchanged to the held-out test dataset.
User Ratings

Deep Learning with Domain Randomization
Learn how to train any robot to recognize an object and pinpoint its 3D location with only an RGB camera and a lot of training with Keras.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.2 (6)
Course Overview
Welcome to this micro course! This course is intended for the people that want to *learn about deep learning using Keras*. In this case, we use a very interesting approach to learning which is *Environment Randomization* This method exploits the versatility of environment generation in simulations to train a robot in a way that the resulting model is very robust, no matter the lighting conditions. It also makes the transition from simulated learning to reality much smoother and fast. Learn through hands-on experience how to train a robot for 3D object recognition using random environments. *Keras will be the cornerstone of this system* and you will learn all the necessary skills to generate training data, convert it to a database, train a MobileNetV2 model, retrain it and make predictions with it. The final project is the training of a garbage picking robot, from training data generation to the final garbage detection and picking program. Dive into the fantastic world of DeepLearning with Keras right now!
What You Will Learn

    How to use Keras in a basic way
    How to train a deep neural network using a Gazebo Simulation
    How to work with ROS+Gazebo+Keras in tandem.
    How the Random Environment generation works in Gazebo.

Course Summary
1. Quick Demo

Unit for previewing the contents of the Course.
2. Step By Step Simple Guide

Learn the basic steps in order to train a neural network so that it can recognize an object and tell us its location in 3D space.
3. Exercises For XY motion Spam

Learn how to retrain a previously trained model and work on improving our detection model.
4. Exercises for Spam and a Distractor

Distract the model with another object in the scene that moves around and could be mistaken by the target SPAM object.
5. Exercises with Distractor and Random Env

Train the model with a random environment to make it more robust in any lighting condition. You will also train with a huge image database to emulate the real deal.
6. Microproject Garbage Collector

It's time for you to test everything you have learned with this course! You will work with a Garbage Collector robot. With it, you have to find an object amidst other distractors, move to a picking distance, and pick that object.
User Ratings

ROS Autonomous Vehicles 101
Introduction to Autonomous Vehicles in the ROS ecosystem
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.7 (14)
Course Overview
The goal of this course is to show you the basic knowledge you need to master in order to program `autonomous cars` for a Level 3 of autonomy. This means, it is expected that all task should be performed autonomously, but at the same time it is expected to intervene a human driver whenever required. This level is called conditional automation.
What You Will Learn

    In this course you are going to learn the essentials for doing autonomous cars control using ROS. You are going to learn: 1. What are the sensors required for an autonomous car and how to access them using ROS 2. How to do autonomous navigation using a GPS 3. How to create an obstacle avoider for an autonomous car 4. How to interface ROS with a car that follows the DBW interface

Course Summary
1. Unit 0: Introduction

Move The car arround and know what in for you in this course
2. Unit 1: Sensors

Learn all the sensors you will be working with and how to visualize them in RVIZ
3. Unit 2: GPS Navigation

Learn the basics for GPS data use in ROS
4. Unit 3: Obstacles and Security

Learn to implement your own Car Security systems and obstacle detection with laser
5. Unit 4: CAN-Bus

Learn about CAN-Bus and how to move the car with it aswell as retrieving GPS data.
6. Unit 5: Microproject

Make the car move around with CAN-Bus and using the different sensors to get to the GasStation
7. Final recommentations

What do do next
User Ratings

Using NVIDIA Jetson Nano with ROS
Learn DeepLearnin using NVIDIA Jetson Nano with IgnisBot.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.6 (11)
Course Overview
Learn how to use NVIDIA Jetson Nano for deep learning in simulation and in a physical robot.
What You Will Learn

    The basics of NVIDIA jetson NANO setup.
    How to move a jetbot based robot
    How to train through deep learning a robot to be able to do obstacle avoidance
    How to track people and follow them.
    How to execute code designed for GPU-CUDA enabled hardware in only CPU systems.
    Build your own IgnisBot, a robot designed for DeepLearning with JetsonNano Hardware.

Course Summary
1. Introduction Demo to NVIDIA Jetson Nano DeepLearning

Introduction Demo to NVIDIA Jetson Nano DeepLearning
2. Basics - Move Ignisbot

How to use the jetbot API to move a two-wheeled robot in simulation and in the physical robot that uses ROS.
3. Basics - Collision Avoidance with DeepLearning

How to train Ignisbot to be able to navigate in a known environment, avoiding obstacles.
4. Unit 3: Create the people folow ROS script

Rosify the people tracker so that any ROS system can access the detections, and create a people follower script that uses this data to create a behaviour for Ignisbot.
5. Unit 4: Ignisbot mini project

It's time to combine everything you learned in this course in order to make Ignisbot (simulated and physical) navigate around an environment, searching for people, and reacting to them.
User Ratings

Using OpenAI with ROS
Use the power of OpenAI combined with ROS simulations the easiest way.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.4 (17)
Course Overview
In this Course, you are going to learn how to use the OpenAI ROS structure developed by The Construct and how to generate new code for it. The OpenAI ROS structure will allow you to develop for OpenAI with ROS in a much more easy way.
What You Will Learn

    Basic Concepts of the OpenAI ROS structure
    Set up the OpenAI ROS structure for a CartPole environment
    Train the Cartpole with the qlearn algorithm
    Set up the OpenAI ROS structure for a Moving Cube environment
    Train the Cube with the qlearn algorithm
    Modifying the learning algorithm: DeepQ
    Set up the OpenAI ROS structure for a Fetch Robot
    Training Fetch robot with the HER algorithm from OpenAI baselines

Course Summary
1. Introduction to the Course

Unit for previewing the contents of the Course.
2. Exploring the OpenAI Structure: CartPole

Follow, step by step, the full workflow of a CartPole simulated environment, including all the environments and scripts involved in its training.
3. Exploring the OpenAI Structure: RoboCube. Part 1

Learn how to apply the openai_ros package to your own robot.
4. Exploring the OpenAI Structure: RoboCube. Part 2

Learn how to create a Robot Environment for a Moving Cube with a single disk in the roll axis using the OpenAI ROS structure.
5. Exploring the OpenAI Structure: RoboCube. Part 3

Learn how to define the learning task of your robot by creating a Task Environment for a Moving Cube with a single disk in the roll axis. Also, you will use the Qlearn algorithm for training the RoboCube.
6. Save and Load the Learned Policy

Learn how to save the learned policy and how to load it to apply what the agent has learned.
7. Modifying the learning algorithm: CartPole

Learn how to set up the environment in order to be able to use the OpenAI Baselines deepq algorithm.
8. Modifying the learning algorithm: RoboCube

Learn how to set up the environment in order to be able to use the OpenAI Baselines deepq algorithm.
9. Training a Fetch Robot. Part 1

A step-by-step look at how to build the Robot Environment for training a Fetch robot.
10. Training a Fetch Robot. Part 2

A step-by-step look at how to build the Task Environment for training a Fetch robot.
11. Project: Training a Hopper robot

Create all the environments needed in order to be able to train the Hopper robot.
User Ratings

Reinforcement Learning for Robotics
Learn the main reinforcement learning techniques and algorithms.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.4 (34)
Course Overview
The course will give you the state-of-the-art opportunity to be familiar with the general concept of reinforcement learning and to deploy theory into practice by running coding exercises and simulations in ROS.
What You Will Learn

    The reinforcement learning problem, Multi-armed bandit problem, State-Value and Action-Value functions, Markov Decision Processes, and Bellman Equation
    Dynamic programming
    Monte Carlo methods
    Temporal-difference methods

Course Summary
1. Introduction to the Course

Unit for previewing the contents of the Course. Includes a practical demo.
2. The reinforcement learning problem

Learn some reinforcement learning basic concepts and terminology.
3. Dynamic programming problem

Learn about the dynamic programming (DP) concept, which in our case is tailored for solving reinforcement learning problems - Bellman equations.
4. Monte Carlo methods

In this unit, we are going to continue our discussion about optimal policies, which the agent evaluates, improves, and follows through Monte Carlo methods.
5. Temporal-Difference methods

In this unit, we are going to continue our journey of finding the most optimal way to solve MDP, for the environment where the dynamics (transitions) are unknown in advance (model-free reinforcement learning).
6. Course Project

In this final project, your task is to deploy a Q-learning algorithm to solve a maze environment with 3 obstacles.
User Ratings

Generative AI for Robotics
Learn all you need to go from knowing nothing about the technology behind ChatGPT to using it in a robot for moving, perception, and human command understanding.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.6 (5)
Course Overview
Generative AI is the next step after the Deep Learning revolution. It allows systems to create new behaviors, movements, information, and data based on their training. This discipline in AI is here to stay and any engineer needs to master these skills as soon as possible because this train is picking up steam.
What You Will Learn

    There are many skills needed to be able to apply Generative AI to a robot. In this course, we will start from the basics, working our way to the main objective of giving our robots enough intelligence to understand human commands by text, and voice, understand the world around it, and navigate.

Course Summary
1. Introduction to Generative AI for Robotics
(0%)

This unit introduces the course and outlines what we will achieve by the end. We review the course structure, clarify expected prior knowledge, and recognize the contributors who made the course possible.
1.1
Introduction

What is the course about?
1.2
Demo

A practical demonstration of what you will be able to do after completing the course.
1.3
Course Outline

A detailed outline of the course structure.
1.4
Requirements

What is required as basic knowledge before starting the course.
1.5
Vote of Thanks

Vote of thanks to all the parties involved in making this course possible.
2. Tokenization and Data Foundations
(0%)

A build of the foundational understanding of how text is processed and represented before being fed into generative models. Including an exploration and implementation of a range of tokenization strategies — from character-level approaches to industry-standard methods like BPE and WordPiece — culminating in hands-on use of the Hugging Face tokenizers library.
2.1
Tokenization Fundamentals

Tokenization Fundamentals
2.2
Exploring the Tiny Shakespeare Dataset

Practical dataset exploration using Tiny Shakespeare. Learn about vocabularies, sets, and iterables while discovering how 65 unique characters form the model’s full working vocabulary.
2.3
Building Tokenizers from Scratch

Builds a character-level tokenizer on the Tiny Shakespeare dataset, then uses it to motivate why subword tokenization methods like BPE and WordPiece are preferred in real LLMs.
2.4
Byte-Pair Encoding (BPE) tokenization

Introduces BPE tokenization used by GPT, RoBERTa, and BART. Builds a from-scratch Python implementation that iteratively merges the most frequent character pairs into a vocabulary, then prunes redundant tokens to optimize it.
2.5
WordPiece tokenization

Introduces WordPiece, the tokenization algorithm used by BERT and ELECTRA. Walks through a from-scratch Python implementation that mirrors BPE but with two key differences: non-word-starting characters are prefixed with ##, and pair selection is driven by a likelihood score rather than raw frequency.
2.6
Other forms of Tokenization

Briefly covers two alternative tokenization strategies: Unigram and SentencePiece.
2.7
Using the Hugging Face tokenizers library

Introduces the Hugging Face tokenizers library as a reusable alternative to building tokenizers from scratch.
3. Training and Fine-Tuning Generative Models
(0%)

In this unit, we explore tokenization theory alongside hands-on model training, guiding learners through preprocessing pipelines, fine-tuning pre-trained models, and building generative models from the ground up. By the end, participants will have trained models that can make real predictions and generate creative text.
3.1
From Tokenizers to Model Training

Applies tokenization knowledge to train generative models. Covers preprocessing, fine-tuning Hugging Face models, and training a model from scratch capable of generating Dr. Seuss-style text.
3.2
Data Preprocessing for Generative AI

Preprocesses text, audio, image, and multimodal data. Covers padding, truncation, tensor conversion, and structured batching using Hugging Face utilities.
3.3
Fine-Tuning BERT Efficiently

Demonstrates why fine-tuning is more efficient than training from scratch by fine-tuning BERT on Yelp reviews. Covers data loading, tokenization, training configuration, model saving, and hardware optimization tips.
3.4
Running Real Model Predictions

Deploys the fine-tuned BERT model to predict sentiment on restaurant reviews, correctly assigning star ratings and validating the full training pipeline.
3.5
Training a Language Model from Scratch

Trains an 84M-parameter RoBERTa model in Esperanto from scratch, including corpus download, BPE tokenizer training, masked word prediction testing, and uploading the model to Hugging Face.
3.6
Building a GPT-Style Model

Builds and trains a GPT-style model on Dr. Seuss stories to generate new children’s text, highlighting the impact of hardware differences between CPU and GPU training.
4. Natural Language Robot Control
(0%)

In this unit, we explore how generative AI can transform human language into physical robot actions. We train a sequence-to-sequence model and integrate it into a ROS 2 environment, enabling a real robot to interpret and carry out natural language commands.
4.1
Translating Language to Robot Motion

Trains a sequence-to-sequence model to convert natural language commands into differential drive wheel velocities. Covers dataset generation, fine-tuning, ROS2 integration, and real-world robot execution.
4.2
Step 1 - Setup

Create all the necessary files to train a model that maps input commands to differential-drive speed commands.
4.3
Step 2 - Generating Training Data Set

Generating the training dataset required for our model training so that the model can learn using relevant information for the task it has to perform.
4.4
Step 3 - Model Selection

How to select a model that is pre-trained so that less time is required to train and tune the model to our specific application.
4.5
Step 4 - Tokenize

Selecting a tokenizer for pre-training the model before fine-tuning.
4.6
Step 5 - Fine Tuning the model

Fine-tuning our pretrained model so that it gives task-relevant outputs and minimizes generalization.
4.7
Step 6 - Testing

Testing our model in simulation to verify that it behaves as expected.
4.8
Step 7 - Real Robot Testing

Testing our model on the real robot to verify that it works as expected in the actual environment.
4.9
Code Review

Taking a closer look at the code that has enabled the training, fine-tuning, and prediction capabilities of our model.
5. Vision-Language Models in Robotics
(0%)

In this unit, we explore the intersection of vision and language by introducing models that can reason about images using natural language. We apply these capabilities to a robotics scenario, implementing visual question answering and zero-shot object segmentation.
5.1
Introduction to Visual Question Answering and Zero-Shot Segmentation

Introduces Vision-Language Models using ViLT for visual question answering and CLIPSeg for zero-shot segmentation, then integrates both into a robotics scenario where a robot detects and tracks a person in a simulated home.
5.2
Example of ViLT for VQA

A walkthrough of our Python script that loads the model, displays an image, and allows interactive questioning in a command-line loop. The model processes both the image and the question together to generate a natural language answer.
5.3
Visual Question Answering and Zero-Shot Segmentation

Introducing CLIPSeg, a vision-language model that performs zero-shot image segmentation using natural language text prompts. We also look at two Python scripts for segmenting one or multiple objects in an image, with results displayed visually side by side.
5.4
Robotics Application of Vision Language Models

Applying CLIPSeg and blob detection within a ROS2 node, enabling a robot to use its camera to detect and track people in its environment in real time.
6. Generative AI for Robot Navigation
(0%)

In this unit, we bring generative AI into the domain of autonomous robot navigation, enabling robots to understand and act on natural language navigation commands. We build large-scale datasets, fine-tune language models, and deploy a fully functional navigation system within a ROS 2 environment.
6.1
Language-Based Autonomous Navigation

Applies Generative AI to full robot navigation using ROS2 Nav2. Covers dataset creation, model fine-tuning, and commanding navigation through natural language.
6.2
Large-Scale Navigation Dataset Generation

Builds an automated script to generate 100,000 human-to-robot navigation command pairs, optimizing dataset design through decimal reduction and quaternion-to-Euler conversion for improved training performance.
6.3
Fine-Tuning T5 for Waypoint Navigation

Fine-tunes a T5 model to translate human navigation commands into waypoint coordinates, integrates it into a ROS2 node, and demonstrates autonomous multi-location navigation using natural language commands.
User Ratings

VLAs with ALOHA for robotics
Start using VLA with ALOHA as a particular implementation of it.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
2 (1)
Course Overview
VLAs are a new AI discipline that promises to address many of the challenges in robotic AI. However, VLA is a very broad term, with many different implementations and approaches. ALOHA is one of these, and it uses ACT as its learning technique.
What You Will Learn

    Imitation learning using behaviour cloning
    Actor-Critic based Online Reinforcement Learning
    Action Chunking Transformer (ACT) based imitation learning

Course Summary
1. Introduction to the Course

Introduction and demo of what you will learn in this course.
2. Imitation Learning

Provide a comprehensive understanding of imitation learning, with a particular emphasis on the Behavioral Cloning (BC) algorithm.
3. Actor-Critic Reinforcement Learning

The main idea of this unit is to provide a practical, hands-on understanding of actor-critic reinforcement learning applied to a pick-and-place manipulation task
4. ACT Imitation Learning

Build ALOHA (A Low-cost Open-source Hardware System for Bimanual Teleoperation), a cutting-edge system used by top researchers at Stanford and Google DeepMind to perform complex, dexterous tasks.
User Ratings

MujocoLab for Robotics
Hands-on course on using MuJoCo Lab to design, simulate, and train robotic systems with modern physics-based environments.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
0 (0)
Course Overview
MujocoLab is becoming the standard for robotic AI training. Thanks to Mujoco Warp, we can use GPUs to simulate thousands of robots learning simultaneously in Mujoco, significantly reducing training time and improving the quality of our AI models.
What You Will Learn

    How to train a humanoid robot to walk How to train a humanoid robot to mimic certain movements How to create your own custom environment in MJLab How to integrate your own custom MuJoCo robot model into MJLab How to train your own custom model to walk How to monitor all training runs with Weights & Biases (W&B)

Course Summary
1. MJLab ecosystem
(0%)

Experience a demo of what you will be able to achieve in this course.
1.1
What is MJLAB

Learn about what MJlab is in general.
1.2
DEMO

See a demo of what you will learn to do in this course.
1.3
What will you learn

List of all the topics covered in this course.
2. MJLab basics
(0%)

See what you can do by default in MJLAB, training walking, and mimic. Familiarise yourself with the basic structure of MJLAB.
2.1
Introduction

Get a feel of what can be done with MJLAB.
2.2
Create your own uv package

Create your MJLAB boilerplate files and folders.
2.3
First launch

Start your first MJLAB sim from your package
2.4
Velocity Tracking

Learn how to train and launch a walking policy for G1 humanoid robot.
2.5
What is distributed training

Small snippet on how distributed learning works.
2.6
Motion Imitation

Learn how to train a G1 robot to follow a complex motion like dancing.
3. Terrains
(0%)

Learn how to add your own custom terrains and objects to MJLAB scenes.
3.1
Introduction

Learn why you need terrains to be custom and the structure in which MJLAB bases the scenes.
3.2
Recommended folder structure

The folder structure of your project.
3.3
Discoverable MJLab package

How to setup system to be able to find your project.
3.4
Play trained policy

PLay the policy you trained in the previous unit.
3.5
ADD Objects to the environment

Learn how to add simple objects to the environment.
3.6
Exercise1 Add Objects

Exercise to practice adding simple objects.
3.7
Dynamic primitive objects

Learn how to add objects with physics.
3.8
Exercise 2 Dynamic Objects

Create a scene with coloured balls in a pool.
3.9
Mesh based objects

Add objects with complex 3d meshes.
3.10
ADD Custom terrain

Learn how to add custom terrains with procedural geometry.
3.11
Exercise Generate custom terrain

You will need to create your own custom terrain.
3.12
Custom environment with motion tracking

Learn how to adjust the system to use custom environments in motion tracking policies.
4. Robots
(0%)

Learn how to add custom robots to your MJlab environment.
4.1
Introduction Add Robots

Know what we are going to do and see the robot we will work with.
4.2
Define the MJLAB Task

Learn what is needed to have your custom robot spawn in the MJLab environment
4.3
Create the robot_cfg

Continue adding elements for the robot integration.
4.4
Minimal environment

Add minimal environment for the custom robot.
4.5
Create rl_cfg

Create the final files, and at the end, launch the first time with a zero policy.
4.6
Train walking for Atom01

Train the Atom01 robot to walk on a flat surface.
4.7
Play trained walking policy Atom01

Now let's load the trained walking policy and see how it goes.
4.8
Joystick walking

Learn how to move the robot with joystick commands.
4.9
Exercise Train Atom01 walk in rough terrain

Do the same training but now in rough terrain.
User Ratings

Ai Robot Arm Project
Learn real VLA techniques applied to real physical hardware So-101 robot arms pair.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
0 (0)
Course Overview
VLAs are one of the most important AI disciplines currently. You have already done an introduction to it, but working with a real robot is the next level. It's time to step up. VLAs normally are trained with a follower/leader pair of robots, and that's exactly what you are going to use here.
What You Will Learn

    How to set up a leader/follower robot arm pair.
    How to generate a dataset both manually and automatically with inverse kinematics and computer vision.
    Train an ACT and SMOLVLA. locally and in VastAI.
    Execute the trained policies locally and using VASTAI.
    Use the HAILO AI Raspberry Pi module.

Course Summary
1. Hardware Setup, BOM, and First Bring-Up

Follow the instructions for setting up and assembling the robot arm environment and system.
2. Task Definition and Dataset Generation

Let's define the task to be accomplished and learn how to generate the training dataset, both manually by teleoperation and through automatic systems with computer vision and inverse kinematics.
3. Train ACT and SmolVLA on Your Datasets

Learn how to train ACT and SMOLVLA. Learn their structure and the differences between them.
4. Deploy Your Trained Policies on the SO-101

Learn how to deploy the trained policies and execute them on local hardware or via VAST AI remote execution for better performance.
5. Run Your ACT Policy on the Hailo-10H Edge NPU

Lets test how to run our ACT policy in a HAILO Ai edge system plugge dto the Raspberrypi.
User Ratings
