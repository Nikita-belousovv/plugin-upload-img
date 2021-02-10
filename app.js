import firebase from 'firebase/app'

import 'firebase/storage'

import {upload} from './uppload.js'

let firebaseConfig = {
    apiKey: "AIzaSyCBgUfGjeR1mbOMvvKP1QcdSuoe5SPRSkY",
    authDomain: "upload-img-plugin.firebaseapp.com",
    projectId: "upload-img-plugin",
    storageBucket: "upload-img-plugin.appspot.com",
    messagingSenderId: "1010305649599",
    appId: "1:1010305649599:web:d60fc8d932628a1a3e6f0a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()

upload('#file', 
			{
				multi: true,
				accept: ['.png','.jpg','.jpeg','.gif'],
				language: 'ru',  // ru, en
				onUpload(files, blocks){
					files.forEach((i, idx)=>{
						const ref = storage.ref(`images/${i.name}`)
						const task = ref.put(i)

						task.on('state_changed', (snapshot) => {
							const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
							const block = blocks[idx].querySelector('.preview-info-progress')

							block.textContent = percentage
							block.style.width = percentage + '%'
						}, error => {
							console.log(error)
						}, complete =>{
							task.snapshot.ref.getDownloadURL().then((url)=>{
								console.log('Download URL', url)
							})
						})
					})
				}
			}
)
