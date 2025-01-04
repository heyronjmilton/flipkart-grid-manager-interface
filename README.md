# FLIPKART GRID MANAGER INTERFACE

## Overview

This guide will help you install and run the interface for the manager. Follow the steps below to set up your environment and start the application.

---

## Prerequisites

Ensure you have the following installed on your system:

1. **Node.js** (LTS version recommended)
   - Download and install it from [Node.js official website](https://nodejs.org/).
2. **npm** or **yarn** (npm is included with Node.js installation).
   - To check if npm is installed, run:
     ```bash
     npm -v
     ```
   - To install Yarn (optional), run:
     ```bash
     npm install -g yarn
     ```

---

## Installation Steps

1. **Clone the Repository**

   Clone the repository to your local machine using Git:

   ```bash
   git clone https://github.com/heyronjmilton/flipkart-grid-manager-interface.git
   ```

2. **Navigate to the Project Directory**

   Move into the project's directory:

   ```bash
   cd flipkart-grid-manager-interface
   ```

3. **Install Dependencies**

   Install the required dependencies:

   - Using npm:
     ```bash
     npm install
     ```
   - OR using Yarn:
     ```bash
     yarn install
     ```

4. **Start the Development Server**

   Start the application in development mode:

   - Using npm:
     ```bash
     npm run dev
     ```
   - OR using Yarn:
     ```bash
     yarn dev
     ```

   This command will start a local development server. The application will be available at `http://localhost:9003/`.

---

## Features

### Insights

The **Insights** section provides an overview of the overall data trends for items processed by the workstations under a specific manager. It includes key metrics and visualizations to help managers understand processing patterns and performance.

### Expired Items

The **Expired Items** section provides a detailed overview of items reported as expired. It includes the following details:

- Batch ID of the expired items.
- Device ID used during processing.
- Inferenced images collected during the processing of the particular batch for review and analysis.

This feature allows managers to review expired items and take necessary actions based on the collected data.

---
