import fs from "fs";
import axios, { AxiosResponse } from "axios";
import Jimp = require("jimp");

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer'
      })
      const photo = await Jimp.read(response.data);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";

      const width = photo.getHeight() >= 256 ? 256 : photo.getHeight();
      const height = photo.getHeight() * (width / photo.getWidth());

      await photo
        .resize(width, height) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });

    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}