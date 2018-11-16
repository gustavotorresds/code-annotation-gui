$(document).ready(function() {
	// Map containing pairs of single line # => grade
	const grades = new Map();

	let activeLine = null;
	let activeLineEnd = null;

	let fileName = 'my-annotated-code';

	$('.code-upload').change(function(event) {
    	const table = $(document.createElement('table'))
    	const file = event.target.files[0];
    	fileName = file.name.substring(0, file.name.indexOf('.'));

    	var reader = new FileReader();
	    reader.onload = function(e){
	    	var contents = e.target.result;
	    	var lines = contents.split('\n');
	    	for(let i = 1; i <= lines.length; i++) {
	    		let line = lines[i - 1];

	    		const row = $(document.createElement('tr'));
	    		row.addClass('code-line');

	    		// TODO: setting the id of the rows to be just an index is pretty lame,
	    		// but it was the easiest quick-n-dirty way I could find of getting the
	    		// line numbers without doing suboptimal parsing. Any ideas of how to make
	    		// this better? Can we just use some other attribute within the element to
	    		// track which line number it is?
	    		row.attr('id', i);

	    		// We add <pre> to keep tabs showing.
	    		row.html('<td>' + i + '<td><td><pre>' + line + '</pre></td>');

	    		table.append(row);
	    	}
	    	$('#code-container').append(table);
	    };

	    reader.readAsText(file);

	    // HACK: it takes a little for the file to load, so we wait
	    // before adding the listeners.
	    setTimeout(function() {
	    	addEventToCodeLineListeners();
	    }, '1000');
    });

    // Add functionality to set grade to each line
	function addEventToCodeLineListeners() {
		$('.code-line').mousedown(function(event) {
			if(!isNaN(activeLine)) {
				for(let i = activeLine; i <= activeLineEnd; i++) {
		    		$('#' + i).removeClass('active');
		    	}
			}

			// Target element in <pre>, so we get it's parent's parent.
	    	const row = $(event.target.parentNode.parentNode);
	    	activeLine = parseInt(row.attr('id'));
	    	activeLineEnd = activeLine
	    	row.addClass('active');
	    	$('.grade-form').css('display', 'block');
	    });

	    $('.code-line').mouseup(function(event) {
			// Target element in <pre>, so we get it's parent's parent.
	    	const row = $(event.target.parentNode.parentNode);
	    	activeLineEnd = parseInt(row.attr('id'));

	    	for(let i = activeLine; i <= activeLineEnd; i++) {
	    		$('#' + i).addClass('active');
	    	}

	    	$('#grade-input').focus();
	    });
	}

    $('.grade-form').submit(function(event) {
    	event.preventDefault();

    	for(let i = activeLine; i <= activeLineEnd; i++) {
    		$('#' + i).removeClass('active');
    		$('#' + i).addClass('graded');
    	}

    	const grade = parseInt(event.target.grade.value);
    	grades.set(tuple(activeLine, activeLineEnd), grade);
    	event.target.grade.value = '';

    	$('.grade-form').css('display', 'none');

    	console.log(grades);
    });

    $('.download').click(function(event) {
    	download(fileName + '.tsv', formatContent(grades));
    });

    function download(filename, text) {
	    const element = document.createElement('a');
	    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	    element.setAttribute('download', filename);

	    element.style.display = 'none';
	    document.body.appendChild(element);

	    element.click();

	    document.body.removeChild(element);
	}

	// Each line and respective grade are separated by a tab.
	// Each sample is separated by a breakline character.
	function formatContent(map) {
		let f = "LineStart\tLineEnd\tGrade\n";
		for (var [key, value] of map) {
		  f += (key[0] + '\t' + key[1] + '\t' + value + '\n');
		}
		return f;
	};

	// V junjy element created to support Map with tuples (doesn't work with std arrays).
	// Src: https://stackoverflow.com/questions/21838436/map-using-tuples-or-objects
	// TODO: use some standard library or find a better way to represent info.
	let tuple = (function() {
	    let map = new Map();

	    function tuple() {
	        let current = map;
	        let args = Object.freeze(Array.prototype.slice.call(arguments));

	        for (let item of args) {
	            if (current.has(item)) {
	                current = current.get(item);
	            } else {
	                let next = new Map();
	                current.set(item, next);
	                current = next;
	            }
	        }

	        if (!current.final) {
	            current.final = args;
	        }

	        return current.final;
	    }

	    return tuple;
	})();
});