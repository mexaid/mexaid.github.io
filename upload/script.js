// Initialize Firebase
// Fill in firebase data with your own information to get progress bar working
var config = {
	apiKey: "AIzaSyDo1Sp_sRE5bPSLTjHgj5SI30WrphqhKg4",
    authDomain: "mexa-design.firebaseapp.com",
    databaseURL: "https://mexa-design-default-rtdb.firebaseio.com",
    projectId: "mexa-design",
    storageBucket: "mexa-design.appspot.com",
    messagingSenderId: "955193718764",
    appId: "1:955193718764:web:939acd864b7e82a2b3f2c9",
    measurementId: "G-ELHL0XV0TK",
};
firebase.initializeApp(config);

const init = function() {
	const fileInputElement = document.querySelector('.js-file__input');
	const fileDropZone = document.querySelector('.js-dropzone');

  // Prevents the default behavior of refresh
  // Force click on the input element
   document.querySelector('.file__input-label-button').addEventListener('click', function(e) {
      e.preventDefault();
      fileInputElement.click();
    })
  
	// Handle Creating Elements for the files using the Browse button
	fileInputElement.addEventListener('change', function(e) {
		const validatedFiles = fileValidation([...fileInputElement.files]);
		createFileDOMNode(validatedFiles);
	});

	// Prevents default behavior of automatically opening the file
	fileDropZone.addEventListener('dragover', function(e) {
		e.preventDefault();
	});

	// Gets node element list of files Converts them to a list of Arrays
	// Then calls createFileDOMNode to create DOM Element of the files
	fileDropZone.addEventListener('drop', function(e) {
		e.preventDefault();
		const unvalidatedFiles = getArrayOfFileData([...e.dataTransfer.items]);
		const validatedFiles = fileValidation(unvalidatedFiles);
		createFileDOMNode(validatedFiles);
	});
};

// Validates each file that it is the format we accept
// Then pushes the validated file to a new array
const fileValidation = function(files) {
	const errMessageOutput = document.querySelector('.file-upload__error');
	const validatedFileArray = [];
	const supportedExts = ['png', 'jpg', 'doc', 'xls', 'pdf', 'ai', 'psd'];
	files.forEach(file => {
		const ext = getFileExtension(file);
		if (supportedExts.indexOf(ext) === -1) {
			let errMessage =
				'Please upload a .doc, .png, .psd, .pdf, .ai, .xls or .jpg file only.';
			errMessageOutput.style.display = 'block';
			errMessageOutput.textContent = errMessage;
			// return '';
		} else {
			errMessageOutput.style.display = 'none';
			validatedFileArray.push(file);
		}
	});
	return validatedFileArray;
};

// Returns an array of the file data
const getArrayOfFileData = function(files) {
	const fileDataArray = [];
	files.forEach(file => {
		if (file.kind === 'file') {
			fileDataArray.push(file.getAsFile());
		}
	});
	return fileDataArray;
};

// Creates list item DOM nodes for each file uploaded
const createFileDOMNode = function(files) {
	const fileList = document.querySelector('.js-file__list');

	files.forEach(file => {
		// Create a DOM element(s) for each file dropped
		const listItemElement = document.createElement('li');
		const fileDetailsContainer = document.createElement('div');
		const fileOutputListItemImage = document.createElement('img');
		const fileOutputListItemName = document.createElement('span');
		const fileOutputListItemSVGIsComplete = document.createElement('img');
		const fileOutputListItemProgressBar = document.createElement('progress');

		// Append elements to the DOM and parent components to the elements
		fileList.appendChild(listItemElement);
		listItemElement.appendChild(fileOutputListItemImage);
		listItemElement.appendChild(fileDetailsContainer);
		fileDetailsContainer.appendChild(fileOutputListItemName);
		fileDetailsContainer.appendChild(fileOutputListItemSVGIsComplete);
		fileDetailsContainer.appendChild(fileOutputListItemProgressBar);

		// Add classs to the create element
		listItemElement.classList.add('file-output__list-item');
		fileDetailsContainer.classList.add('file-details__container');
		fileOutputListItemImage.classList.add('file-output__list-item-image');
		fileOutputListItemSVGIsComplete.classList.add(
			'file-output__list-item--is-complete'
		);
		fileOutputListItemName.classList.add('file-output__list-item-name');
		fileOutputListItemProgressBar.classList.add('file-output__progress-bar');

		//Set aria roles
		listItemElement.setAttribute('role', 'listitem');
		fileOutputListItemImage.setAttribute('role', 'image');

		fileOutputListItemName.textContent = truncateString(file.name, 25);

		const ext = getFileExtension(file);
		setAssociatedSVGWithFileType(ext, fileOutputListItemImage);
		updateDatabase(
			file,
			fileOutputListItemProgressBar,
			fileOutputListItemName,
			fileOutputListItemImage,
			fileOutputListItemSVGIsComplete
		);
	});
};

const updateDatabase = function(
	file,
	progressBarElement,
	fileNameTextElement,
	fileTypeImageElement,
	fileCompletionImageElement
) {
	// Create a storage ref
	const storageRef = firebase.storage().ref('Upload-Design/' + file.name);
	// Upload a file
	let task = storageRef.put(file);

	// Set progress bar initial and max values
	progressBarElement.value = 0;
	progressBarElement.max = 100;

	// Update progress bar
	task.on(
		'state_changed',
		function progress(snapshot) {
			const percentage =
				(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			progressBarElement.value = percentage;
			progressBarElement.classList.add('progress-bar--in-progress');
			fileCompletionImageElement.src =
				'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-close.svg';
		},

		function error(err) {
      console.log('An error has occured!');
    },

		function complete() {
			fileNameTextElement.style.opacity = '1';
			fileTypeImageElement.style.opacity = '1';
			progressBarElement.classList.add('progress-bar--is-finished');
			fileCompletionImageElement.src =
				'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-check.svg';
		}
	);
};

// Returns the files type extension
const getFileExtension = function(file) {
	return file.name.split('.').pop();
};

// Associates what svg gets matched to what type of file uploaded
const setAssociatedSVGWithFileType = function(ext, nodeElement) {
	switch (ext) {
		case 'jpg':
			nodeElement.setAttribute(
				'src',
				'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-jpg.svg'
			);
			break;
		case 'png':
			nodeElement.setAttribute(
				'src',
				'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-png.svg'
			);
			break;
		case 'doc':
			nodeElement.setAttribute(
				'src',
				'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-doc.svg'
			);
			break;
		case 'ai':
			nodeElement.setAttribute(
				'src',
				'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-ai.svg'
			);
			break;
		case 'psd':
			nodeElement.setAttribute(
				'src',
				'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-psd.svg'
			);
			break;
		case 'pdf':
			nodeElement.setAttribute(
				'src',
				'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-pdf.svg'
			);
			break;
		case 'xls':
			nodeElement.setAttribute(
				'src',
				'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2684911/icon-file-xls.svg'
			);
			break;
		default:
			return '';
	}
};

// Truncates a string if too long
const truncateString = function(str, num) {
	if (str.length > num) {
		return str.slice(0, num) + '...';
	} else {
		return str;
	}
};

init();