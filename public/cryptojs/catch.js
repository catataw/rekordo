
var hashesList = [];
var bar = $('.bar');

/**
 * 
 * @param list
 */
function sendHashes(list){
	
	$.post('/api/query/', {'hash' : list })
		.done(function(data){
			$("#magicTXT").html("Redirecting, wait a moment");
			setTimeout(function(){
				console.log(JSON.stringify(data))
				window.location.replace('/#/store/' + list);
			},3000)
		})
};

/**
 * 
 * @param evt
 */
function updateProgress(evt){
	if (evt.lengthComputable) {
			var percentLoaded = (((evt.loaded / evt.total)*100).toFixed(2));
	 	if (percentLoaded < 100) {
			bar.width( percentLoaded + "%");
			bar.textContent = percentLoaded + '%';
				}
	 	else {
	 		
	 	}
	}
};

/**
 * 
 * @param file
 * @param callback
 */
function readFile(file, callback) {	
    var reader = new FileReader();
    reader.onerror = function(err){
    	$('#magicTXT').html(err + ' - Error processing file - ')
    };
    reader.onload = function (e) {
    	var data = e.target.result;
    	$('#output').html('<small>Processed: ' + file.name + '<small>')
    	bar.width(100 + '%');
      	bar.textContent = '100%';
      	callback(data);
    }
    reader.onprogress = function (progressEvent) {
    	updateProgress(progressEvent);
    }
    reader.readAsBinaryString(file)
};
	
/**
 * 
 * @param file
 * @param callback
 */
function file2sha256(file, callback){
    readFile(file, function(data){
    	if (data){
    		var hash = rstr_sha256(data)
    	}
    	callback({'name' : file.name,
    		      'hash': rstr2hex(hash)}
    	)		
    })    
};

/**
 * 
 * @param list
 * @param callback
 */
function doList(list, callback){
	$.each(list,function(i){
		file2sha256(list[i], function(response) {
			hashesList.push(response.hash);
			$('#list').before('<tr><td><small>' + response.name + '</small></td><td><small>' + response.hash + '</small></td></tr>');
		})
	})
	setTimeout(function(){callback(hashesList);},1000)
}


function fireTo(files) {
    var fileList = [];
    for (var i = 0; i < files.length; i++) {
        fileList.push(files[i])
    };
    
    doList(fileList, function(object){
    	if (object){
    		sendHashes(object);
    	}
    })     
};

/**
 * 
 * @param evt
 */
function onChangeEvent(evt){
    var files = evt.target.files;
    fireTo(files);
};

/**
 * 
 * @param evt
 */
function onClickEvent(evt){
	evt.stopPropagation();
	evt.preventDefault();
    this.classList.add('hover')
    $('#files').click();
};

/**
 * 
 * @param evt
 */
function onDropEvent(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    fireTo(files);
};

/**
 * 
 * @param evt
 */
function onDragEnter(evt) {
    evt.stopPropagation();
    evt.preventDefault();	
    this.classList.add('hover')
	};

/**
 * 
 * @param evt
 */
function onDragLeave(evt) {
	evt.stopPropagation();
    evt.preventDefault();
    this.classList.remove('hover')
	};

var dropZone = document.getElementById('filedropzone');
dropZone.addEventListener("dragover", onDragEnter, false);
dropZone.addEventListener("dragleave", onDragLeave, false);
dropZone.addEventListener("drop", onDropEvent, false);
dropZone.addEventListener("click", onClickEvent, false);
document.getElementById('files').addEventListener('change', onChangeEvent, false);

