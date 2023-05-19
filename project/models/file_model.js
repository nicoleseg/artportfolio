/*
  Uploads file to a single Google Drive folder using a service account
  https://www.daimto.com/upload-image-to-google-drive-with-node-js/
  Don't forget to give the service account edit access to the folder
  and enable View access to anyone on the internet
*/
const fs = require('fs');
const {google} = require('googleapis');

// service account key file from Google Cloud console.
const KEYS = __dirname+"/../config/credentials.js";

// Request full drive access.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// Create a service account initialize with the service account key file and scope needed
const auth = new google.auth.GoogleAuth({
    keyFile: KEYS,
    scopes: SCOPES
});

const driveService = google.drive({version: 'v3', auth});

let fileMetadata = {
  'name': Date.now()+'_recipeimage.png',
  'parents':  ['1Tbgi06REwytedHN4xyVpk3NO_UAgUZPt']//gohde: TrinLabs/Cookbook/images
};


exports.uploadFile = async function(file) {
  let fileURL = "";
  let filePath = __dirname+"/../"+file.path;

  let media = {
       mimeType: 'image/jpeg',
       body: fs.createReadStream(filePath)
   };
   let response = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
   });

   switch(response.status){
    case 200:
        fileURL = "https://drive.google.com/uc?export=view&id="+response.data.id;
        console.log(fileURL)
        console.log('Created File Id: ', response.data.id);
        break;
    default:
        console.error('Error creating the file, ' + response.errors);
        break;
  }

  return fileURL;
}
//maybe i need to add a get request for the file itself? or get the media by itself or make this a third entity ?
