# Verse Each Day

A simple, elegant web application that displays a new Bible verse each day with a beautiful nature background.


## Features

- Random verse fetching from multiple Bible APIs with fallback mechanisms
- Beautiful, random nature backgrounds via Unsplash API
- Clean, responsive design
- Easy verse sharing functionality
- One-click refresh to get a new verse

## Demo


## Getting Started

### Prerequisites

- A modern web browser
- Basic knowledge of HTML, CSS, and JavaScript (for customization)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/daily-bible-verse.git
   ```

2. Navigate to the project directory:
   ```
   cd daily-bible-verse
   ```

3. Open `index.html` in your browser or deploy to a web server.

### API Keys

The application uses the following APIs:

- [Unsplash API](https://unsplash.com/developers) - For beautiful nature background images
- [OurManna API](https://www.ourmanna.com/api/) - Primary source for daily Bible verses
- [Bible API](https://bible-api.com) - Secondary source for Bible verses
- [ESV API](https://api.esv.org) - Tertiary source for Bible verses

To use your own Unsplash API key:
1. Register for a free API key at [Unsplash Developers](https://unsplash.com/developers)
2. Replace the client ID in the `fetchBackgroundImage()` function in `script.js`

## Customization

### Changing the Theme

Edit the `styles.css` file to modify the appearance:

- Background overlay opacity
- Font choices and sizes
- Button styles and animations
- Container dimensions and padding

### Adding More Verses

To add more fallback verses, edit the `getMessageRichVerse()` function in `script.js`:

```javascript
const messageRichVerses = [
  // Add more verses here in this format:
  {
    text: "Your verse text here",
    reference: "Book Chapter:Verse",
  },
  // ...
];
```

## Project Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling for the application
- `script.js` - JavaScript functionality
- `README.md` - This file

## How It Works

1. The application attempts to fetch a Bible verse from the OurManna API
2. If that fails, it tries the Bible API with a curated list of verses
3. If that fails, it tries the ESV API
4. If all API calls fail, it uses a hardcoded list of Bible verses

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)


## Acknowledgments

- [Unsplash](https://unsplash.com) for beautiful background images
- [OurManna](https://www.ourmanna.com) for the verse of the day API
- [Google Fonts](https://fonts.google.com) for Playfair Display and Source Sans Pro fonts
- [Bible API](https://bible-api.com) for the Bible verse API
- [ESV API](https://api.esv.org) for the ESV Bible API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.