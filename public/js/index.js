const dropField = document.querySelector('.drop-field');
const browseFile = document.querySelector('.browse__file');
const browseBtn = document.querySelector('.browse--btn');

const progressContainer = document.querySelector('.progress__container');
const bgProgress = document.querySelector('.bg--progress');
const percent = document.querySelector('.percent');
const fileURL = document.querySelector('#fileURL');
const containerSharing = document.querySelector('.container__sharing');
const copyIcon = document.querySelector('.copy--icon');
const inputForm = document.querySelector('.input-form');

const host = 'http://localhost:3000/';
const uploadURL = `${host}api/v1/files`;
const emailURL = `${host}api/v1/files/send`;

// DragOver
dropField.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropField.classList.add('dragger');
});

// Dragleave
dropField.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropField.classList.remove('dragger');
});

// Drop files
dropField.addEventListener('drop', (e) => {
  e.preventDefault();
  dropField.classList.remove('dragger');
  const files = e.dataTransfer.files;
  console.log(files);
  if (files.length) {
    browseFile.files = files;
    uploadFile();
  }
});

// BrowseFile
browseFile.addEventListener('change', (e) => {
  uploadFile();
});

// Click event on input file from browse btn
browseBtn.addEventListener('click', (e) => {
  e.preventDefault();
  browseFile.click();
});

// Copy btn event on link
copyIcon.addEventListener('click', (e) => {
  e.preventDefault();
  fileURL.select(); // selecting value
  document.execCommand('copy'); // copy command
});

// Email submit event with uuid
inputForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // uuid value from copy url input
  const url = fileURL.value; //=> http://localhost/files/:uuid

  // Data field for request to server
  const formData = {
    uuid: url.split('/').splice(-1, 1)[0],
    mailTo: inputForm.elements['mailTo'].value,
    mailFrom: inputForm.elements['mailFrom'].value,
  };

  // Fetch api with post request to server
  fetch(emailURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
});

// Uploading file and sending request to the server
const uploadFile = () => {
  progressContainer.style.display = 'block';
  const file = browseFile.files[0];
  const formData = new FormData();
  formData.append('myfile', file);

  const xhr = new XMLHttpRequest(); // for request to server
  xhr.onreadystatechange = () => {
    // If the req cycle is done
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response); // response from server
      linkView(JSON.parse(xhr.response)); // parsing json data to js objects.
    }
  };

  // progress for uploading file and getting response
  // xhr has an upload object with progress event
  xhr.upload.onprogress = uploadProgress;

  xhr.open('POST', uploadURL); // Send post req
  xhr.send(formData); // Sending the file to the server with req
};

// upload progress from server
const uploadProgress = (e) => {
  // Simple logic
  // Calculate percentage for upload progress
  // loadedsize/totalsize * 100 = %
  // Here (e) event  gives the progress data in loaded and total form
  const loadPercent = Math.round((e.loaded / e.total) * 100);
  bgProgress.style.width = `${loadPercent}%`;
  percent.innerHTML = `${loadPercent}`;
};

// Show downloadViewLink in UI
const linkView = ({file: fileLink}) => {
  progressContainer.style.visibility = 'hidden';
  containerSharing.style.display = 'block';
  fileURL.value = fileLink;
};
