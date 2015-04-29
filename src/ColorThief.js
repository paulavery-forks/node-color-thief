/*!
 * Color Thief
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * License
 * -------
 * Creative Commons Attribution 2.5 License:
 * http://creativecommons.org/licenses/by/2.5/
 *
 * Thanks
 * ------
 * Nick Rabinowitz - For creating quantize.js.
 * John Schulz - For clean up and optimization. @JFSIII
 * Nathan Spady - For adding drag and drop support to the demo page.
 *
 */

import CanvasImage from './CanvasImage';
import quantize from 'quantize';

export default class ColorThief {
    /*
     * getColor(sourceImage[, quality])
     * returns {r: num, g: num, b: num}
     *
     * Use the median cut algorithm provided by quantize.js to cluster similar
     * colors and return the base color from the largest cluster.
     *
     * Quality is an optional argument. It needs to be an integer. 0 is the highest quality settings.
     * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
     * faster a color will be returned but the greater the likelihood that it will not be the visually
     * most dominant color.
     *
     * */

    getColor(sourceImage, quality) {
        var palette       = this.getPalette(sourceImage, 5, quality);
        var dominantColor = palette[0];
        return dominantColor;
    }

    /*
     * getPalette(sourceImage[, colorCount, quality])
     * returns array[ {r: num, g: num, b: num}, {r: num, g: num, b: num}, ...]
     *
     * Use the median cut algorithm provided by quantize.js to cluster similar colors.
     *
     * colorCount determines the size of the palette; the number of colors returned. If not set, it
     * defaults to 10.
     *
     * BUGGY: Function does not always return the requested amount of colors. It can be +/- 2.
     *
     * quality is an optional argument. It needs to be an integer. 0 is the highest quality settings.
     * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
     * faster the palette generation but the greater the likelihood that colors will be missed.
     *
     *
     */
    getPalette(sourceImage, colorCount, quality) {

        if (typeof colorCount === 'undefined') {
            colorCount = 10;
        }
        if (typeof quality === 'undefined') {
            quality = 10;
        }

        // Create custom CanvasImage object
        var image      = new CanvasImage(sourceImage);
        var imageData  = image.getImageData();
        var pixels     = imageData.data;
        var pixelCount = image.getPixelCount();

        // Store the RGB values in an array format suitable for quantize function
        var pixelArray = [];
        for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
            offset = i * 4;
            r = pixels[offset + 0];
            g = pixels[offset + 1];
            b = pixels[offset + 2];
            a = pixels[offset + 3];
            // If pixel is mostly opaque and not white
            if (a >= 125) {
                if (!(r > 250 && g > 250 && b > 250)) {
                    pixelArray.push([r, g, b]);
                }
            }
        }

        // Send array to quantize function which clusters values
        // using median cut algorithm
        var cmap    = quantize(pixelArray, colorCount);
        var palette = cmap.palette();

        // Clean up
        image.removeCanvas();

        return palette;
    }
}
