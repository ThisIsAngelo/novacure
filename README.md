# Novacure

**Novacure** This application is designed to help users manage their cancer treatment. Powered by advanced analysis from Gemini AI, this platform provides in-depth insights and personalized recommendations. With a variety of intuitive features, users can effectively organize and monitor their treatment steps, making the treatment process more structured and accessible.

## Key Features

- **Gemini AI Analyzation**: Applying advanced analysis to provide precise and personalized treatment recommendations based on user data.
- **Search**: Easily find records using the search bar, allowing for quick access to important information.
- **Drag and Drop Kanban**: Organize and prioritize treatment tasks effortlessly with a user-friendly drag-and-drop Kanban board, making it easy to visualize progress.

## Technologies Used

- **Typescript**
- **React.js**
- **Tailwind CSS**
- **PostgreSQL**
- **Drizzle ORM**

## Installation and Usage

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system.

### Installation Steps

1. Clone this repository:
    ```bash
    git clone https://github.com/ThisIsAngelo/novacure.git
    ```

2. Navigate to the project directory:
    ```bash
    cd novacure
    ```

3. Install the required dependencies:
    ```bash
    npm install
    ```

4. Run the application:
    ```bash
    npm run dev
    ```

5. Access the application in your browser at `http://localhost:5173`.

## Project Structure

```plaintext
novacure
├── assets/           # Stores asset icons
├── components/       # Reusable UI components
├── constants/        # Contains navigation links and icons
├── context/          # Context API for state management
├── hooks/            # Custom React hooks
├── pages/            # Application pages
├── utils/            # Config and schema for the database
├── .env              # Environment variables
└── README.md         # Documentation for this project