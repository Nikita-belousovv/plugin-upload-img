function bytesToSize(bytes) {
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
   if (bytes == 0) return '0 Byte'
   const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
   return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const element =(tag, classes = [], content)=>{
	const node = document.createElement(tag)

	if(classes.length){
		node.classList.add(...classes)
	}

	if(content){
		node.textContent = content
	}

	return node
}

const noop = () =>{}

export function upload(select, options = {}) {
	let files = []
	const onUpload = options.onUpload ?? noop
	const input = document.querySelector(select)
	const open = element('button', ['btn'])
	const previewWrap = element('div', ['preview'])
	const upload = element('button', ['btn', 'primary'])
	upload.style.display = 'none'

	if(options.language === 'ru'){
		upload.textContent = 'загрузить'
		open.textContent = 'открыть'
	} else if(options.language === 'en'){
		upload.textContent = 'upload'
		open.textContent = 'open'
	} else {
		upload.textContent = 'upload'
		open.textContent = 'open'
	}

	if(options.multi){
		input.setAttribute('multiple', true)
	}

	if(options.accept && Array.isArray(options.accept)){
		input.setAttribute('accept', options.accept.join(','))
	}

	input.insertAdjacentElement('afterend', previewWrap)
	input.insertAdjacentElement('afterend', upload)
	input.insertAdjacentElement('afterend', open)

	const triggerInput = () =>{
		input.click()
	}

	const changeHandler = (e) =>{
		if(!e.target.files.length){
			return
		}

		files = Array.from(e.target.files)

		previewWrap.innerHTML = ''
		upload.style.display = 'inline-block'

		files.forEach((i)=>{
			if(!i.type.match('image')){
				return
			}

			const reader = new FileReader()

			reader.onload = ev =>{

				const source = ev.target.result

				previewWrap.insertAdjacentHTML('afterbegin', `
						<div class="preview-image">
							<div class="preview-remove" data-name="${i.name}">&times;</div>
							<img src="${source}" alt="${i.name}"/>
							<div class="preview-info">
								<span>${i.name}</span>
								${bytesToSize(i.size)}
							</div>
						</div>
					`)
			}

			reader.readAsDataURL(i)
		})
	}

	const testRemove = (e) =>{
		if(!e.target.dataset.name){
			return
		}
		const {name} = e.target.dataset
		files = files.filter((file) => file.name !== name)

		if(!files.length){
			upload.style.display = 'none'
		}

		const block = previewWrap
									.querySelector(`[data-name="${name}"]`)
									.closest('.preview-image')
									
									block.classList.add('removing')
									setTimeout(()=>block.remove(), 300)
	}

	const clearPreview = el =>{
		el.style.bottom = '4px'
		el.innerHTML = '<div class="preview-info-progress"></div>'
	}

	const uploadHandler =()=>{
		previewWrap.querySelectorAll('.preview-remove').forEach((i)=>{
			i.remove()
		})
		const previewInfo = previewWrap.querySelectorAll('.preview-info')
		previewInfo.forEach(clearPreview)
		onUpload(files, previewInfo)
	}

	open.addEventListener('click', triggerInput)
	input.addEventListener('change', changeHandler)
	previewWrap.addEventListener('click', testRemove)
	upload.addEventListener('click', uploadHandler)
}