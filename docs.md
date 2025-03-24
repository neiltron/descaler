# Descaler

Descaler is a web application that lets users selectively apply JPEG compression to images. Create artistic effects by deliberately adding compression artifacts to specific areas of your images.

## Features

- **Selective Compression**: Use a paintbrush-like tool to add compression artifacts to specific areas
- **Adjustable Parameters**: Control brush size and compression quality
- **Simple Interface**: Drag-and-drop upload, intuitive controls
- **Client-Side Processing**: All image manipulation happens in your browser
- **No Server Dependencies**: Completely client-side processing means your images never leave your browser

## User Guide

### Getting Started

1. **Access the Application**: Open the application in your web browser
2. **Upload an Image**:
   - Drag and drop an image onto the upload area
   - Or click on the upload area to select an image file
3. **Configure Your Tools**:
   - Use the Brush Size slider (2-200px) to adjust the tool's area of effect
   - Use the JPEG Quality slider (0-1) to set the compression level (lower = more compression)
4. **Apply Compression Effects**:
   - Click and drag on the image to apply JPEG compression artifacts
   - The custom cursor shows the exact size and position of your brush
   - Continue painting until you achieve the desired effect
5. **Save or Reset**:
   - Click "Save Image" to download your creation
   - Click "Reset" to start over with a new image

## Technical Documentation

### Architecture Overview

Descaler is built as a single-page application using SvelteKit. The application uses a component-based architecture with reactive state management through Svelte stores.

### Core Components

#### ImageCanvas.svelte
The central component that:
- Displays the uploaded image on an HTML canvas
- Handles mouse interaction for applying compression
- Implements the compression algorithm using temporary canvases
- Shows/hides based on whether an image is loaded
- Creates a custom cursor that shows the brush size and position

#### Dropzone.svelte
Manages the image upload process:
- Provides a drag-and-drop interface
- Handles file selection via click
- Processes the uploaded image for display
- Applies initial scaling to fit the viewport (max width 800px)
- Changes appearance when files are dragged over

#### Configuration Components

**PaintbrushConfig.svelte**:
- Controls the brush size (2-200px)
- Provides a slider interface in a dropdown menu
- Updates the brushSize store reactively

**QualityConfig.svelte**:
- Controls the JPEG compression quality (0-1)
- Provides a slider interface in a dropdown menu
- Updates the compressionQuality store reactively

**Cursor.svelte**:
- Creates a custom cursor showing the brush size
- Follows the mouse position when over the canvas
- Updates dynamically when brush size changes
- Toggles visibility based on cursor position

### State Management

Application state is managed using Svelte stores defined in `store.ts`:

```typescript
export const image = writable<HTMLImageElement | null>(null);
export const hasImage = writable<boolean>(false);
export const isDroppable = writable<boolean>(false);
export const canvas = writable<HTMLCanvasElement | null>(null);
export const ctx = writable<CanvasRenderingContext2D | null | undefined>(null);
export const brushSize = writable<number>(100);
export const compressionQuality = writable<number>(0);
export const cursorHidden = writable<boolean>(true);
```

### Compression Algorithm

The core image compression technique works through the following steps:

1. When the user clicks and drags on the canvas, the application captures:
   - Mouse coordinates relative to the canvas
   - Current brush size and compression quality settings

2. For each point where compression should be applied:
   ```javascript
   function compressArea(x, y, brushSize, quality) {
     // Extract image data from the area under the brush
     const imageData = ctx.getImageData(
       x - brushSize / 2, 
       y - brushSize / 2, 
       brushSize, 
       brushSize
     );
     
     // Create a temporary canvas with that image data
     const tempCanvas = document.createElement('canvas');
     tempCanvas.width = brushSize;
     tempCanvas.height = brushSize;
     const tempCtx = tempCanvas.getContext('2d');
     tempCtx.putImageData(imageData, 0, 0);
     
     // Convert to JPEG with specified quality
     const compressedDataUrl = tempCanvas.toDataURL('image/jpeg', quality);
     
     // Draw the compressed version back to the main canvas
     const img = new Image();
     img.onload = function() {
       ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
       ctx.drawImage(img, x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
     };
     img.src = compressedDataUrl;
   }
   ```

This approach takes advantage of JPEG's lossy compression to create visible artifacts only in the areas where the brush is applied.

### Responsive Design

The application implements responsive design principles:
- Canvas scaling based on image size (max width 800px)
- Flexible layout that works on different screen sizes
- Mobile-friendly controls for brush size and quality

## Development Guide

### Project Structure

```
src/
├── app.css                    # Global styles
├── app.html                   # HTML template
├── lib/
│   ├── Dropzone.svelte        # File upload component
│   ├── ImageCanvas.svelte     # Main canvas component
│   ├── components/
│   │   ├── PaintbrushConfig.svelte  # Brush size control
│   │   ├── QualityConfig.svelte     # Compression quality control
│   │   └── ui/                      # UI component library
│   │       ├── Cursor.svelte        # Custom cursor component
│   │       └── [other UI components]
│   ├── store.ts               # State management
│   └── utils.ts               # Utility functions
└── routes/
    ├── +layout.svelte         # Layout template
    └── +page.svelte           # Main page component
```

### Technologies Used

- **SvelteKit**: Front-end framework for building the application
- **Canvas API**: For image manipulation and drawing
- **Tailwind CSS**: For styling the user interface
- **Lucide Icons**: For button and UI icons

### Browser Compatibility

The application relies on modern web features:
- Canvas API
- File API
- Drag and Drop API
- ES6+ JavaScript features

For best results, use the latest versions of Chrome, Firefox, Safari, or Edge.

### Performance Considerations

For optimal performance:
- The application scales images to a maximum width of 800px to ensure smooth processing
- Larger brush sizes may process more slowly on lower-end devices
- Very low compression quality values (close to 0) create more visible artifacts

## Installation and Deployment

To run the application locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to the URL displayed in the console

To deploy the application:
1. Build the application:
   ```
   npm run build
   ```
2. Deploy the contents of the build directory to your web server

## Contributing

Descaler is an open-source project. To contribute:

1. Fork the repository
2. Make your changes
3. Submit a pull request

## License

MIT License

## Credits

Created by Neil Pullman (https://descend.org)