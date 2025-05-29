# 今日の積み上げ管理アプリ

ブラウザ上で動作するシンプルな積み上げ管理アプリです。バックエンドサーバー不要で、完全にクライアントサイドで動作します。

## Features

- Add new tasks
- Mark tasks as complete/incomplete
- Delete tasks
- Automatic saving to localStorage
- Responsive design (works on mobile devices)
- Accessible UI with keyboard navigation and ARIA attributes

## Tech Stack

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (ES6)
- localStorage for data persistence

## Setup Instructions

1. Clone this repository:
   ```
   git clone <repository-url>
   cd todo-app
   ```

2. Open the application:
   - Option 1: Simply open `index.html` in your browser
   - Option 2: Use a local development server

   If you have Node.js installed, you can use a simple server:
   ```
   npx serve
   ```

## How It Works

- All tasks are stored in your browser's localStorage
- No data is sent to any server
- Tasks persist between browser sessions
- No login required - it's a personal to-do list on your device

## Development Notes

- The app uses ES6 module pattern for clean code organization
- Tailwind CSS is loaded via CDN for styling
- Custom animations enhance the user experience
- Fully responsive design works on all screen sizes (minimum width: 320px)
